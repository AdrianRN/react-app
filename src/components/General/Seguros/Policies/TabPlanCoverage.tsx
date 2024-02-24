import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, styled } from "@mui/material";
import React from "react";
import { Divider, Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPureWhite,
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Button, Select } from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Paper } from "../../../OuiComponents/Surfaces";
import CoveragePackage from "../../../../insuranceModels/coveragepackage";
import CoveragePackagesService from "../../../../insuranceServices/coveragepackages.service";
import FormatData from "../../../../utils/Formats.Data";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Complete } from "../../../OuiComponents/Icons";
import { useFormik } from "formik";
import PolicyService from "../../../../insuranceServices/policies.service";
import Policies from "../../../../insuranceModels/policies";
import CacheService from "../../../../services/cache.service";
import Constants from "../../../../utils/Constants";
import CatalogValue from "../../../../models/CatalogValue";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import { Dialog } from "../../../OuiComponents/Feedback";
import policyHooks from "../../../../hooks/policyHooks";
import policySumary from "../../../../models/PolicySumary";
import receiptsGenerator from "./ReceiptsGenerator";
import { getCatalogValueFolio } from "../../../../services/catalogvalue.service";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";

interface policyDoneData {
  message: string;
  done: boolean;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function TabPlanCoverage(props: any) {
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
  const [policy, setPolicy] = React.useState<Policies>();
  const [coveragePackages, setCoveragePackages] =
    React.useState<CoveragePackage[]>();
  const [expanded, setExpanded] = React.useState<string | false>("");

  const [disabled, setDisabled] = React.useState(false);
  const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
  const [confirmContent, setConfirmContent] = React.useState("");
  const [openContent, setOpenContent] = React.useState(false);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  React.useEffect(() => {
    fetchData();
    fetchValidateStatusPoliciy();
  }, []);

  const fetchData = async () => {
    const policyResponse = await PolicyService.getPoliciesByFolio(props.data);
    const coveragePackage = await CoveragePackagesService.getByCompanyFolio(props.insuranceId);

    setCoveragePackages(coveragePackage.data);
    if (policyResponse.data) {
      const responsePolicyDone = await policyHooks.getPolicyDone(policyResponse.data)
      setPolicyDone(responsePolicyDone)
      if(policyResponse?.data?.policyStatusFolio)//===============================================================;
        policyResponse.data.policyStatusFolio=Constants.statusActiveFolio;//===============================================================;
      setPolicy(policyResponse.data);
    }
  };

  const handleClose = () => {
    setOpenContent(false);
  };

  const fetchValidateStatusPoliciy = async () => {
    const policieResponse = await PolicyService.getPoliciesByFolio(props.data);
    if (policieResponse.data) {
      setDisabled(policieResponse.data.policyStatusFolio === Constants.statusActiveFolio ? true : false)
    }
  };

  const onSubmit = (data: any) => {
    PolicyService.putCoveragePackageByFolio(props.data, data.folio)
      .then((response: any) => {
        setDataAlert(true, "El paquete se asoció a la póliza con éxito.", "success", autoHideDuration);
        fetchData();
        props.onDataChange(props.data);
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
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
      .then(async (response: any) => {
        setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
        await createReceipts(response.data);//===============================================================;
        props.onDataChange(props.data);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }).finally(() => {
        setOpenContent(false);
      })
  }
   //===============================================================;
   const createReceipts = async (policy: any) => {
    let fullname = policy?.clientName ?? 'NAME';
    //Obtenemos nombre del grupo
    const groupData = await getCatalogValueFolio(policy?.groups);
    let groupName = groupData?.data?.description ?? '';
    //Obtenemos los branches de la compania
    const companiData = await CompaniesBranchesService.getBranchesByCompanyFolio(policy?.insuranceId);
    const valuesDataIndex = companiData.data.reduce((acc: any, el: any) => {
      acc[el.branchId] = el;
      return acc;
    }, {});
    //Obtenemos el nombre del branch
    let branchName = valuesDataIndex[policy?.branchId]?.branch?.description??'';
    //Obtenemos la comision
    let branchCommission = Number(valuesDataIndex[policy?.branchId]?.branch?.commissionPercentage)??0;
    const sumary: policySumary = {
      policyFolio: policy.folio ?? props?.policy ?? "",
      createdAt: policy.issuanceDate, //Emisión
      startValidity: policy.startValidity, //Vigencia De
      endValidity: policy.endValidity, //Vigencia Hasta
      paymentMethod: policy.paymentFrequency, //Pago Anual CATALOG
      netPremium: policy.netPremium, //Prima Neta
      additionalCharge: policy.additionalCharge, //Recargo Monto
      surcharge: policy.financing, //surcharge, //Recargo %
      iva: policy.iva, //iva,                //Iva Monto
      rights: policy.rights, //Derecho Monto/GastoExpedicion
      settingOne: policy.settingOne ?? 0,
      settingTwo: policy.settingTwo ?? 0,
      //compania
      insuranceId: policy.insuranceId,
      insuranceCompany: policy.insuranceCompany,
      //grupo
      groups: policy.groups, //policyDataHook?.groups,
      groupsDescription: groupName,
      //cliente
      clientId: policy.clientId,
      clientName: fullname,//policy.clientName,
      //ramo
      branchId: policy.branchId,
      branch:   branchName, //'',
      totalPremium: policy.totalPremium, //Prima Total
      payReceipt: "",
      currency: policy.currency,
      policyType: "Seguros",
      sellerFolio: policy.salesPerson,
      noPolicy: policy.noPolicy,
      commissions: (policy.netPremium - (policy.settingOne + policy.settingTwo)) * (branchCommission ?? 0 / 100),
    };
    receiptsGenerator(sumary);
  };
  //===============================================================;

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      folio: policy?.coveragePackageFolio ?? "",
    },
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography sx={LinkLargeFont}>Paquete</Typography>
        <Stack direction="column" spacing={4}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={6} lg={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography sx={{ ...TextSmallFont }}>Paquete</Typography>
                <Select
                  sx={{ width: "100%" }}
                  name="folio"
                  defaultValue={0}
                  value={values.folio ? values.folio : 0}
                  onChange={handleChange}
                  disabled={disabledHypertext ?? disabled}
                >
                  <MenuItem key={0} value={0} disabled>
                    Selecciona
                  </MenuItem>
                  {coveragePackages?.map((packages: any) => (
                    <MenuItem key={packages.folio} value={packages.folio}>
                      {packages.packageName}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4} textAlign="center">
              <Button
                type="submit"
                size="small"
                endIcon={<Complete color={ColorPureWhite} />}
                disabled={disabledHypertext ?? disabled}
              >
                Agregar Paquete
              </Button>
            </Grid>
            <Grid item xs={12} md={6} lg={4} />
          </Grid>
          <Divider />
          <Typography sx={LinkLargeFont}>Coberturas</Typography>
          {coveragePackages ? (
            <>
              <Paper square={false} sx={{ height: "40vh" }}>
                <Box overflow="auto">
                  {coveragePackages
                    .filter((p) => p.folio === values.folio)
                    .map((packages: CoveragePackage) =>
                      Object(packages.coverages).map((coverages: any) => (
                        <Accordion
                          expanded={expanded === coverages._id}
                          onChange={handleAccordionChange(coverages._id)}
                          key={coverages._id}
                        >
                          <AccordionSummary>
                            <Typography sx={{ ...LinkSmallFont }}>
                              {coverages.name}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <>
                              <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextXSmallFont }}>
                                  Monto Asegurado:{" "}
                                  {FormatData.currencyFormat(
                                    Number.parseFloat(coverages.amount)
                                  )}
                                </Typography>
                                <Typography sx={{ ...TextXSmallFont }}>
                                  Deducible: {coverages.deductible}%
                                </Typography>
                              </Stack>
                            </>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    )}
                </Box>
              </Paper>
            </>
          ) : (
            <Paper square={false} sx={{ height: "40vh" }} />
          )}
        </Stack>
      </Box>
      <Box paddingTop={3}>
        <Stack direction="row" spacing={1} justifyContent="end">
          <Button
            disabled={!props.data || disabled || disabledHypertext}
            endIcon={<Complete color={ColorPureWhite} />}
            onClick={validateIssue}
          >
            Emitir Póliza
          </Button>
        </Stack>
      </Box>
      <Dialog open={openContent} onClose={handleClose}>
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.data && policyDone?.done ? (
            <>
              <Button size="small" variant="text" onClick={handleClose}>
                No
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={handleIssue}
              >
                Si
              </Button>
            </>
          ) : (
            <Button size="small" variant="text" onClick={handleClose}>
              Regresar
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
    </>
  );
}

export default TabPlanCoverage;
