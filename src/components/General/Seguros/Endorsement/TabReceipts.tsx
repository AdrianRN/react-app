import { AccordionDetails, AccordionSummary, IconButton } from "@mui/material";
import React from "react";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { Accordion } from "../../../OuiComponents/Surfaces";
import {
  LinkLargeFont,
} from "../../../OuiComponents/Theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptsService from "../../../../services/receipts.service";
import Receipts from "../../../../models/Receipts";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import Constants from "../../../../utils/Constants";
import policySumary from "../../../../models/PolicySumary";
import receiptsGenerator from "../Policies/ReceiptsGenerator";
import { endorsementService } from "../../../../services/endorsement.service";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";



const moneyTypeNumber = (numb: number) => {
  return new Intl.NumberFormat("en-IN").format(numb);
};
const formattedDate = (date: string) => {
  const v_date = new Date(date);
  const dia = String(v_date.getDate()).padStart(2, "0");
  const mes = String(v_date.getMonth() + 1).padStart(2, "0");
  const anio = v_date.getFullYear();
  return `${dia}-${mes}-${anio}`;
};
function TabReceipts(props: any) {
  let disabledHypertext = false;
  if (props.modifyValueDisabled === true) {
    disabledHypertext = props.modifyValueDisabled;
  }
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<Receipts[]>([]);
  const [rowsPolicy, setRowsPolicy] = React.useState<Receipts[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>("");
  //Esta variable almacena el folio endoso
  const endorsementFolio = props?.endorsement?.folio ?? '';
  const policyFolio = props?.endorsement?.endorsement?.[0]?.policies?.[0]?.folio ?? '';
  React.useEffect(() => {
    //getCatalogValue();
    if(policyFolio&&policyFolio!=='')
      fetchDataEndorsement();
    if(endorsementFolio&&endorsementFolio!=='')
      fetchData();
    else
    setLoading(false);
  }, []);
  const fetchData = async () => {
    await ReceiptsService.getReceiptsByPolicyFolio(
      endorsementFolio//"POLI-51" //
    ).then(async (response)=>{
      if (response.data.length > 0) {
          setRows(response.data);
          setExpanded("REC");
        }else{//Generamos recibos preview
          //consutar la poliza para obtener datos
          await endorsementService.getEndorsementFolio(endorsementFolio).then(async (response:any)=>{
            const endorsement = response.data.endorsement[0];
            //Creamos condiciones
            //Mientras total premium sea diferente a 0
            const condicion1:boolean = (endorsement.totalPremium&&Number(endorsement.totalPremium)!==0);
            if(condicion1){//Ejecutamos creacion dummy
              const receiptDummy = await createReceipts(endorsement);
              setRows(receiptDummy);
              setExpanded("REC");

            }else{//Si no hay prima o forma de pago, no se genera nada
            }
          });
        }
        //setLoading(false);
    }).catch((exception)=>{}).finally(()=>{
      setLoading(false);
    });
  };

  const fetchDataEndorsement = async () => {
    await ReceiptsService.getReceiptsByPolicyFolio(
      policyFolio//"POLI-51" //
    ).then(async (response)=>{
      if (response.data.length > 0&&response.data!==null) {
        setRowsPolicy(response.data);
          setExpanded("POL");
        }
    }).catch((exception)=>{}).finally(()=>{
      setLoading(false);
    });
  };

  //Despliega el acordeon Accordion para mostrar los recibos.
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    //Creacion de recibos dummy
const createReceipts = async (valuesData: any) => {
  const sumary: policySumary = {
    policyFolio: props.endorsement.folio,
    createdAt: valuesData?.createdAt, //Emisión
    startValidity: valuesData?.startDate, //Vigencia De
    endValidity: valuesData?.endDate, //Vigencia Hasta
    paymentMethod: 'CAVA-234',//Anual 
    netPremium: valuesData?.netPremium, //Prima Neta
    additionalCharge: valuesData?.additionalCharge, //Recargo Monto
    surcharge: 0,//surcharge, //Recargo %
    iva: valuesData?.iva, //iva,                //Iva Monto
    rights: valuesData?.rights, //Derecho Monto/GastoExpedicion
    settingOne: valuesData?.settingOne ?? 0,
    settingTwo: valuesData?.settingTwo ?? 0,
    //compania
    insuranceId: valuesData?.policies?.[0]?.insuranceId,
    insuranceCompany: valuesData?.policies?.[0]?.insuranceCompany,
    //grupo
    groups: '',//policyDataHook?.groups,
    groupsDescription: '',
    //cliente
    clientId: valuesData?.policies?.[0]?.clientId,
    clientName: valuesData?.policies?.[0]?.clientName,
    //ramo
    branchId: valuesData?.policies?.[0]?.branchId,
    branch: '',//'',

    totalPremium: valuesData?.totalPremium, //Prima Total
    payReceipt: '',
    currency: 'CAVA-68',

    policyType:'Endosos Seguros',
    receiptStatus:Constants.receiptStatus.preview,
  };
//console.log(sumary)
 const receiptDummy = await receiptsGenerator(sumary);
 return receiptDummy;
};

return (
  <>
    <Box>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Accordion
        sx={{ marginBottom: "30px" }}
        expanded={expanded === "REC"}
        onChange={handleAccordionChange("REC")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{ flexGrow: 1, LinkLargeFont }}
            variant="h5"
            style={{ color: "#FF8F15" }}
          >
            Recibos del endoso
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        {ShowReceipts( rows )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ marginBottom: "30px" }}
        expanded={expanded === "POL"}
        onChange={handleAccordionChange("POL")}
      >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{ flexGrow: 1, LinkLargeFont }}
            variant="h5"
            style={{ color: "#FF8F15" }}
          >
            Recibos de la poliza
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        {ShowReceipts( rowsPolicy )}
        </AccordionDetails>
        </Accordion>
    </Box>
    {(loading !== false) ? <LoadingScreen message='Cargando' /> : <></>}
  </>
);
  }

