import React from "react";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import ModelSubBranch from "../../../../models/SubBranch";
import ModelPolicy from "../../../../insuranceModels/policies";
import { Entidad } from "../../../../models/Entidad";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import {
  Autocomplete,
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  styled,
} from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CacheService from "../../../../services/cache.service";
import LocationService from "../../../../services/location.service";
import Constants from "../../../../utils/Constants";
import SubBranchesService from "../../../../services/subbranches.service";
import PolicyService from "../../../../insuranceServices/policies.service";
import FormatData from "../../../../utils/Formats.Data";
import { useFormik } from "formik";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import {
  Button,
  InputAdornment,
  Select,
  Switch,
  TextField,
} from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import CatalogValue from "../../../../models/CatalogValue";
import ModelPeople from "../../../../models/People";
import PeopleService from "../../../../services/people.service";
import {
  Alert,
  CircularProgress,
  Dialog,
  Snackbar,
} from "../../../OuiComponents/Feedback";
import { Complete } from "../../../OuiComponents/Icons";
import policySumary from "../../../../models/PolicySumary";
import policyHooks from "../../../../hooks/policyHooks";
import fetchBranchPaymentData from "./fetchBranchPaymentData";
import receiptsGenerator from "./ReceiptsGenerator";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";

interface PolicyFormData {
  branchCatalog: CacheCatalogValue;
  subBranchCatalog: ModelSubBranch;
  currencyCatalog: CacheCatalogValue;
  paymentMethodCatalog: CacheCatalogValue;
  collectionTypeCatalog: CacheCatalogValue;
  countryCatalog: CacheCatalogValue;
  statusCatalog: CacheCatalogValue[];
  paymentFrequencyCatalog: CacheCatalogValue | undefined;
  groupsCatalog: CacheCatalogValue;
  Policy: ModelPolicy;
  Entity: Entidad[];
}

interface policyDoneData {
  message: string;
  done: boolean;
}

