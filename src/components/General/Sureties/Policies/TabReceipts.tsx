import { AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { Accordion } from "../../../OuiComponents/Surfaces";
import { LinkLargeFont } from "../../../OuiComponents/Theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptsService from "../../../../services/receipts.service";
import Receipts from "../../../../models/Receipts";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import Constants from "../../../../utils/Constants";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import policySumary from "../../../../models/PolicySumary";
import receiptsGenerator from "../../Seguros/Policies/ReceiptsGenerator";
import PolicyService from '../../../../insuranceServices/policies.service';
import bondService from "../../../../services/bonds.service";

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
  //console.log('Propiedades ',props);
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
  const [expanded, setExpanded] = React.useState<string | false>("");
  //Esta variable almacena el folio de la poliza
  const folioBond = props?.data?.policyId;
  React.useEffect(() => {
    //getCatalogValue();
    const fetchData = async () => {
      await ReceiptsService.getReceiptsByPolicyFolio(
        folioBond//"POLI-51" //
      ).then(async (response)=>{
        if (response.data.length > 0) {
            setRows(response.data);
            setExpanded("REC");
            
          }else{//Generamos recibos preview
            //consutar la poliza para obtener datos
            await bondService.getByFolio(folioBond).then(async (response:any)=>{
              //console.log('poliza bond: ',response.data)
              //Creamos condiciones
              //Mientras total amount sea diferente a 0
              const condicion1:boolean = (response.data.totalAmount&&Number(response.data.totalAmount)!==0);
              if(condicion1){//Ejecutamos creacion dummy
                const receiptDummy = await createReceipts(response.data);
                setRows(receiptDummy);
                setExpanded("REC");

              }else{//Si no hay prima o forma de pago, no se genera nada
                //console.log('No hay prima')
                //console.log('response.data.totalAmount: ', response.data.totalAmount)
              }

          });
        }
          //setLoading(false);
      }).catch((exception)=>{}).finally(()=>setLoading(false));
    };
    if(folioBond)
      fetchData();
    else
    setLoading(false);
  }, []);

  //Despliega el acordeon Accordion para mostrar los recibos.
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

    //Creacion de recibos dummy
const createReceipts = async (data: any) => {
  const sumary: policySumary = {
    policyFolio: data.folio,
    createdAt: new Date(data.startCoverage), //Emisión
    startValidity: new Date(data.endExecutionPeriod), //Vigencia De
    endValidity: new Date(data.endCoverage), //Vigencia Hasta
    paymentMethod: 'CAVA-234',//data.paymentFrequency, //Pago Anual CATALOG
    netPremium: data.netPremium, //Prima Neta
    additionalCharge: 0,//policy.additionalCharge, //Recargo Monto
    surcharge: 0,//policy.financing,//surcharge, //Recargo %
    iva: 0,//Number(iva?.description),  //Iva Monto
    rights: data.fees, //Derecho Monto/GastoExpedicion
    settingOne: 0,//policy.settingOne ?? 0,
    settingTwo: 0,//policy.settingTwo ?? 0,
    //compania
    insuranceId: data.suretyCompany,
    insuranceCompany: data.suretyCompany,
    //grupo
    groups: 'group?.folio',//policyDataHook?.groups,
    groupsDescription: 'group?.description',
    //cliente
    clientId: data.debtor,
    clientName: data.beneficiaryName,
    //ramo
    branchId: 'branch?.folio',
    branch: 'branch?.description',//'',
    totalPremium: data.totalAmount, //Prima Total
    payReceipt: '',
    currency: data.currency,
    policyType:'Fianzas',
    receiptStatus:Constants.receiptStatus.preview,
  };
  //console.log('Sumary: ',sumary)
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
                Recibos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