export default TabReceipts;

const ROUND = (numb: number) => {
  return Math.ceil(numb * 100) / 100;
};

function ShowReceipts (rows: Receipts[]){
  return(<>
  
  {rows.map((receipt: Receipts, index) => (
            <Stack key={receipt.receiptFolio} display="column">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: "24px",
                      borderRadius: 8,
                      marginBottom: "24px",
                    }}
                  >
                    <Grid
                      container
                      justifyContent="space-around"
                      style={{ marginTop: "20px" }}
                    >
                      <Grid item >
                        <Typography
                          sx={{ fontSize: "70px", textAlign: "center" }}
                        >
                          <strong>{receipt.receiptNumber?? index + 1}</strong>{" "}
                        </Typography>
                        <Typography >
                              <strong >{receipt?.descriptionReceiptStatus?.description ?? 'VISTA PREVIA'}</strong>
                            </Typography>
                      </Grid>

                      <Grid item >
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <Typography>
                              <strong>Vigencia </strong>
                            </Typography>
                            <Typography>
                              <strong>De: </strong>
                              {formattedDate(
                                receipt.startValidity ?? ""
                              ) }
                            </Typography>
                            <Typography>
                              <strong>Hasta: </strong>
                              {formattedDate(
                                  receipt.endValidity ?? ""
                                )}
                            </Typography>
                            {/* <Typography>
                              {" "}
                              <strong>Vence: </strong>
                              {formattedDate(
                                receipt.dueDate ?? ""
                              )}
                            </Typography> */}
                            
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item >
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography>
                              <strong>Prima neta: </strong>
                              {"$"}
                              {moneyTypeNumber(receipt.netPremium)}
                            </Typography>
                            <Typography>
                              <strong>Descuento 1: </strong>
                              {"$"}
                              {moneyTypeNumber(receipt.settingOne)}
                            </Typography>
                            <Typography>
                              <strong>Descuento 2: </strong>
                              {"$"}
                              {moneyTypeNumber(receipt.settingTwo)}
                            </Typography>
                            <Typography>
                              <strong>Recargo: </strong>
                              {"$"}{moneyTypeNumber(ROUND(receipt.additionalCharge))}
                              
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item >
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography>
                              <strong>Derecho: </strong>
                              {"$"}
                              {moneyTypeNumber(ROUND(receipt.rights))}
                            </Typography>
                            {/* <Typography>
                              <strong>Financiamiento: </strong>
                              {receipt.financing}
                            </Typography> */}
                            {/* <Typography>
                              <strong>I.V.A: </strong>
                              {receipt.ivaPercentage}
                              {"%"}
                            </Typography> */}
                            <Typography>
                              <strong>I.V.A: </strong>
                              {"$"}
                              {moneyTypeNumber(ROUND(receipt.ivaAmount))}
                            </Typography>
                            {/* <Typography>
                              <strong>Prima neta monto: </strong>
                              {"$"}
                              {moneyTypeNumber(
                                ROUND(receipt.netPremiumAmount)
                              )}
                            </Typography> */}
                            <Typography>
                              <strong> Prima total: </strong>
                              {"$"}
                              {moneyTypeNumber(
                                ROUND(Number(receipt.grandTotal))
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      
                    </Grid>
                    
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          ))}
        
  </>)
}