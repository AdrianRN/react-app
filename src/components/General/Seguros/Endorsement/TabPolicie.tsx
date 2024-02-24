import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as Yup from "yup";
import { useAlertContext } from "../../../../context/alert-context";
import ModelPolicy from "../../../../insuranceModels/policies";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CatalogValue from "../../../../models/CatalogValue";
import { Entidad } from "../../../../models/Entidad";
import Location from "../../../../models/Location";
import Municipalitie from "../../../../models/Municipalitie";
import ModelSubBranch from "../../../../models/SubBranch";
import CacheService from "../../../../services/cache.service";
import { endorsementService } from "../../../../services/endorsement.service";
import LocationService from "../../../../services/location.service";
import PeopleService from "../../../../services/people.service";
import SubBranchService from "../../../../services/subbranches.service";
import Constants from "../../../../utils/Constants";
import FormatData from "../../../../utils/Formats.Data";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import {
  Button,
  InputAdornment,
  Select,
  Switch,
  TextField
} from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Accordion } from "../../../OuiComponents/Surfaces";
import {
  LinkLargeFont,
  TextSmallFont
} from "../../../OuiComponents/Theme";
import fetchBranchPaymentData from "../Policies/fetchBranchPaymentData";
import TabPolicySkeleton from "./TabPolicySkeleton";


interface PolicyFormData {
  CatalogBranches: CacheCatalogValue;
  CatalogCurrency: CacheCatalogValue;
  CatalogPaymentMethod: CacheCatalogValue;
  CatalogCollectionType: CacheCatalogValue;
  CatalogCountries: CacheCatalogValue;
  CatalogStatus: CacheCatalogValue[];
  CatalogPaymentFrequency: CacheCatalogValue;
  CatalogSubBranch: ModelSubBranch;
  Policy: ModelPolicy;
  Entity: Entidad[];
  Groups: CacheCatalogValue;
}
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
        prefix="$"
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