type groupType = {
  group: string;
  description: string;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

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

function GeneralDataTab(props: any) {
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
  const [disabled, setDisabled] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [valuesData, setValuesData] = React.useState<PolicyFormData>();
  const [confirmContent, setConfirmContent] = React.useState("");
  const [openContent, setOpenContent] = React.useState(false);

  const [valueClient, setValueClient] = React.useState<any | null>(null);
  const [optionsClient, setOptionsClient] = React.useState<ModelPeople[]>([]);
  const [loadingClient, setLoadingClient] = React.useState(false);

  const [salesPersons, setSalesPersons] = React.useState<any[]>([])
  const [valueSalesPerson, setValueSalesPerson] = React.useState<any | null>(null)

  const [municipalities, setMunicipalities] = React.useState<any[]>();
  const [locations, setLocations] = React.useState<any[]>();

  const [discountsettingOne, setDiscountsettingOne] = React.useState(false);
  const [discountsettingTwo, setDiscountsettingTwo] = React.useState(false);
  const [iva, setIva] = React.useState<number>(16);
  //Este hook sirve para settear el derecho dependiendo del metodo de pago
  const [issuingCostHook, setIssuingCostHook] = React.useState(0);
  //Este hook sirve para guardar la comision de onesta
  const [commissionsONESTA, setCommissionsONESTA] = React.useState(0);
  const [groupsData, setGroupsData] = React.useState<groupType>({
    group: "string",
    description: "string",
  });
  const [branchDescription, setBranchDescription] = React.useState("");
  const [policyDone, setPolicyDone] = React.useState<policyDoneData | null>();
  const [searchZipCode, setSearchZipCode] = React.useState(false);

  //Este hook activa o desactiva la pantalla de carga
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseBranchesCatalog = await CacheService.getByFolioCatalog(
        Constants.branchesCatalogFolio
      );
      const responseCurrencyCatalog = await CacheService.getByFolioCatalog(
        Constants.currencyCatalogFolio
      );
      const responseCollectionTypeCatalog =
        await CacheService.getByFolioCatalog(
          Constants.collectionTypeCatalogFolio
        );
      const responsePaymentMethodCatalog = await CacheService.getByFolioCatalog(
        Constants.paymentMethodCatalogFolio
      );
      const responseCountriesCatalog = await CacheService.getByFolioCatalog(
        Constants.countriesCatalogFolio
      );
      const responseStatusCatalog = await CacheService.getByFolioCatalog(
        Constants.statusCatalogFolio
      );
      const responseSubBranchesCatalog = await SubBranchesService.getByBranch(
        props.data.folioBranch
      );
      const responseEntityCatalog = await LocationService.getStates();
      const responseGroupsCatalog = await CacheService.getByFolioCatalog(
        Constants.groupsCatalogFolio
      );
      const responsePolicyData =
        props.policy ?? props.data.dataPolicy
          ? await PolicyService.getPoliciesByFolio(
            props.policy ?? props.data.dataPolicy
          )
          : undefined;
      const salesPerson = await PeopleService.getSellers('');
      setSalesPersons(salesPerson.data)

      if (responsePolicyData) {
        const responsePolicyDone = await policyHooks.getPolicyDone(responsePolicyData.data)
        setPolicyDone(responsePolicyDone)

        const branch = Object(responseBranchesCatalog.data.values ?? []).find(
          (branch: CatalogValue) =>
            branch.folio === responsePolicyData.data.branchId
        );
        if (branch) setBranchDescription(branch.description);

        let responseClient = null;

        try {
          responseClient = await PeopleService.getById(
            responsePolicyData.data.clientId
          );
          setValueClient(responseClient.data);
          if (responseClient.data.groupId) {
            const groupIndexed = responseGroupsCatalog.data.values.reduce(
              (acc: any, el: any) => {
                acc[el.folio] = el;
                return acc;
              },
              {}
            );
            setGroupsData({
              group: responseClient.data.groupId,
              description:
                groupIndexed?.[responseClient.data.groupId].description,
            });
          }
        } catch (error) {
          console.log("error", error);
        }

        if (responsePolicyData.data.salesPerson) {
          const salesPerson = await PeopleService.getById(
            responsePolicyData.data.salesPerson
          );
          setFieldValue('salesPerson', responsePolicyData.data.salesPerson)
          setValueSalesPerson(salesPerson.data);
        }

        handleStateMunicipalities(responsePolicyData.data.state);
        handleMunicipalitie(
          responsePolicyData.data.state,
          responsePolicyData.data.municipality
        );
        Object(responseStatusCatalog.data.values)
          .filter((s: CatalogValue) => s.description === Constants.statusActive)
          .map((status: any) => {
            if (status.folio === responsePolicyData.data.policyStatusFolio) {
              setDisabled(true);
            }
          });
      } else if (props.data.clientId) {
        const responseClient = await PeopleService.getById(props.data.clientId);
        setFieldValue("clientId", responseClient.data.folio)
        setFieldValue("clientName", responseClient.data.name + ' ' +
          responseClient.data.lastName + ' ' +
          responseClient.data.maternalLastName)
        setFieldValue("rfc", responseClient.data.rfc)
        setFieldValue("groups", responseClient.data.groupId);
        setValueClient(responseClient.data);

        if (responseClient.data.groupId) {
          const groupIndexed = responseGroupsCatalog.data.values.reduce(
            (acc: any, el: any) => {
              acc[el.folio] = el;
              return acc;
            },
            {}
          );
          setGroupsData({
            group: responseClient.data.groupId,
            description:
              groupIndexed?.[responseClient.data.groupId].description,
          });
        }
      }

      //Obtenemos los datos del branch seleccionado
      const dataBranch: any = await fetchBranchPaymentData(props.data);
      //Guardamos el Derecho (Gasto de expedición) en el hook
      setIssuingCostHook(Number(dataBranch?.issuingCost));
      setCommissionsONESTA(Number(dataBranch?.commissionPercentage));
      setFieldValue('rights', dataBranch?.issuingCost);
      setValuesData({
        branchCatalog: responseBranchesCatalog.data,
        currencyCatalog: responseCurrencyCatalog.data,
        paymentMethodCatalog: responsePaymentMethodCatalog.data,
        collectionTypeCatalog: responseCollectionTypeCatalog.data,
        countryCatalog: responseCountriesCatalog.data,
        statusCatalog: responseStatusCatalog.data,
        //----------------------------------------------------------------;
        //Abriendio Resultado de hook
        paymentFrequencyCatalog: dataBranch?.data, ///responsePaymentFrequencyCatalog.data,
        //CatalogPaymentFrequency:
        //----------------------------------------------------------------;
        subBranchCatalog: responseSubBranchesCatalog.data,
        groupsCatalog: responseGroupsCatalog.data,
        Policy: responsePolicyData
          ? responsePolicyData.data
          : responsePolicyData,
        Entity: responseEntityCatalog.data,
      });

      if (responsePolicyData) {
        handleSetPolicyData(responsePolicyData.data);
      }

    } catch (e) {
      console.error("error: ", e);
    } finally {
      setWaiting(false);
      setExpanded("DG");
    }
  };

  const handleSetPolicyData = (policyData: any) => {
    setValues({
      insuranceId: policyData.insuranceId,
      insuranceCompany: policyData.insuranceCompany,
      branchId: policyData.branchId,
      subBranchId: policyData.subBranchId,
      noPolicy: policyData.noPolicy,
      endorsement: policyData.endorsement,
      agentNumber: policyData.agentNumber,
      renewablePolicy: policyData.renewablePolicy,
      issuanceDate: FormatData.stringDateFormat(policyData.issuanceDate),
      startValidity: FormatData.stringDateFormat(policyData.startValidity),
      endValidity: FormatData.stringDateFormat(policyData.endValidity),
      currency: policyData.currency,
      paymentFrequency: policyData.paymentFrequency,
      paymentMethod: policyData.paymentMethod,
      collectionMethod: policyData.collectionMethod,
      clientId: policyData.clientId,
      clientName: policyData.clientName,
      rfc: policyData.rfc,
      street: policyData.street,
      neighborhood: policyData.neighborhood,
      state: policyData.state,
      municipality: policyData.municipality,
      locality: policyData.locality,
      zip: policyData.zip,
      country: policyData.country,
      salesPerson: policyData.salesPerson,
      coveragePackageFolio: policyData.coveragePackageFolio,
      groups: policyData.groups,
      comments: policyData.comments,
      netPremium: policyData.netPremium,
      settingOne: policyData.settingOne,
      settingTwo: policyData.settingTwo,
      rights: policyData.rights,
      financing: policyData.financing,
      iva: policyData.iva,
      totalPremium: policyData.totalPremium,
      additionalCharge: policyData.additionalCharge,
      subtotal: policyData.subtotal,
      receipts: policyData.receipts,
      commissionPercentage: policyData.commissionPercentage,
      policyStatusFolio: policyData.policyStatusFolio,
      policyStatusDescription: policyData.policyStatusDescription,
      objectStatusId: policyData.objectStatusId,
      concept: policyData.concept,
      health: policyData.health,
      personPolicie: policyData.personPolicie,
    });
  };

  const handleClose = () => {
    setOpenContent(false);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleInputPeopleChange = async (name: any, value: any) => {
    setTimeout(async () => {
      if (value) {
        let response = null;
        setLoadingClient(true);

        response = await PeopleService.getAllByName(value);

        if (response == null) {
          setOptionsClient([]);
          setLoadingClient(false);
          return;
        }

        const list = response.data;

        list.map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const fullName = `${row[column]}`.trim();
              row["name"] = fullName;
              return { field: "name", headerName: "Name" };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });

        //Si el listado es de otro tipo y no cuenta con la propiedad 'name'
        list.map((row: { [key: string]: any }) => {
          if (!row["lastName"]) {
            Object.keys(row).map((column) => {
              if (
                column
                  .toLowerCase()
                  .includes((props.name ? props.name : "name").toLowerCase())
              ) {
                row["name"] = row[column];
              }
            });
          } else {
            return;
          }
        });

        setOptionsClient(list);
        setLoadingClient(false);

      } else {
        setOptionsClient([]);
        setLoadingClient(false);
      }
    }, 500);
  };

  const handleStateMunicipalities = async (cvE_ENT: number) => {
    if (cvE_ENT > 0) {
      LocationService.getMunicipalitiesByStateId(cvE_ENT)
        .then((response) => {
          setMunicipalities(response.data[0].municipalitiesList);
        });
    }
  };

  const handleMunicipalitie = async (cvE_ENT: number, cvE_MUN: number) => {
    if (cvE_ENT > 0 && cvE_MUN > 0) {
      LocationService.getColoniesByStateIdMunicipalityId(cvE_ENT, cvE_MUN)
        .then((response) => {
          setLocations(response.data[0].coloniesList);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const additionSubTotal = (data: any) => {
    const subTotal =
      Number(data.netPremium) -
      Number(data.settingOne) -
      Number(data.settingTwo) +
      Number(data.additionalCharge) +
      Number(data.rights);
    return Number(subTotal.toFixed(2));
  };

  const additionCharge = (data: any) => {
    const additionalCharge =
      (data.netPremium - (data.settingOne + data.settingTwo)) *
      (data?.financing / 100);
    return Number(additionalCharge).toFixed(4);
  };

  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchZipCode(true);

    let state: number = 0;
    let city: number = 0;

    LocationService.getZipCodeInfo(zipCode)
      .then((response: any) => {
        //Se obtienen los id´s
        state = response.data[0].estadoId;
        city = response.data[0].municipioId;

        //Llenado de colonias
        setLocations(response.data[0].chubbColonies);

        LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            //Llenado de municipios
            setMunicipalities(response.data[0].municipalitiesList);

            //Se mapean campos
            setFieldValue("state", state.toString());
            setFieldValue("municipality", city.toString());
            setFieldValue("country", Constants.folioMexico);

            props.onValueChange('state', state.toString());
            props.onValueChange('municipality', city.toString());
            props.onValueChange('country', Constants.folioMexico);
          })
          .catch((e: Error) => {
            setDataAlert(
              true,
              "Error, no se encontraron municipios.",
              "error",
              autoHideDuration
            );
            return;
          })
          .finally(() => {
            setSearchZipCode(false);
          });
      })
      .catch((e: Error) => {
        setDataAlert(
          true,
          "Error, no existe el CP buscado.",
          "error",
          autoHideDuration
        );
        setSearchZipCode(false);
        return;
      });
  };

  const onSubmit = (data: any) => {
    if (props.policy ?? props.data.dataPolicy) {
      PolicyService.put(props.policy ?? props.data.dataPolicy, data)
        .then((response: any) => {
          setDataAlert(
            true,
            "La Póliza se actualizó con éxito.",
            "success",
            autoHideDuration
          );
          fetchData();
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      PolicyService.post(data)
        .then((response: any) => {
          setDataAlert(
            true,
            "La Póliza se registro con éxito.",
            "success",
            autoHideDuration
          );
          props.onDataChange(response.data.folio);
          fetchData()

          setTimeout(() => {
            props.onPostPolicy(null, 1)
          }, 3000);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
    handleClose();
  };

  const validateSave = (values: any) => {
    if (!values.clientId) {
      errors.clientId = "Este campo es requerido."
      setExpanded('CON')
      return
    } else {
      submitForm()
    }
  }

  const validateIssue = (values: any) => {
    if (!values.noPolicy) {
      errors.noPolicy = "Este campo es requerido."
      setExpanded('DG')
      return
    } else if (!values.subBranchId) {
      errors.subBranchId = "Este campo es requerido."
      setExpanded('DG')
      return
    } else if (!values.currency) {
      errors.currency = "Este campo es requerido."
      setExpanded('VIG')
      return
    } else if (!values.paymentFrequency) {
      errors.paymentFrequency = "Este campo es requerido."
      setExpanded('VIG')
      return
    } else if (!values.collectionMethod) {
      errors.collectionMethod = "Este campo es requerido."
      setExpanded('VIG')
      return
    } else if (!values.clientId) {
      errors.clientId = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.zip) {
      errors.zip = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (Object(values.zip).length < 5 || Object(values.zip).length > 5) {
      errors.zip = "El formato es incorrecto."
      setExpanded('CON')
      return
    } else if (!values.country) {
      errors.country = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.state) {
      errors.state = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.municipality) {
      errors.municipality = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.locality) {
      errors.locality = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.street) {
      errors.street = "Este campo es requerido."
      setExpanded('CON')
      return
    } else if (!values.salesPerson) {
      errors.salesPerson = "Este campo es requerido."
      setExpanded('VAR')
      return
    } else if (values.netPremium < 0.0001) {
      errors.netPremium = "El campo de prima no tiene valor."
      setExpanded('IMP')
      return
    } else {
      PolicyService.put(props.policy, values)
        .then((response: any) => {
          PolicyService.checkIssuanceStatus(props.policy)
            .then((response: any) => {
              setConfirmContent(policyDone ? policyDone.message : "");
            })
            .catch((error) => {
              setConfirmContent(error.response.data.error.message);
            })
            .finally(() => {
              setOpenContent(true);
            })
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
  }

  const handleIssue = () => {
    PolicyService.issuancePolicy(props.policy ?? props.data.dataPolicy)
      .then((response: any) => {
        setDataAlert(true, "La póliza ha sido emitida correctamente.", "success", autoHideDuration);
        createReceipts(values);
        setTimeout(() => {
          props.onValueChange('policyStatusFolio', Constants.statusActiveFolio);
          fetchData();
        }, 1000);
      }).catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }).finally(() => {
        setOpenContent(false);
      });
  }

  const initialValues = {
    insuranceId: props.data.data.folio ?? "",
    insuranceCompany: props.data.data.corporateName ?? "",
    branchId: props.data.folioBranch ?? "",
    subBranchId: "",
    noPolicy: "",
    endorsement: 0,
    agentNumber: "",
    renewablePolicy: true,
    issuanceDate: FormatData.stringDateFormat(new Date().toString()),
    startValidity: FormatData.stringDateFormat(new Date().toString()),
    endValidity: FormatData.stringDateFormat(
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString()
    ),
    currency: "",
    paymentFrequency: "",
    paymentMethod: "",
    collectionMethod: "",
    clientId: "",
    clientName: "",
    rfc: "",
    street: "",
    neighborhood: "",
    state: 0,
    municipality: 0,
    locality: 0,
    zip: "",
    country: "",
    salesPerson: "",
    coveragePackageFolio: "",
    groups: "",
    comments: "",
    netPremium: 0,
    settingOne: 0,
    settingTwo: 0,
    rights: 0,
    financing: 0,
    iva: 0,
    totalPremium: 0,
    additionalCharge: 0,
    subtotal: 0,
    receipts: 0,
    commissionPercentage: 0,
    policyStatusFolio: Constants.statusPendingFolio,
    policyStatusDescription: Constants.statusPending,
    objectStatusId: 1,
    concept: "",
    health: 0,
    personPolicie: null,
  };
  
  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    submitForm,
    setValues,
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true
  });

  //===============================================================;
  const createReceipts = async (policy: any) => {
    let fullname = '';
    if (valueClient?.name) {
      fullname = valueClient.name +
        " " +
        valueClient?.lastName +
        " " +
        valueClient?.maternalLastName;
    } else if (policy.clientId || props?.policy) {
      const responseClient = await PeopleService.getById(
        policy.clientId
      );
      if (responseClient?.data?.name)
        fullname = responseClient.data.name + ' '
          + responseClient.data.lastName + ' ' +
          responseClient.data.maternalLastName;
    }


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
      groups: groupsData.group, //policyDataHook?.groups,
      groupsDescription: groupsData.description,
      //cliente
      clientId: policy.clientId,
      clientName: fullname,//policy.clientName,
      //ramo
      branchId: policy.branchId,
      branch: branchDescription, //'',
      totalPremium: policy.totalPremium, //Prima Total
      payReceipt: "",
      currency: policy.currency,
      policyType: "Seguros",
      sellerFolio: policy.salesPerson,
      noPolicy: policy.noPolicy,
      commissions: (policy.netPremium - (policy.settingOne + policy.settingTwo)) * (commissionsONESTA ?? 0 / 100),
    };
    receiptsGenerator(sumary);
  };
  //===============================================================;

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={3}>
          <Box>
            <Accordion
              expanded={expanded === "DG"}
              onChange={handleAccordionChange("DG")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>
                  DATOS GENERALES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        No. de Póliza
                      </Typography>
                      <TextField
                        disabled={disabled || disabledHypertext}
                        placeholder="No. de Póliza"
                        name="noPolicy"
                        value={values.noPolicy}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('noPolicy', value.target.value);
                        }}
                        helperText={errors.noPolicy}
                        error={!!errors.noPolicy}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Compañía
                      </Typography>
                      <TextField
                        placeholder="Compañia"
                        name="insuranceCompany"
                        value={values.insuranceCompany}
                        disabled
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Estatus póliza
                      </Typography>
                      <Select
                        sx={{ width: "100%" }}
                        name="policyStatusFolio"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('policyStatusFolio', value.target.value);
                        }}
                        defaultValue={0}
                        value={
                          valuesData?.statusCatalog && values.policyStatusFolio
                            ? values.policyStatusFolio
                            : 0
                        }
                        disabled
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.statusCatalog.values ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Ramo</Typography>
                      <Select
                        sx={{ width: "100%" }}
                        name="branchId"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('branchId', value.target.value);
                        }}
                        defaultValue={0}
                        value={valuesData?.branchCatalog ? values.branchId : 0}
                        disabled
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.branchCatalog.values ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Subramo</Typography>
                      <Select
                        sx={{ width: "100%" }}
                        name="subBranchId"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('subBranchId', value.target.value);
                        }}
                        value={values.subBranchId ? values.subBranchId : 0}
                        error={!!errors.subBranchId}
                        disabled={disabled || disabledHypertext}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.subBranchCatalog ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.subBranchId}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Concepto (Opcional)
                      </Typography>
                      <TextField
                        disabled={disabled || disabledHypertext}
                        placeholder="Concepto"
                        name="concept"
                        value={values.concept}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('concept', value.target.value);
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "VIG"}
              onChange={handleAccordionChange("VIG")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>FECHAS</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Emisión</Typography>
                      <TextField
                        fullWidth
                        disabled={disabled || disabledHypertext}
                        name="issuanceDate"
                        value={values.issuanceDate}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('issuanceDate', value.target.value);
                        }}
                        type="date"
                        helperText={errors.issuanceDate}
                        error={!!errors.issuanceDate}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Vigencia De
                      </Typography>
                      <TextField
                        fullWidth
                        disabled={disabled || disabledHypertext}
                        name="startValidity"
                        value={values.startValidity}
                        onChange={(e) => {
                          setFieldValue('startValidity', e.target.value)
                          props.onValueChange('startValidity', e.target.value);
                          setFieldValue('endValidity', FormatData.getEndValidityByStartValidty(e.target.value))
                        }}
                        type="date"
                        helperText={errors.startValidity}
                        error={!!errors.startValidity}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Vigencia Hasta
                      </Typography>
                      <TextField
                        name="endValidity"
                        disabled={disabled || disabledHypertext}
                        value={values.endValidity}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('endValidity', value.target.value);
                        }}
                        type="date"
                        helperText={errors.endValidity}
                        error={!!errors.endValidity}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Moneda</Typography>
                      <Select
                        sx={{ width: "100%" }}
                        disabled={disabled || disabledHypertext}
                        name="currency"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('currency', value.target.value);
                        }}
                        defaultValue={0}
                        value={values.currency ? values.currency : 0}
                        error={!!errors.currency}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.currencyCatalog.values ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.currency}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Forma de pago
                      </Typography>
                      <Select
                        sx={{ width: "100%" }}
                        disabled={disabled || disabledHypertext}
                        name="paymentFrequency"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('paymentFrequency', value.target.value);
                        }}
                        defaultValue={0}
                        value={
                          values.paymentFrequency ? values.paymentFrequency : 0
                        }
                        error={!!errors.paymentFrequency}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.paymentFrequencyCatalog ?? []).map(
                          (data: any) => (
                            <MenuItem
                              key={data.folio}
                              value={data.folio}
                              onClick={() => {
                                values.financing = Number(data?.surcharge);
                              }}
                              onBlur={() => {
                                values.financing = Number(data?.surcharge);
                              }}
                            >
                              {data?.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.paymentFrequency}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Forma de cobro
                      </Typography>
                      <Select
                        sx={{ width: "100%" }}
                        disabled={disabled || disabledHypertext}
                        name="collectionMethod"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('collectionMethod', value.target.value);
                        }}
                        value={
                          values.collectionMethod ? values.collectionMethod : 0
                        }
                        error={!!errors.collectionMethod}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(
                          valuesData?.collectionTypeCatalog.values ?? []
                        ).map((data: any) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data.description}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.collectionMethod}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "CON"}
              onChange={handleAccordionChange("CON")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>CONTRATANTE</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Nombre</Typography>
                      <Autocomplete
                        disabled={
                          disabledHypertext
                            ? disabledHypertext
                            : values.policyStatusDescription ===
                              Constants.statusActive
                              ? true
                              : false
                        }
                        noOptionsText="No se encontraron coincidencias, capture uno nuevo."
                        loadingText="Buscando..."
                        options={optionsClient ?? []}
                        loading={loadingClient}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        getOptionLabel={(option: ModelPeople) => {
                          return (
                            option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName
                          );
                        }}
                        onInputChange={(e, value) => {
                          handleInputPeopleChange("clientId", value);
                        }}
                        onChange={(e, value) => {
                          setLoadingClient(false);
                          if (value) {
                            setFieldValue("clientId", value.folio);
                            setFieldValue("clientName",
                              `${value?.name} ${value?.lastName} ${value?.maternalLastName}`
                            );
                            setFieldValue("rfc", value.rfc);
                            setFieldValue("groups", value.groupId);
                            setValueClient(value);

                            props.onValueChange('clientId', value.folio);
                            props.onValueChange('clientName',
                              `${value?.name} ${value?.lastName} ${value?.maternalLastName}`
                            );
                          } else {
                            setFieldValue("clientId", "");
                            setFieldValue("clientName", "");
                            setFieldValue("rfc", "");
                            setFieldValue("groups", "");
                            setValueClient(null);
                          }
                        }}
                        value={valueClient}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              placeholder="Buscar"
                              name="clientId"
                              error={!!errors.clientId}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingClient ? (
                                      <CircularProgress
                                        sx={{ color: "#E5105D" }}
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                              helperText={errors.clientId?.toString()}
                            />
                          );
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.folio}>
                            {option.name +
                              " " +
                              option.lastName +
                              " " +
                              option.maternalLastName}
                          </li>
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                      <TextField
                        placeholder="RFC"
                        name="rfc"
                        value={
                          values.rfc
                            ? values.rfc
                            : valueClient
                              ? valueClient.rfc
                              : ""
                        }
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('rfc', value.target.value);
                        }}
                        helperText={errors.rfc?.toString()}
                        error={!!errors.rfc}
                        disabled
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Grupos</Typography>
                      <Select
                        sx={{ width: "100%" }}
                        value={valuesData?.groupsCatalog && values.groups ? values.groups : 0}
                        defaultValue={0}
                        disabled
                        onChange={(e) => {
                          props.onValueChange('groups', e.target.value);
                        }}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.groupsCatalog.values ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>CP</Typography>
                      <TextField
                        disabled={disabled || disabledHypertext}
                        placeholder="Código Postal"
                        type="text"
                        name="zip"
                        value={values.zip ? values.zip : ""}
                        onChange={(e) => {
                          setFieldValue("zip", e.target.value);
                          props.onValueChange('zip', e.target.value);
                          if (e.target.value.length === 5) {
                            fetchLocationDataByZipCode(e.target.value);
                          } else {
                            setSearchZipCode(false);
                          }
                        }}
                        helperText={errors.zip}
                        error={!!errors.zip}
                        InputProps={{
                          readOnly: searchZipCode,
                          endAdornment: (
                            <React.Fragment>
                              {searchZipCode ? (
                                <CircularProgress
                                  sx={{ color: "#E5105D" }}
                                  size={20}
                                />
                              ) : null}
                            </React.Fragment>
                          ),
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>País</Typography>
                      <Select
                        disabled={disabled || disabledHypertext}
                        sx={{ width: "100%" }}
                        name="country"
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('country', value.target.value);
                        }}
                        defaultValue={0}
                        value={values.country ? values.country : 0}
                        error={!!errors.country}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.countryCatalog.values ?? []).map(
                          (data: CatalogValue) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data.description}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.country}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Estado</Typography>
                      <Select
                        disabled={disabled || disabledHypertext}
                        sx={{ width: "100%" }}
                        name="state"
                        defaultValue={0}
                        value={values.state ? values.state : 0}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('state', value.target.value);
                        }}
                        error={!!errors.state}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.Entity ?? []).map(
                          (data: Entidad) => (
                            <MenuItem
                              onClick={() => {
                                setFieldValue("municipality", 0);
                                setFieldValue("locality", 0);
                                handleStateMunicipalities(data.cvE_ENT);
                              }}
                              key={data.cvE_ENT}
                              value={data.cvE_ENT}
                            >
                              {data.noM_ENT}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.state}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Municipio
                      </Typography>
                      <Select
                        disabled={disabled || disabledHypertext}
                        sx={{ width: "100%" }}
                        name="municipality"
                        value={
                          municipalities && values.municipality
                            ? values.municipality
                            : 0
                        }
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('municipality', value.target.value);
                        }}
                        error={!!errors.municipality}
                        defaultValue={0}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(municipalities ?? []).map((data: any) => (
                          <MenuItem
                            onClick={() => {
                              setFieldValue("locality", 0);
                              handleMunicipalitie(
                                Number(values.state),
                                data.municipalityId
                              );
                            }}
                            key={data.municipalityId}
                            value={data.municipalityId}
                          >
                            {data.municipalityName}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.municipality}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Colonia</Typography>
                      <Select
                        disabled={disabled || disabledHypertext}
                        sx={{ width: "100%" }}
                        name="locality"
                        value={
                          locations && values.locality ? values.locality : 0
                        }
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('locality', value.target.value);
                        }}
                        error={!!errors.locality}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(locations ?? []).map((data: any) => (
                          <MenuItem
                            onClick={() => {
                              setFieldValue("neighborhood", data.colonyName);
                              props.onValueChange('neighborhood', data.colonyName);
                            }}
                            key={data.colonyId}
                            value={data.colonyId}
                          >
                            {data.colonyName}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.locality}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Calle</Typography>
                      <TextField
                        disabled={disabled || disabledHypertext}
                        placeholder="Calle"
                        name="street"
                        value={values.street}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('street', value.target.value);
                        }}
                        helperText={errors.street}
                        error={!!errors.street}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "VAR"}
              onChange={handleAccordionChange("VAR")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>VARIOS</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Vendedor
                      </Typography>
                      <Autocomplete
                        disabled={disabled || disabledHypertext}
                        noOptionsText="No se encontraron coincidencias"
                        loadingText="Buscando..."
                        options={salesPersons ?? []}
                        isOptionEqualToValue={(option, value) =>
                          option.folio === value.folio
                        }
                        getOptionLabel={(option: any) => {
                          return (
                            option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName
                          );
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              placeholder="Buscar"
                              name="salesPerson"
                              onChange={(value) => {
                                handleChange(value);
                              }}
                              error={!!errors.salesPerson}
                              helperText={errors.salesPerson}
                            />
                          );
                        }}
                        onChange={(event, value) => {
                          if (value) {
                            setFieldValue("salesPerson", value.folio);
                            setValueSalesPerson(value);

                            props.onValueChange('salesPerson', value.folio);
                          } else {
                            setFieldValue("salesPerson", '');
                            setValueSalesPerson(null);
                          }
                        }}
                        value={valueSalesPerson ?? null}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="column" spacing={2}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Observaciones
                      </Typography>
                      <TextField
                        fullWidth
                        disabled={disabled || disabledHypertext}
                        multiline
                        rows={4}
                        placeholder="Observaciones"
                        name="comments"
                        value={values.comments}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('comments', value.target.value);
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "IMP"}
              onChange={handleAccordionChange("IMP")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>PRIMAS</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography
                        sx={{ ...TextSmallFont, paddingBottom: "8px" }}
                      >
                        Prima neta
                      </Typography>
                      <TextField
                        disabled={disabled || disabledHypertext}
                        name="netPremium"
                        value={Number(
                          values.netPremium ? values.netPremium : 0.0001
                        ).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('netPremium', value.target.value);
                        }}
                        helperText={errors.netPremium}
                        error={!!errors.netPremium}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          inputComponent: NumericFormatCustom as any,
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Box
                        display="flex"
                        alignSelf="center"
                        alignItems="center"
                      >
                        <Switch
                          disabled={disabled || disabledHypertext}
                          inputProps={{ "aria-label": "Descuento" }}
                          onChange={(event, checked) => {
                            setDiscountsettingOne(checked);
                            if (!checked) {
                              setFieldValue("settingOne", 0);
                            }
                          }}
                          value={discountsettingOne}
                        />
                        <Typography paddingLeft={2}>DESCUENTO 1</Typography>
                      </Box>
                      <TextField
                        name="settingOne"
                        value={Number(
                          values.settingOne ? values.settingOne : 0.0001
                        ).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('settingOne', value.target.value);
                        }}
                        helperText={errors.settingOne}
                        error={!!errors.settingOne}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ color: "red" }}
                            >
                              <Typography>-</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "red",
                          },
                        }}
                        disabled={
                          !discountsettingOne || disabled || disabledHypertext
                        }
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Box
                        display="flex"
                        alignSelf="center"
                        alignItems="center"
                      >
                        <Switch
                          disabled={disabled || disabledHypertext}
                          inputProps={{ "aria-label": "Descuento" }}
                          onChange={(event, checked) => {
                            setDiscountsettingTwo(checked);
                            if (!checked) setFieldValue("settingTwo", 0);
                          }}
                          value={discountsettingTwo}
                        />
                        <Typography paddingLeft={2}>DESCUENTO 2</Typography>
                      </Box>
                      <TextField
                        name="settingTwo"
                        value={Number(
                          values.settingTwo ? values.settingTwo : 0.0001
                        ).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('settingTwo', value.target.value);
                        }}
                        helperText={errors.settingTwo}
                        error={!!errors.settingTwo}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ color: "red" }}
                            >
                              <Typography>-</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "red",
                          },
                        }}
                        disabled={
                          !discountsettingTwo || disabled || disabledHypertext
                        }
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography
                        sx={{ ...TextSmallFont, paddingBottom: "8px" }}
                      >
                        Recargo pago fraccionado
                      </Typography>
                      <TextField
                        name="additionalCharge"
                        value={Number(additionCharge(values)).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('additionalCharge', value.target.value);
                        }}
                        helperText={errors.additionalCharge}
                        error={!!errors.additionalCharge}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          inputComponent: NumericFormatCustom as any,
                        }}
                        disabled
                      />
                      <Typography>{values.financing} %</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Derecho</Typography>
                      <TextField
                        disabled
                        name="rights"
                        value={Number(
                          values.rights ? values.rights : 0.0001
                        ).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('rights', value.target.value);
                        }}
                        helperText={errors.rights}
                        error={!!errors.rights}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          inputComponent: NumericFormatCustom as any,
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Subtotal
                      </Typography>
                      <TextField
                        name="subtotal"
                        value={Number(
                          (values.subtotal = additionSubTotal(values))
                        ).toFixed(2)}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('subtotal', value.target.value);
                        }}
                        helperText={errors.subtotal}
                        error={!!errors.subtotal}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          inputComponent: NumericFormatCustom as any,
                        }}
                        disabled
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>I.V.A.</Typography>
                      <TextField
                        disabled
                        name="iva"
                        value={Number(
                          (values.iva = (
                            (Number(values.subtotal) * iva) /
                            100
                          )).toFixed(2)
                        )}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('iva', value.target.value);
                        }}
                        helperText={errors.iva}
                        error={!!errors.iva}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                        }}
                      />
                      <Typography>{iva}.00 %</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Prima total
                      </Typography>
                      <TextField
                        name="totalPremium"
                        value={Number(
                          (values.totalPremium = (
                            Number(values.subtotal) + Number(values.iva)
                          )).toFixed(2)
                        )}
                        onChange={(value) => {
                          handleChange(value);
                          props.onValueChange('totalPremium', value.target.value);
                        }}
                        helperText={errors.totalPremium}
                        error={!!errors.totalPremium}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                        }}
                        disabled
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} justifyContent="end">
              <Button
                disabled={disabled || disabledHypertext}
                endIcon={<Complete color={ColorPureWhite} />}
                onClick={() => { validateSave(values) }}
              >
                {props.policy ?? props.data.dataPolicy
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
              <Button
                disabled={
                  (!props.policy ?? !props.data.dataPolicy) ||
                  disabled ||
                  disabledHypertext
                }
                endIcon={<Complete color={ColorPureWhite} />}
                onClick={() => { validateIssue(values) }}
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
              {(props.policy ?? props.data.dataPolicy) && policyDone?.done ? (
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
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
      {waiting !== false ? <LoadingScreen message="Cargando" /> : <></>}
    </>
  );
}

export default GeneralDataTab;
