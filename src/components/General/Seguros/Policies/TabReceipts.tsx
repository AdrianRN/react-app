import React from "react";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { Accordion } from "../../../OuiComponents/Surfaces";
import {  LinkLargeFont } from "../../../OuiComponents/Theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptsService from "../../../../services/receipts.service";
import Receipts from "../../../../models/Receipts";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import Constants from "../../../../utils/Constants";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import policySumary from "../../../../models/PolicySumary";
import receiptsGenerator from "./ReceiptsGenerator";
import PolicyService from '../../../../insuranceServices/policies.service';
import policyHooks from "../../../../hooks/policyHooks";

interface policyDoneData {
  message: string;
  done: boolean;
}

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
  const [expanded, setExpanded] = React.useState<string | false>("");
  //Esta variable almacena el folio de la poliza
  const policyFolio = props.data;
  const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
  const [confirmContent, setConfirmContent] = React.useState("");
  const [openContent, setOpenContent] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    //getCatalogValue();
    const fetchData = async () => {
      await ReceiptsService.getReceiptsByPolicyFolio(
        policyFolio//"POLI-51" //
      ).then(async (response) => {
        if (response.data.length > 0) {
          setRows(response.data);
          setExpanded("REC");
        } else {//Generamos recibos preview
          //consutar la poliza para obtener datos
          await PolicyService.getPoliciesByFolio(policyFolio).then(async (response: any) => {
            //Creamos condiciones
            //Mientras total premium sea diferente a 0
            const condicion1: boolean = (response.data.totalPremium && Number(response.data.totalPremium) !== 0);
            //Mientras tengamos una forma de pago seleccionada
            const condicion2: boolean = (response.data.paymentFrequency && response.data.paymentFrequency !== '' && response.data.paymentFrequency !== null);
            if (condicion1 && condicion2) {//Ejecutamos creacion dummy
              const receiptDummy = await createReceipts(response.data);
              setRows(receiptDummy);
              setExpanded("REC");

            } else {//Si no hay prima o forma de pago, no se genera nada

            }
          });
        }
        //setLoading(false);
      }).catch((exception) => { }).finally(() => {
        setLoading(false);
      });

      const policyResponse = await PolicyService.getPoliciesByFolio(props.data);

      if (policyResponse.data) {
        const responsePolicyDone = await policyHooks.getPolicyDone(policyResponse.data)
        setPolicyDone(responsePolicyDone)
        setDisabled(policyResponse.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)
      }
    };
    if (policyFolio)
      fetchData();
    else
      setLoading(false);
  }, []);

  const handleClose = () => {
    setOpenContent(false);
  };

  //Despliega el acordeon Accordion para mostrar los recibos.
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  //Creacion de recibos dummy
  const createReceipts = async (policy: any) => {
    const sumary: policySumary = {
      policyFolio: policy.folio,
      createdAt: policy.issuanceDate, //Emisión
      startValidity: policy.startValidity, //Vigencia De
      endValidity: policy.endValidity, //Vigencia Hasta
      paymentMethod: policy.paymentFrequency, //Pago Anual CATALOG
      netPremium: policy.netPremium, //Prima Neta
      additionalCharge: policy.additionalCharge, //Recargo Monto
      surcharge: policy.financing,//surcharge, //Recargo %
      iva: policy.iva, //iva,                //Iva Monto
      rights: policy.rights, //Derecho Monto/GastoExpedicion
      settingOne: policy.settingOne ?? 0,
      settingTwo: policy.settingTwo ?? 0,
      //compania
      insuranceId: policy.insuranceId,
      insuranceCompany: policy.insuranceCompany,
      //grupo
      groups: policy.groups,//policyDataHook?.groups,
      groupsDescription: 'groupsData.description',
      //cliente
      clientId: policy.clientId,
      clientName: policy.clientName,
      //ramo
      branchId: policy.branchId,
      branch: 'branchDescription',//'',
      totalPremium: policy.totalPremium, //Prima Total
      payReceipt: '',
      currency: policy.currency,
      policyType: 'Seguros',
      receiptStatus: Constants.receiptStatus.preview,
    };

    //console.log(sumary)
    const receiptDummy = await receiptsGenerator(sumary);
    return receiptDummy;
  };

  const validateIssue = () => {
    PolicyService.checkIssuanceStatus(props.data)
      .then((response: any) => {
        setConfirmContent(policyDone ? policyDone.message : "");
      })
      .catch((error) => {
        setPolicyDone({ done: false, message: '' })
        setConfirmContent(error.response.data.error.message);
      })
      .finally(() => {
        setOpenContent(true);
      })
  }

  const handleIssue = () => {
    PolicyService.issuancePolicy(props.data)
      .then((response: any) => {
        setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
        setOpenContent(false);
        setTimeout(() => {
          setLoading(true);
        }, 1000);
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }).finally(() => {
        setOpenContent(false);
      })
  }

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
                <Grid container spacing={3} key={index}>
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