function TabPolicie(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [loading, setLoading] = React.useState(true);
  const [valuesData, setValuesData] = React.useState<PolicyFormData>();
  const [seller, setSeller] = React.useState<any | null>(null);
  const [person, setPerson] = React.useState<any | null>(null);
  const [people, setPeople] = React.useState([]);
  const [loadingPeople, setLoadingPeople] = React.useState(false);
  const [salesPeople, setSalesPeople] = React.useState([]);
  const [loadingsalesPeople, setLoadingSalesPeople] = React.useState(false);
  const [municipalities, setMunicipalities] = React.useState<
    readonly Municipalitie[]
  >([]);
  const [discountsettingOne, setDiscountsettingOne] = React.useState(false);
  const [discountsettingTwo, setDiscountsettingTwo] = React.useState(false);
  const [additionalChargeIva, setAdditionalChargeIva] = React.useState(false);
  const [iva, setIva] = React.useState<number>(16);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [validateStatusPolicy, setValidateStatusPolicy] = React.useState("");
  //Este hook sirve para settear el derecho dependiendo del metodo de pago
  const [issuingCostHook, setIssuingCostHook] = React.useState(0);
  const [newIssuingCostHook, setNewIssuingCostHook] = React.useState(0);
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
  const [searchZipCode, setSearchZipCode] = React.useState(false);
  const fetchLocationDataByZipCode = async (zipCode: string) => {
    setSearchZipCode(true);

    let state: number = 0;
    let city: number = 0;

    LocationService.getZipCodeInfo(zipCode)
      .then(async (response: any) => {
        //Se obtienen los id´s
        state = response.data[0].estadoId;
        city = response.data[0].municipioId;

        //Llenado de colonias
        //setLocations(response.data[0].chubbColonies);
        await handleMunicipalitie(state, city);
        LocationService.getMunicipalitiesByStateId(response.data[0].estadoId)
          .then((response: any) => {
            //Llenado de municipios
            setMunicipalities(response.data[0].municipalitiesList);

            //Se mapean campos
            setFieldValue("state", state.toString());
            setFieldValue("municipality", city.toString());
            setFieldValue("country", Constants.folioMexico);
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
  const handleInputChange = (event: any, newValue: any) => {
    setLoadingPeople(true);
    searchPeople(newValue);
  };

  const searchPeople = async (filtro: string) => {
    const peopleCatalog = await PeopleService.getAllByName(filtro);
    setPeople(peopleCatalog.data);
    setLoadingPeople(false);
  };

  const handleInputChangeSalesPeople = (event: any, newValue: any) => {
    setLoadingSalesPeople(true);
    searchSalesPeople(newValue);
  };

  const searchSalesPeople = async (filtro: string) => {
    const salesPeopleCatalog = await PeopleService.getSellers(filtro);
    setSalesPeople(salesPeopleCatalog.data);
    setLoadingSalesPeople(false);
  };

  
  const [transactionEndorsement, setTransactionEndorsement] =
    React.useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (props.endorsement.endorsement[0].policies[0]) {
        const restPeople = await PeopleService.getById(
          props.endorsement.endorsement[0].policies[0].clientId
        );
        const restPeopleSeller = await PeopleService.getById(
          props.endorsement.endorsement[0].policies[0].salesPerson
        );
        setTransactionEndorsement(
          props.endorsement.endorsement[0].transactions
        );
        setPerson(restPeople.data);
        setSeller(restPeopleSeller.data);
        setDiscountsettingOne(
          props.endorsement.endorsement[0].policies[0].datasettingOne > 0
        );
        setDiscountsettingTwo(
          props.endorsement.endorsement[0].policies[0].datasettingTwo > 0
        );
        setAdditionalChargeIva(
          props.endorsement.endorsement[0].policies[0].datarenewablePolicy > 0
        );
        await handleStateMunicipalities(props.endorsement.endorsement[0].policies[0].state);
        await handleMunicipalitie(props.endorsement.endorsement[0].policies[0].state,
          props.endorsement.endorsement[0].policies[0].municipality);
      }
      const restBranches = await CacheService.getByFolioCatalog(Constants.branchesCatalogFolio);
      const restCurrency = await CacheService.getByFolioCatalog(Constants.currencyCatalogFolio);
      const restCollectionType = await CacheService.getByFolioCatalog(Constants.collectionTypeCatalogFolio);
      const restCatalogPaymentMethod = await CacheService.getByFolioCatalog(
        Constants.paymentMethodCatalogFolio
      );
      const restCatalogCountries = await CacheService.getByFolioCatalog(Constants.countriesCatalogFolio);
      const restCatalogStatus = await CacheService.getByFolioCatalog(Constants.statusCatalogFolio);
      const policyProps = props.endorsement.endorsement?.[0].policies?.[0];
      const sumary = {
        folioBranch: policyProps.branchId,
        data: {
          folio: policyProps.insuranceId,
        },
      };
      const dataBranch: any = await fetchBranchPaymentData(sumary);
      setIssuingCostHook(
        Number(policyProps.rights) ?? Number(dataBranch?.issuingCost)
      );
      setNewIssuingCostHook(Number(dataBranch?.issuingCost) ?? 0);
      //----------------------------------------------------------------;
      const restCatalogSubBranches = await SubBranchService.getByBranch(
        props.endorsement.endorsement[0].policies[0]
          ? props.endorsement.endorsement[0].policies[0].branchId
          : props.endorsement.endorsement[0].policies[0].folioBranch
      );

      const restCatalogEntity = await LocationService.getStates();
      const restGroups = await CacheService.getByFolioCatalog(Constants.groupsCatalogFolio);
      setValuesData({
        CatalogBranches: restBranches.data.values,
        CatalogCurrency: restCurrency.data.values,
        CatalogPaymentMethod: restCatalogPaymentMethod.data.values,
        CatalogCollectionType: restCollectionType.data.values,
        CatalogCountries: restCatalogCountries.data.values,
        CatalogStatus: restCatalogStatus.data.values,
        //----------------------------------------------------------------;
        CatalogPaymentFrequency: dataBranch?.data, //restCatalogPaymentFrequency.data.values,
        //----------------------------------------------------------------;
        CatalogSubBranch: restCatalogSubBranches.data,
        Policy: props.endorsement.endorsement[0].policies[0] ?? [],
        Entity: restCatalogEntity.data,
        Groups: restGroups.data.values,
      });

      setLoading(false);
    };
    if(loading!==false)
      fetchData();
  }, [loading]);

  const onSubmit = (data: ModelPolicy) => {
    endorsementService
      .putEndorsementPolicies(
        props.endorsement.folio,
        props.endorsement.endorsement[0].folioEndo,
        props.endorsement.endorsement[0].policies[0].folio,
        data
      )
      .then((response: any) => {
        setDataAlert(
          true,
          "La copia de la Póliza se actualizó con éxito.",
          "success",
          autoHideDuration
        );
        props.onDataChange(response.data);
        // props.tabChange(2);
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const initialValues: ModelPolicy = {
    policyId: props.endorsement.endorsement[0].policies[0].policyId ?? "",
    folio: props.endorsement.endorsement[0].policies[0].folio ?? "",
    folioOT: props.endorsement.endorsement[0].policies[0].folioOT ?? "",
    policyStatusDescription:
      props.endorsement.endorsement[0].policies[0].policyStatusDescription ??
      "",
    insuranceId: props.endorsement.endorsement[0].policies[0].data
      ? props.endorsement.endorsement[0].policies[0].data.folio
      : props.endorsement.endorsement[0].policies[0]
      ? props.endorsement.endorsement[0].policies[0].insuranceId
      : "",
    insuranceCompany: props.endorsement.endorsement[0].policies[0].data
      ? props.endorsement.endorsement[0].policies[0].datacorporateName
      : props.endorsement.endorsement[0].policies[0]
      ? props.endorsement.endorsement[0].policies[0].insuranceCompany
      : "",
    branchId: props.endorsement.endorsement[0].policies[0].data
      ? props.endorsement.endorsement[0].policies[0].data.folioBranch
      : props.endorsement.endorsement[0].policies[0]
      ? props.endorsement.endorsement[0].policies[0].branchId
      : "",
    subBranchId: props.endorsement.endorsement[0].policies[0].subBranchId ?? "",

    noPolicy: props.endorsement.endorsement[0].policies[0].noPolicy ?? "",
    endorsement: props.endorsement.endorsement[0].policies[0].endorsement ?? 0,
    agentNumber: props.endorsement.endorsement[0].policies[0].agentNumber ?? "",
    renewablePolicy:
      props.endorsement.endorsement[0].policies[0].renewablePolicy ?? true,
    issuanceDate: FormatData.stringDateFormat(
      props.endorsement.endorsement[0].policies[0].issuanceDate ??
        new Date().toString()
    ),
    startValidity: FormatData.stringDateFormat(
      props.endorsement.endorsement[0].policies[0].startValidity ??
        new Date().toString()
    ),
    endValidity: FormatData.stringDateFormat(
      props.endorsement.endorsement[0].policies[0].endValidity ??
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toString()
    ),
    currency: props.endorsement.endorsement[0].policies[0].currency ?? "",
    paymentMethod:
      props.endorsement.endorsement[0].policies[0].paymentMethod ?? "",
    collectionMethod:
      props.endorsement.endorsement[0].policies[0].collectionMethod ?? "",
    paymentFrequency:
      props.endorsement.endorsement[0].policies[0].paymentFrequency ?? "",
    clientId: props.endorsement.endorsement[0].policies[0].clientId ?? "",
    clientName: props.endorsement.endorsement[0].policies[0].clientName ?? "",
    rfc: props.endorsement.endorsement[0].policies[0].rfc
      ? props.endorsement.endorsement[0].policies[0].rfc
      : "",
    street: props.endorsement.endorsement[0].policies[0].street ?? "",
    neighborhood:
      props.endorsement.endorsement[0].policies[0].neighborhood ?? "",
    state: props.endorsement.endorsement[0].policies[0].state ?? 0,
    municipality:
      Number(props.endorsement.endorsement[0].policies[0].municipality) ?? 0,
    locality: Number(props.endorsement.endorsement[0].policies[0].locality) ?? 0,
    zip: props.endorsement.endorsement[0].policies[0].zip ?? 0,
    country: props.endorsement.endorsement[0].policies[0].country ?? "",
    salesPerson: props.endorsement.endorsement[0].policies[0].salesPerson ?? "",
    beneficiaryFolio:
      props.endorsement.endorsement[0].policies[0].beneficiaryFolio ?? "",
    coveragePackageFolio:
      props.endorsement.endorsement[0].policies[0].coveragePackageFolio ?? "",
    groups: props.endorsement.endorsement[0].policies[0].groups ?? "",
    comments: props.endorsement.endorsement[0].policies[0].comments ?? "",
    netPremium: props.endorsement.endorsement[0].policies[0].netPremium ?? 0,
    settingOne: props.endorsement.endorsement[0].policies[0].settingOne ?? 0,
    settingTwo: props.endorsement.endorsement[0].policies[0].settingTwo ?? 0,
    //----------------------------------------------------------------;
    rights: issuingCostHook, //props.endorsement.endorsement[0].policies[0].rights ?? 0,
    //----------------------------------------------------------------;
    financing: props.endorsement.endorsement[0].policies[0].financing ?? 0,
    financingPercentage:
      props.endorsement.endorsement[0].policies[0].financingPercentage ?? 0,
    iva: props.endorsement.endorsement[0].policies[0].iva ?? "0",
    totalPremium:
      props.endorsement.endorsement[0].policies[0].totalPremium ?? "0",
    additionalCharge:
      props.endorsement.endorsement[0].policies[0].additionalCharge ?? 0,
    subtotal: props.endorsement.endorsement[0].policies[0].subtotal ?? 0,
    receipts: props.endorsement.endorsement[0].policies[0].receipts ?? 0,
    commissionPercentage:
      props.endorsement.endorsement[0].policies[0].commissionPercentage ?? 0,
    policyStatusFolio:
      props.endorsement.endorsement[0].policies[0].policyStatusFolio ?? "0",
    objectStatusId:
      props.endorsement.endorsement[0].policies[0].objectStatusId ?? 1,
    concept: props.endorsement.endorsement[0].policies[0].concept ?? "",
    health: props.endorsement.endorsement[0].policies[0].objectStatusId ?? 6,
    vehiclePolicy: props.endorsement.endorsement[0].policies[0].vehiclePolicy,
    personPolicie: props.endorsement.endorsement[0].policies[0].personPolicie,
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        // noPolicy: Yup.string().required("Este campo es requerido."),
        // subBranchId: Yup.string().required("Este campo es requerido."),
        // issuanceDate: Yup.string().required("Este campo es requerido."),
        // startValidity: Yup.string().required("Este campo es requerido."),
        // endValidity: Yup.string().required("Este campo es requerido."),
        // clientId: Yup.string().required("Este campo es requerido."),
        // rfc: Yup.string().required("Este campo es requerido."),
        // street: Yup.string().required("Este campo es requerido."),
        // state: Yup.string().required("Este campo es requerido."),
        // municipality: Yup.string().required("Este campo es requerido."),
        // locality: Yup.string().required("Este campo es requerido."),
        // zip: Yup.string().required("Este campo es requerido."),
        // country: Yup.string().required("Este campo es requerido."),
        // salesPerson: Yup.string().required("Este campo es requerido."),
        // renewablePolicy: Yup.string().required("Este campo es requerido."),
        // paymentMethod: Yup.string().required("Este campo es requerido."),
        // collectionMethod: Yup.string().required("Este campo es requerido."),
        // paymentFrequency: Yup.string().required("Este campo es requerido."),
        // currency: Yup.string().required("Este campo es requerido."),
        // netPremium: Yup.string().required("Este campo es requerido."),
        // settingOne: Yup.string().required("Este campo es requerido."),
        // settingTwo: Yup.string().required("Este campo es requerido."),
        // additionalCharge: Yup.string().required("Este campo es requerido."),
        // rights: Yup.string().required("Este campo es requerido."),
        // financing: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });

  const ItemStack = styled(Stack)(({ theme }) => ({
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "5px",
    borderRadius: "16px",
  }));

  const additionSubTotal = (data: ModelPolicy) => {
    const subTotal =
      Number(data.netPremium) -
      Number(data.settingOne) -
      Number(data.settingTwo) +
      Number(data.additionalCharge) +
      Number(data.rights);
    return Number(subTotal.toFixed(2));
  };
  
  return (
    <>
      {loading ? (
        <TabPolicySkeleton />
      ) : (
        <Box component="form" maxWidth="auto" onSubmit={handleSubmit}>
          <Stack direction="column">
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Datos de la Póliza</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column">
                  <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                      container
                      flexGrow={1}
                      flexBasis={0}
                      rowSpacing={1}
                      columnSpacing={{ xs: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            No. de Póliza
                          </Typography>
                          <TextField
                            placeholder="No. de Póliza"
                            name="noPolicy"
                            value={values.noPolicy}
                            onChange={handleChange}
                            helperText={errors.noPolicy}
                            error={!!errors.noPolicy}
                            disabled
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
                            Estado póliza
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="policyStatusFolio"
                            onChange={handleChange}
                            value={
                              values.policyStatusFolio
                                ? values.policyStatusFolio
                                : 0
                            }
                            error={!!errors.policyStatusFolio}
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogStatus ?? []).map(
                              (data: any) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.policyStatusFolio}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Ramo
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="branchId"
                            onChange={handleChange}
                            value={
                              valuesData?.CatalogBranches ? values.branchId : 0
                            }
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogBranches ?? []).map(
                              (data: CatalogValue) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Subramo
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="subBranchId"
                            onChange={handleChange}
                            value={values.subBranchId ? values.subBranchId : 0}
                            error={!!errors.subBranchId}
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogSubBranch ?? []).map(
                              (data: any) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.subBranchId}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Fechas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column">
                  <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                      container
                      flexGrow={1}
                      flexBasis={0}
                      rowSpacing={1}
                      columnSpacing={{ xs: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Emisión
                          </Typography>
                          <TextField
                            name="issuanceDate"
                            value={values.issuanceDate}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.issuanceDate}
                            error={!!errors.issuanceDate}
                            disabled
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Vigencia De
                          </Typography>
                          <TextField
                            name="startValidity"
                            value={values.startValidity}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.startValidity}
                            error={!!errors.startValidity}
                            disabled
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Vigencia Hasta
                          </Typography>
                          <TextField
                            name="endValidity"
                            value={values.endValidity}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.endValidity}
                            error={!!errors.endValidity}
                            disabled={
                              (transactionEndorsement ==
                              Constants.endorsementTransactions.extendVigency //'CAVA-273'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Moneda
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="currency"
                            onChange={handleChange}
                            value={values.currency ? values.currency : 0}
                            error={!!errors.currency}
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogCurrency ?? []).map(
                              (data: any) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.currency}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Forma de pago
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="paymentFrequency"
                            onChange={handleChange}
                            value={
                              values.paymentFrequency
                                ? values.paymentFrequency
                                : 0
                            }
                            error={!!errors.paymentFrequency}
                            disabled={
                              (transactionEndorsement ==
                              Constants.endorsementTransactions.switchPayment //'CAVA-271'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(
                              valuesData?.CatalogPaymentFrequency ?? []
                            ).map((data: any) => (
                              <MenuItem
                                key={data.folio}
                                value={data.folio}
                                //----------------------------------------------------------------;
                                onClick={() => {
                                  setFieldValue(
                                    "financing",
                                    Number(data?.surcharge)
                                  );
                                  setIssuingCostHook(newIssuingCostHook);
                                  values.financing = Number(data?.surcharge);

                                  setFieldValue(
                                    "additionalCharge",
                                    Number(
                                      (values.netPremium -
                                        (values.settingOne +
                                          values.settingTwo)) *
                                        (values?.financing / 100)
                                    )
                                  );
                                }}
                                //----------------------------------------------------------------;
                              >
                                {data?.description}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.paymentFrequency}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Método de pago
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="paymentMethod"
                            onChange={handleChange}
                            value={
                              values.paymentMethod ? values.paymentMethod : 0
                            }
                            error={!!errors.paymentMethod}
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogPaymentMethod ?? []).map(
                              (data: any) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.paymentMethod}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Forma de cobro
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="collectionMethod"
                            onChange={handleChange}
                            value={
                              values.collectionMethod
                                ? values.collectionMethod
                                : 0
                            }
                            error={!!errors.collectionMethod}
                            disabled
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(
                              valuesData?.CatalogCollectionType ?? []
                            ).map((data: any) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data?.description}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.collectionMethod}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Contratante</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column">
                  <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                      container
                      flexGrow={1}
                      flexBasis={0}
                      rowSpacing={1}
                      columnSpacing={{ xs: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Nombre
                          </Typography>
                          <Autocomplete
                            options={people}
                            getOptionLabel={(option: any) =>
                              `${option.name} ${option.lastName} ${option.maternalLastName}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.name === value.name
                            }
                            value={person}
                            onInputChange={handleInputChange}
                            onChange={(e, value) => {
                              setFieldValue(
                                "clientName",
                                value !== null
                                  ? `${value.name} ${value.lastName} ${value.maternalLastName}`
                                  : initialValues.clientName
                              );
                              setFieldValue(
                                "clientId",
                                value !== null
                                  ? value.folio
                                  : initialValues.clientId
                              );
                              setFieldValue(
                                "rfc",
                                value !== null ? value.rfc : initialValues.rfc
                              );
                              setPerson(value);
                            }}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loadingPeople ? (
                                        <CircularProgress
                                          color="inherit"
                                          sx={{ color: "#E5105D" }}
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ) //'CAVA-275'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          />

                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.rfc}
                          </FormHelperText>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                          <TextField
                            placeholder="RFC"
                            name="rfc"
                            value={
                              values.rfc ? values.rfc : person ? person.rfc : ""
                            }
                            onChange={handleChange}
                            helperText={errors.rfc}
                            error={!!errors.rfc}
                            disabled
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Calle
                          </Typography>
                          <TextField
                            placeholder="Calle"
                            name="street"
                            value={values.street}
                            onChange={handleChange}
                            helperText={errors.street}
                            error={!!errors.street}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify) //'CAVA-275'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Estado
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="state"
                            value={values.state ? values.state : 0}
                            onChange={handleChange}
                            error={!!errors.state}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify) //'CAVA-275'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
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
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Municipio
                          </Typography>

                          <Select
                            sx={{ width: "100%" }}
                            name="municipality"
                            value={
                              municipalities && values.municipality
                                ? Number(values.municipality)
                                : 0
                            }
                            onChange={handleChange}
                            error={!!errors.municipality}
                            defaultValue={0}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify) //'CAVA-275'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
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
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Colonia
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="locality"
                            value={
                              locations && values.locality ? Number(values.locality) : 0
                            }
                            onChange={handleChange}
                            error={!!errors.locality}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify) //'CAVA-275'
                                ? false
                                : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(locations ?? []).map((data: any) => (
                              <MenuItem
                                onClick={() => {
                                  setFieldValue("neighborhood", data.colonyName);
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

                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>CP</Typography>
                          <TextField
                            placeholder="Código Postal"
                            type="number"
                            name="zip"
                            value={values.zip}
                            onChange={(e) => {
                              setFieldValue("zip", e.target.value);
                              if (e.target.value.length === 5) {
                                fetchLocationDataByZipCode(e.target.value);
                              } else {
                                setSearchZipCode(false);
                              }
                            }}
                            helperText={errors.zip}
                            error={!!errors.zip}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify)
                                ? false : true)||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
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
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            País
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="country"
                            onChange={handleChange}
                            value={values.country ? values.country : 0}
                            error={!!errors.country}
                            disabled={
                              (( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                                transactionEndorsement == Constants.endorsementTransactions.modify) //'CAVA-275'
                                ? false
                                : true) ||
                                (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                            }
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(valuesData?.CatalogCountries ?? []).map(
                              (data: any) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.country}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Varios</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column">
                  <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                      container
                      flexGrow={1}
                      flexBasis={0}
                      rowSpacing={1}
                      columnSpacing={{ xs: 1 }}
                    >
                      <Grid item xs={12} sm={6}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Vendedor
                          </Typography>
                          <Autocomplete
                            id="autocomplete-search"
                            options={salesPeople}
                            getOptionLabel={(option: any) =>
                              `${option.name} ${option.lastName} ${option.maternalLastName}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.name === value.name
                            }
                            value={seller}
                            onInputChange={handleInputChangeSalesPeople}
                            onChange={(e, value) => {
                              setSeller(value);
                              setFieldValue(
                                "salesPerson",
                                value !== null
                                  ? value.folio
                                  : initialValues.salesPerson
                              );
                            }}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loadingsalesPeople ? (
                                        <CircularProgress
                                          color="inherit"
                                          sx={{ color: "#E5105D" }}
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            disabled
                          />
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.salesPerson}
                          </FormHelperText>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6} style={{ display: "none" }}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Póliza renovable
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Typography>No</Typography>
                            <Switch
                              inputProps={{ "aria-label": "Póliza Renovable" }}
                              name="renewablePolicy"
                              checked={values.renewablePolicy}
                              onChange={(event, checked) => {
                                setFieldValue("renewablePolicy", checked);
                              }}
                              disabled
                            />
                            <Typography>Si</Typography>
                          </Stack>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Grupos
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Select
                              sx={{ width: "100%" }}
                              value={person ? person.groupId : 0}
                              disabled
                            >
                              <MenuItem key={0} value={0} disabled>
                                Selecciona
                              </MenuItem>
                              {Object(valuesData?.Groups ?? []).map(
                                (data: CatalogValue) => (
                                  <MenuItem key={data.folio} value={data.folio}>
                                    {data?.description}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Observaciones
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              multiline
                              rows={4}
                              sx={{
                                width: "100%",
                              }}
                              placeholder="Observaciones"
                              name="comments"
                              value={values.comments}
                              onChange={handleChange}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ marginBottom: "30px" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Primas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column">
                  <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                      container
                      flexGrow={1}
                      flexBasis={0}
                      rowSpacing={1}
                      columnSpacing={{ xs: 1 }}
                    >
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Prima neta
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="netPremium"
                              value={
                                values.netPremium ? values.netPremium : 0.0001
                              }
                              onChange={handleChange}
                              helperText={errors.netPremium}
                              error={!!errors.netPremium}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Ajuste 1
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="settingOne"
                              value={
                                values.settingOne ? values.settingOne : 0.0001
                              }
                              onChange={handleChange}
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
                              disabled
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "Descuento" }}
                              onChange={(event, checked) => {
                                setDiscountsettingOne(checked);
                                if (!checked) setFieldValue("settingOne", 0);
                              }}
                              checked={discountsettingOne}
                              disabled
                            />
                            <Typography>DESCUENTO</Typography>
                          </ItemStack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Ajuste 2
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="settingTwo"
                              value={
                                values.settingTwo ? values.settingTwo : 0.0001
                              }
                              onChange={handleChange}
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
                              disabled
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "Descuento" }}
                              onChange={(event, checked) => {
                                setDiscountsettingTwo(checked);
                                if (!checked) setFieldValue("settingTwo", 0);
                              }}
                              checked={discountsettingTwo}
                              disabled
                            />
                            <Typography>DESCUENTO</Typography>
                          </ItemStack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Recargo pago fraccionado
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="additionalCharge"
                              value={
                                values.additionalCharge
                                  ? values.additionalCharge
                                  : 0.0001
                              }
                              onChange={handleChange}
                              helperText={errors.additionalCharge}
                              error={!!errors.additionalCharge}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Typography>{values.financing + "%"}</Typography>
                          </ItemStack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Derecho
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="rights"
                              value={values.rights ? values.rights : 0.0001}
                              onChange={handleChange}
                              helperText={errors.rights}
                              error={!!errors.rights}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Subtotal
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="subtotal"
                              value={
                                (values.subtotal = additionSubTotal(values))
                              }
                              onChange={handleChange}
                              helperText={errors.subtotal}
                              error={!!errors.subtotal}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            I.V.A.
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="iva"
                              value={
                                (values.iva = (
                                  (Number(values.subtotal) * iva) /
                                  100
                                ).toFixed(2))
                              }
                              onChange={handleChange}
                              helperText={errors.iva}
                              error={!!errors.iva}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              // disabled={
                              //   validateStatusPolicy === Constants.statusActive
                              // }
                              disabled
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Typography>{iva}.00 %</Typography>
                          </ItemStack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Prima total
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="totalPremium"
                              value={
                                (values.totalPremium = (
                                  Number(values.subtotal) + Number(values.iva)
                                ).toFixed(2))
                              }
                              onChange={handleChange}
                              helperText={errors.totalPremium}
                              error={!!errors.totalPremium}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} style={{ display: "none" }}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Recibos
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField value={values.receipts} />
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Grid item xs={12} md={8} />
            {
              //'CAVA-271'
              transactionEndorsement ==
                Constants.endorsementTransactions.switchPayment ||
              transactionEndorsement ==
                Constants.endorsementTransactions.extendVigency ||
                ( transactionEndorsement == Constants.endorsementTransactions.switchContractor ||
                  transactionEndorsement == Constants.endorsementTransactions.modify) ? (
                <Grid item xs={12} md={4} alignSelf="flex-end" textAlign="end">
                  <Button
                    type="submit"
                    size="small"
                    disabled={(props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                  >
                    Guardar Cambios
                  </Button>
                </Grid>
              ) : (
                <></>
              )
            }
          </Stack>
          <MessageBar
            open={isSnackbarOpen}
            severity={severity}
            message={messageAlert}
            close={handleSnackbarClose}
            autoHideDuration={autoHideDuration}
          />
        </Box>
      )}
    </>
  );
}

export default TabPolicie;
