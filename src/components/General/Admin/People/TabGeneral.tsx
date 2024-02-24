import React, { useEffect, useRef, useState } from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import {
  Box,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  SelectChangeEvent,
} from "@mui/material";
import {
  Button,
  Checkbox,
  Select,
  Switch,
  TextField,
  InputAdornment,
} from "../../../OuiComponents/Inputs";
import { useFormik } from "formik";
import * as Yup from "yup";

import People, {
  BranchCommission,
  Commission,
} from "../../../../models/People";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import PeopleDataService from "../../../../services/people.service";
import FormatData from "../../../../utils/Formats.Data";
import Constants from "../../../../utils/Constants";
import { Typography } from "../../../OuiComponents/DataDisplay";
import {
  TextSmallFont,
  ColorPureWhite,
  ColorPink,
  LinkSmallFont,
} from "../../../OuiComponents/Theme";
import { MenuItem } from "../../../OuiComponents/Navigation";
import CacheService from "../../../../services/cache.service";
import { Complete } from "../../../OuiComponents/Icons";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import RfcFacil from "rfc-facil";
import { Entidad } from "../../../../models/Entidad";
import LocationService from "../../../../services/location.service";
import CommissionService from "../../../../services/commissions.service";
import { GridColDef } from "@mui/x-data-grid";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { format, subYears, addYears } from "date-fns";
import PoliciesService from "../../../../insuranceServices/policies.service";
import BondService from "../../../../services/bonds.service";
import { Modal } from "../../../OuiComponents/Utils";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
const curp = require("curp");

interface UserFormData {
  Origins: CacheCatalogValue;
  Groups: CacheCatalogValue;
  Nationalities: CacheCatalogValue;
  Branches: CacheCatalogValue;
  Genders: CacheCatalogValue;
  Sector: CacheCatalogValue;
  TypesPerson: CacheCatalogValue;
  Entities: Entidad;
  People: People;
}
interface BranchComissions {
  folio: string;
  branch: string; //folio
  branchDescription: string; //description
  percentage: number;
}
type CommissionsTypePerson = {
  folio: string;
  personId: string;
  typePerson: string;
  branchCommission: BranchComissions[];
  objectStatusId: number;
};

function TabGeneral(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [valuesData, setValuesData] = React.useState<UserFormData>();
  const [loading, setLoading] = React.useState(true);
  //;----------------------------------------------------------------
  const [soloBeneficiario, setSoloBeneficiario] = useState<boolean>(false);
  const [typePersonId, setTypePersonId] = useState('');
  const [loadingScreen, setLoadingScreen] = React.useState(true);
  const [commissionSellerData,setCommissionSellerData] = React.useState<any>(null);
  //;----------------------------------------------------------------
  const [entidad, setEntidad] = useState<string>("");
  const [change, setChange] = useState<boolean>(false);
  const [isInactive, setIsInactive] = useState<boolean>(false);
  const [selectedLeaderBranch, setSelectedLeaderBranch] = useState("");
  const [rowsBranches, setRowsBranches] = useState<BranchComissions[] | null>(
    null
  );
  const [rowBranchIsEjecutive, setRowBranchIsEjecutive] = useState<
    BranchComissions[] | null
  >([
    {
      folio: "",
      branch: "CAVA-338",
      branchDescription: "MAQUILA",
      percentage: 0,
    },
    {
      folio: "",
      branch: "CAVA-339",
      branchDescription: "PRIMA",
      percentage: 0,
    },
  ]);
  const [branchIsLead, setBranchIsLead] = useState<BranchComissions[] | null>([
    {
      folio: "",
      branch: "",
      branchDescription: "",
      percentage: 0,
    },
  ]);

  let minDate = subYears(new Date(), 110);
  let maxDate = subYears(new Date(), 18);
  //let maxDateMoral = new Date();
  React.useEffect(() => {
    const fetchData = async () => {
      if(props.beneficiary){
        setTypePersonId("CAVA-202");
      }
      const restOrigins = await CacheService.getByFolioCatalog(
        Constants.originsCatalogFolio
      );
      const restGroups = await CacheService.getByFolioCatalog(
        Constants.groupsCatalogFolio
      );
      const restNationalities = await CacheService.getByFolioCatalog(
        Constants.nationalitiesCatalogFolio
      );
      const restBranches = await CacheService.getByFolioCatalog(
        Constants.branchesCatalogFolio
      );
      const restGenders = await CacheService.getByFolioCatalog(
        Constants.gendersCatalogFolio
      );
      const restTypePerson = await CacheService.getByFolioCatalog(
        Constants.typePersonCatalogFolio
      );
      const restSector = await CacheService.getByFolioCatalog(
        Constants.sectorFolio
      );
      const restPeople = await PeopleDataService.getById(props.data);
      const restEntities = await LocationService.getStates();
      const restBonds = props.data
        ? await BondService.getBondDebtor(props.data)
        : undefined;
      const restPolicy = props.data
        ? await PoliciesService.getPoliciesByClientFolio(props.data)
        : undefined;
      let resultInactive = !!(
        restBonds?.data?.length === 0 && restPolicy?.data?.length === 0
      );
      setIsInactive(resultInactive);
      setValuesData({
        Origins: restOrigins.data.values,
        Groups: restGroups.data.values,
        Nationalities: restNationalities.data.values,
        Branches: restBranches.data.values,
        Genders: restGenders.data.values,
        TypesPerson: restTypePerson.data.values,
        Sector: restSector.data.values,
        Entities: restEntities.data,
        People:   restPeople.data ?? [],
      });
      if(restPeople.data?.commissionSeller){
        const commissionIndexed = (restPeople.data?.commissionSeller).reduce((acc:any,el:any)=>{
          acc[el.typePerson] = el
          return acc
        },{});
        setCommissionSellerData(commissionIndexed ?? null);
      }
      
      
      const updatedRowsBranches =
        restPeople?.data?.isSeller &&
        restPeople?.data?.commissionSeller?.length > 0
          ? restPeople.data?.commissionSeller?.find(
              (com: Commission) => com.typePerson === Constants.typePersonSeller
            ).branchCommission
          : restBranches.data.values
              .filter((item: any) => item.folio !== Constants.folioBranchFianza)
              .map((branch: any) => ({
                folio: "",
                branch: branch.folio,
                branchDescription: branch.description,
                percentage: 0,
              }));
      setBranchIsLead(
        restPeople?.data?.leader &&
          restPeople?.data?.commissionSeller.length > 0
          ? restPeople.data?.commissionSeller?.find(
              (com: Commission) => com.typePerson === Constants.typePersonLead
            ).branchCommission
          : branchIsLead
      );
      setRowsBranches(updatedRowsBranches);

      setRowBranchIsEjecutive(
        restPeople?.data?.bondsExecutive &&
          restPeople?.data?.commissionSeller.length > 0
          ? restPeople.data?.commissionSeller?.find(
              (com: Commission) =>
                com.typePerson === Constants.typePersonEjecutive
            ).branchCommission
          : rowBranchIsEjecutive
      );
      const leaderCommission = restPeople.data?.commissionSeller?.find(
        (com: Commission) => com.typePerson === Constants.typePersonLead
      );

      const selectedBranch =
        leaderCommission?.branchCommission.find(
          (branch: BranchCommission) => branch.percentage > 0
        )?.branch || "";
      setSelectedLeaderBranch(selectedBranch);

      setLoading(false);
      if(loadingScreen)
        setLoadingScreen(false);
    };

    if (change || !change) {
      generatePersonalId();
    }

    fetchData();
  }, [change]);

  const initialValues: People = {
    folio: valuesData?.People?.folio ?? "",
    name: props.beneficiary ?? valuesData?.People.name ?? "",
    lastName: valuesData?.People.lastName ?? "",
    maternalLastName: valuesData?.People.maternalLastName ?? "",
    rfc: valuesData?.People.rfc ?? "",
    curp: valuesData?.People.curp ?? "",
    birthPlace: valuesData?.People.birthPlace ?? 0,
    birthDay:
      valuesData?.People && valuesData.People.birthDay
        ? `${new Date(valuesData.People.birthDay).toISOString().split("T")[0]}`
        : format(maxDate, "yyyy-MM-dd"),
    genderId: valuesData?.People.genderId ?? "",
    email: valuesData?.People.email ?? "",
    password: valuesData?.People.password ?? "",
    groupId: valuesData?.People.groupId ?? "",
    originId: valuesData?.People.originId ?? "",
    financialProfile: valuesData?.People.financialProfile ?? 1,
    paymentTerm: valuesData?.People.paymentTerm ?? true,
    vip: valuesData?.People.vip ?? false,
    politicallyExposed: valuesData?.People.politicallyExposed ?? true,
    nationality: valuesData?.People.nationality ?? "",
    nationalities: {
      description: valuesData?.People
        ? valuesData.People.nationalities?.description
        : "",
    },
    collectionReminde: valuesData?.People.collectionReminde ?? true,
    initials: valuesData?.People.initials ?? "",
    signature: valuesData?.People.signature ?? "",
    profileId: valuesData?.People.profileId ?? "1",
    objectStatusId: valuesData?.People.objectStatusId ?? 1,
    taskss: valuesData?.People.taskss ?? [],
    //companies: valuesData?.People.companies ?? [],
    message: valuesData?.People.message ?? [],
    address: valuesData?.People.address ?? [],
    typePersonId: props.beneficiary
      ? "CAVA-202"
      : valuesData?.People.typePersonId ?? "",
    companyId: "",
    isSeller: valuesData?.People.isSeller ?? false,
    sector: valuesData?.People.sector ?? "",
    healt: valuesData?.People.healt ?? 0,
    branch: valuesData?.People.branch ?? "",
    leader: valuesData?.People.leader ?? false,
    bondsExecutive: valuesData?.People.bondsExecutive ?? false,
    commissionSeller: valuesData?.People?.commissionSeller ?? [
      {
        commissionId: "",
        folio: "",
        personId: "",
        typePerson: Constants.typePersonSeller,
        branchCommission: [],
      },
      {
        commissionId: "",
        folio: "",
        personId: "",
        typePerson: Constants.typePersonLead,
        branchCommission: [],
      },
      {
        commissionId: "",
        folio: "",
        personId: "",
        typePerson: Constants.typePersonEjecutive,
        branchCommission: [],
      },
    ],
    isBeneficiary: valuesData?.People.isBeneficiary ?? false,
  };
  const handleCommission = async (commissionFolio:string, comissionsRequest: any)=>{
    if(comissionsRequest!==null&&comissionsRequest){
              if(commissionFolio&&commissionFolio!==''){
                await CommissionService.putCommission(comissionsRequest)
                .then((response: any) => {})
                .catch((e: Error) => {
                  setDataAlert(true, e.message, "error", autoHideDuration);
                });
              }else if(commissionFolio===''){
                await CommissionService.postNewCommssion(comissionsRequest).then((response)=>{
                  
                }).catch((e:Error)=>{
                  setDataAlert(true, e.message, "error", autoHideDuration);
                });
              }
            }
  };
  const onSubmit = async (data: People) => {
    if (data.isBeneficiary && data.email.length === 0) {
      setDataAlert(
        true,
        "Ingresar correo electrónico",
        "error",
        autoHideDuration
      );
      return;
    } else {
      try {
        let response;
        if (props.data) {
          response = await PeopleDataService.putFolio(props.data, data);
          let commissionFolio = '';
          let comissionsRequest: any=null;
          if (response.message === "OK") {
            if (data.isSeller) {
              commissionFolio = 
              commissionSellerData?.[Constants.typePersonSeller]?.folio ?? '';

              comissionsRequest = createCommissionTypePerson(
                props.data,
                Constants.typePersonSeller,
                rowsBranches ?? [],
                commissionFolio
              );
              handleCommission(commissionFolio, comissionsRequest);
            }
            
            if (data.leader) {
              commissionFolio = 
              commissionSellerData?.[Constants.typePersonLead]?.folio ?? '';

              comissionsRequest = createCommissionTypePerson(
                props.data,
                Constants.typePersonLead,
                branchIsLead ?? [],
                commissionFolio
              );
              handleCommission(commissionFolio, comissionsRequest);
            }
            if (data.bondsExecutive) {
              commissionFolio = 
              commissionSellerData?.[Constants.typePersonEjecutive]?.folio ?? '';

              comissionsRequest = createCommissionTypePerson(
                props.data,
                Constants.typePersonEjecutive,
                rowBranchIsEjecutive ?? [],
                commissionFolio
              );
              handleCommission(commissionFolio, comissionsRequest);
            }
            setDataAlert(
              true,
              `La persona se ${
                props.data ? "ha actualizado" : "registró"
              } con éxito.`,
              "success",
              autoHideDuration
            );
          } else {
            setDataAlert(
              true,
              response.message ?? "",
              "error",
              autoHideDuration
            );
          }
        } else {
          response = await PeopleDataService.post(data);
          if (response.message === "OK") {
            if (data.isSeller) {
              const comissionsSeller = createCommissionTypePerson(
                response.data.folio,
                Constants.typePersonSeller,
                rowsBranches ?? []
              );
              CommissionService.postNewCommssion(comissionsSeller)
                .then((response: any) => {})
                .catch((e: Error) => {
                  setDataAlert(true, e.message, "error", autoHideDuration);
                });
            }
            if (data.leader) {
              const comissionsLeader = createCommissionTypePerson(
                response.data.folio,
                Constants.typePersonLead,
                branchIsLead ?? []
              );
              CommissionService.postNewCommssion(comissionsLeader)
                .then((response: any) => {})
                .catch((e: Error) => {
                  setDataAlert(true, e.message, "error", autoHideDuration);
                });
            }
            if (data.bondsExecutive) {
              const comissionsExecutive = createCommissionTypePerson(
                response.data.folio,
                Constants.typePersonEjecutive,
                rowBranchIsEjecutive ?? []
              );
              CommissionService.postNewCommssion(comissionsExecutive)
                .then((response: any) => {})
                .catch((e: Error) => {
                  setDataAlert(true, e.message, "error", autoHideDuration);
                });
            }
            setDataAlert(
              true,
              `La persona se ${
                props.data ? "ha actualizado" : "registró"
              } con éxito.`,
              "success",
              autoHideDuration
            );
            if (!props.data) {
              props.onDataChange({
                folio: response.data.folio,
                nacionality: response.data.nacionality,
                typePersonId: response.data.typePersonId,
              });
            }
          } else {
            setDataAlert(
              true,
              response.message ?? "",
              "error",
              autoHideDuration
            );
          }
        }
      } catch (e: any) {
        setDataAlert(true, e.message, "error", autoHideDuration);
      }
    }
  };


    //;----------------------------------------------------------------
    const validationSchemaPersonaMoralEnabled = Yup.object({
      name: Yup.string().required("Este campo es requerido."),
      //lastName: Yup.string().required("Este campo es requerido."),
      //maternalLastName: Yup.string().required("Este campo es requerido."),
    });

    const validationSchemaPersonaMoralDisabled = Yup.object({
      name: Yup.string().required("Este campo es requerido."),
      birthDay: Yup.string().required("Este campo es requerido."),
      rfc: Yup.string().required("Este campo es requerido."),
      email: Yup.string().email("Ingresa un correo electrónico válido"),
      nationality: Yup.string().required("Este campo es requerido."),
      sector: Yup.string().required("Este campo es requerido.")
    });

    const selectedValidationSchemaPersonaMoral = soloBeneficiario
    ? validationSchemaPersonaMoralEnabled
    : validationSchemaPersonaMoralDisabled;

    const validationSchemaPersonaFisicaEnabled = Yup.object({
      name: Yup.string().required("Este campo es requerido."),
      lastName: Yup.string().required("Este campo es requerido.")
    });

    const validationSchemaPersonaFisicaDisabled = Yup.object({
      name: Yup.string().required("Este campo es requerido."),
      lastName: Yup.string().required("Este campo es requerido."),
      maternalLastName: Yup.string().required("Este campo es requerido."),
      genderId: Yup.string().required("Este campo es requerido."),
      rfc: Yup.string().required("Este campo es requerido."),
      email: Yup.string().email("Ingresa un correo electrónico válido"),
      groupId: Yup.string().required("Este campo es requerido."),
      //originId: Yup.string().required("Este campo es requerido."),
      nationality: Yup.string().required("Este campo es requerido."),
      sector: Yup.string().required("Este campo es requerido.")
    });

    const validationSchemaDefault = Yup.object({
      typePersonId: Yup.string().required("Este campo es requerido."),
    });

    const validationSchemaPersonaFisica = soloBeneficiario
    ? validationSchemaPersonaFisicaEnabled
    : validationSchemaPersonaFisicaDisabled;

    

    React.useEffect (()=>{
      validateForm();
    },[soloBeneficiario]);

    //;----------------------------------------------------------------

  const { handleSubmit, handleChange, errors, values, setFieldValue, validateForm,submitForm } = //agregado validateForm
    useFormik({
      initialValues,
  //;----------------------------------------------------------------
      validationSchema: 
      (typePersonId === Constants.folioMoralPerson) ? selectedValidationSchemaPersonaMoral :
      (typePersonId === Constants.folioNaturalPerson) ? 
      validationSchemaPersonaFisica : validationSchemaDefault,
  //;----------------------------------------------------------------
      onSubmit,
      enableReinitialize: true,
    }); 


//values.isBeneficiary
  const generatePersonalId = () => {
    const birthDay = values.birthDay.split("-");
    const year = Number(birthDay[0]);
    const month = Number(birthDay[1]);
    const day = Number(birthDay[2]);

    //Si es persona física
    if (values.typePersonId === Constants.folioNaturalPerson) {
      //Valido los campos y genero el RFC
      if (
        values.name &&
        values.lastName &&
        values.maternalLastName &&
        day &&
        month &&
        year
      ) {
        const rfc: string = RfcFacil.forNaturalPerson({
          name: values.name,
          firstLastName: values.lastName,
          secondLastName: values.maternalLastName,
          day: day,
          month: month,
          year: year,
        });

        values.rfc = rfc;
      }

      //Validos los campos y genero la CURP
      if (
        values.name &&
        values.lastName &&
        values.maternalLastName &&
        values.genderId &&
        values.birthPlace &&
        values.birthDay
      ) {
        const fullBirthDay =
          birthDay[2] + "-" + birthDay[1] + "-" + birthDay[0];

        //Para que el nombre del estado que viene desde la API concuerde con los de la librería
        let differentEntities: any = {
          MEXICO: "ESTADO_DE_MEXICO",
          MICHOACAN_DE_OCAMPO: "MICHOACAN",
          COAHUILA_DE_ZARAGOZA: "COAHUILA",
          VERACRUZ_DE_IGNACIO_DE_LA_LLAVE: "VERACRUZ",
          CIUDAD_DE_MEXICO: "CDMX",
        };

        let cleanEntity: string = entidad
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        if (cleanEntity in differentEntities) {
          cleanEntity = differentEntities[cleanEntity];
        }
        //----------------------------------------------------------
        const genderId =
          values.genderId == Constants.folioMalePerson
            ? "MASCULINO"
            : "FEMENINO";

        let persona = curp.getPersona();
        persona.nombre = values.name;
        persona.apellidoPaterno = values.lastName;
        persona.apellidoMaterno = values.maternalLastName;
        persona.genero = curp.GENERO[genderId];
        persona.fechaNacimiento = fullBirthDay;
        persona.estado = curp.ESTADO[cleanEntity];

        values.curp = curp.generar(persona);
      }

      //----------------------------------------------------

      //Si es persona moral
    } else if (values.typePersonId === Constants.folioMoralPerson) {
      //Se agrega para bug 4462
      try{
        if (values.name.trim() !== "" && values.name.trim().length > 1) {
          const rfc: string = RfcFacil.forJuristicPerson({
            name: values.name,
            day: day,
            month: month,
            year: year,
          });
          values.rfc = rfc;
        } else {
          values.rfc = "";
        }
      }
      catch(e)
      {}
    }
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /**Se agregan cambios para las comisiones */
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
  type EditableCellProps = {
    data: any;
  };
  interface InputRefs {
    [key: string]: React.RefObject<HTMLInputElement>;
  }
  const EditableCell: React.FC<EditableCellProps> = ({ data }) => {
    const [editValue, setEditValue] = useState(data.row.percentage);
    const inputRefs = useRef<InputRefs>({});
    const inputRef = useRef<HTMLInputElement | null>(null);
    const actualizarPercentPorFolio = (folio: string, nuevoPercent: number) => {
      setRowsBranches((prevRowsBranches) =>
        (prevRowsBranches ?? []).map((branch) =>
          branch.branch === folio
            ? { ...branch, percentage: nuevoPercent }
            : branch
        )
      );
      setRowBranchIsEjecutive((prevRowBranchIsEjecutivo) =>
        (prevRowBranchIsEjecutivo ?? []).map((branch) =>
          branch.branch === folio
            ? { ...branch, percentage: nuevoPercent }
            : branch
        )
      );
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue =Number(event.target.value);
      if(newValue>100){
        newValue=100;
        setDataAlert(
          true,
          "Los porcentajes no deben ser mayores a 100 ni menores a 0.02.",
          "error",
          autoHideDuration
        );
      }else if(newValue<0.02){
        newValue=0.02;
      }
      let value = Number(event.target.value);
      value = Math.min(100, Math.max(0.02, value));

      setEditValue(value);
    };
    const handleInputBlur = () => {
      actualizarPercentPorFolio(data.row.branch, Number(editValue));
    };

    return (
      <TextField
        type="number"
        value={editValue>=0.02 ? editValue : 0.02}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        sx={{
          width: "130px",
          outline: "none",
          border: "4px",
          background: "none",
        }}
        inputRef={inputRef}
      />
    );
  };

  const columns: GridColDef[] = [
    { field: "branch", headerName: "ID", width: 150 },
    {
      field: "branchDescription",
      headerName: "Ramo",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "percentage",
      headerName: "Porcentaje",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        return (
          <>
            <EditableCell
              //initialValue={params.row.percentage + ""}
              //ID={params.row.branch + ""}
              //rowIndex={params.rowIndex}
              data={params}
            />
          </>
        );
      },
    },
  ];
  const columnsIsEjecutive: GridColDef[] = [
    { field: "branch", headerName: "ID", width: 150 },
    {
      field: "branchDescription",
      headerName: "Descripción",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "percentage",
      headerName: "Porcentaje",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        return (
          <>
            <EditableCell
              //initialValue={params.row.percentage + ""}
              //ID={params.row.branch + ""}
              //rowIndex={params.rowIndex}
              data={params}
            />
          </>
        );
      },
    },
  ];

  const createCommissionTypePerson = (
    personId: string,
    typePerson: string,
    branchCommission: BranchCommission[],
    folio?: string
  ): CommissionsTypePerson => {
    return {
      folio: folio || "", // Puedes asignar un valor específico o dejarlo vacío según tus necesidades
      personId: personId,
      typePerson: typePerson,
      branchCommission: branchCommission,
      objectStatusId: 1,
    };
  };

  const updateStatusPeople = (idPerson: string, objectStatusId: number) => {
    PeopleDataService.putStatusActive(idPerson, objectStatusId)
      .then((response) => {
        if (response) {
          setDataAlert(
            true,
            objectStatusId === 1 ? "Persona activa" : "Persona inactiva",
            "success",
            autoHideDuration
          );
        } else {
          setDataAlert(
            true,
            "No se pudo cambiar el estado de la persona",
            "error",
            autoHideDuration
          );
        }
      })
      .catch((error) => {
        console.error("PeopleDataService.putStatusActive", error);
        setDataAlert(
          true,
          "Error al cambiar estado de la persona.",
          "error",
          autoHideDuration
        );
      });
  };
  /*** */
//;----------------------------------------------------------------
//;----------------------------------------------------------------
  //Este hook abre el modal alerta
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newData, setNewData] = React.useState<any>(null);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
const endorsementSelectionModal = (
  <>
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      sx={{ width: "100%", height: "100%", top: "150px" }}
      disableEnforceFocus
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: "555px",
          borderRadius: "20px",
          padding: "16px",
          margin: "auto",
          top: "150px",
          backgroundColor: ColorPureWhite,
        }}
        textAlign="center"
      >
        <Typography sx={{ ...LinkSmallFont, height: "62px" }}>
          {
            "Ya existe una persona con el mismo nombre. ¿Desea editar a la persona existente?"
          }
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            sx={{ marginRight: "auto", height: "30px" }}
            variant="outlined"
            onClick={()=>{
              handleCloseModal();
              setFieldValue('name','');
              setFieldValue('lastName','');
              setFieldValue('maternalLastName','');
              setFieldValue('rfc','');
              setFieldValue('curp','');
              setDataAlert(
                true,
                "Ingrese un nombre diferente.",
                "error",
                autoHideDuration
              );
              setNewData(null);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {settingData()}}
            sx={{ height: "20px", padding: "10px 25px" }}
          >
            Si
          </Button>
        </Box>
      </Box>
    </Modal>
  </>
);
const settingData = ()=>{
  handleCloseModal();
  setChange(!change);
  //setFieldValue('',data.);
  props.onDataChange(newData);
  setChange(!change);
  setLoadingScreen(true);
};
  const handleActionModal = () => {
    
    //
    //Validamos que no tengamos campos vacios
    validateForm().then((result)=>{
      if(Object.keys(result).length === 0){
        submitForm();
      }else{
        setDataAlert(
          true,
          "Completar datos requeridos para continuar.",
          "error",
          autoHideDuration
        );
        console.log(errors)
      }
    });
  };

  //Verificamos si la persona existe
  const verifyPerson = async (name: string, lastName: string, maternalLastName: string) =>{
    if(name!==''&&name){
      const result = await PeopleDataService.searchName(name,lastName,maternalLastName);
      if(result?.data||result?.data?.length>=1){
        setNewData(result?.data);
        setIsModalOpen(true);
      }else{
        setIsModalOpen(false)
        setNewData(null);
      }
    }
  };
  const[fullName, setFullName] = React.useState('');
  const [waiting, setWaiting] = React.useState(false);
  //Este effecto se ejecuta cada 3 segundos segun se accione el nombre a buscar
  React.useEffect(()=>{
    let condition1: boolean = false;
    let condition2: boolean = false;
    if(typePersonId !== Constants.folioMoralPerson)
      condition1=values.name!==''&&values.lastName!==''&&values.maternalLastName!==''
      &&!!values.name&&!!values.lastName&&!!values.maternalLastName;
    else
      condition2=values.name!==''&&!!values.name;
      const timerId = setTimeout(()=>{
        if(fullName!==''&&condition1){
          verifyPerson(values.name, values.lastName, values.maternalLastName);
        }else if(fullName!==''&&condition2){
          verifyPerson(values.name,'','');
        }
        
        setWaiting(false);
      },3000);
      return () => clearTimeout(timerId);
    
  },[fullName]);
//;----------------------------------------------------------------
//;----------------------------------------------------------------
  return (
    <>
      <Box component="form" onSubmit={handleSubmit} maxWidth="auto">
        <Stack direction="column">
          <Stack direction="row" display="flex" spacing={1}>
            <Grid
              container
              flexGrow={1}
              flexBasis={0}
              rowSpacing={1}
              columnSpacing={{ xs: 1 }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Stack
                  direction="column"
                  spacing={1}
                  sx={{ paddingBottom: "20px" }}
                >
                  <Typography sx={{ ...TextSmallFont }}>
                    Tipo de persona
                  </Typography>
                  <Select
                    name="typePersonId"
                    onChange={(e: any) => {
                      //;----------------------------------------------------------------
                      setTypePersonId(e.target.value);//CAVA-202 Persona moral | CAVA-201 Persona fisica
                      if(e.target.value === Constants.folioMoralPerson){
                        setFieldValue('lastName','');
                        setFieldValue('maternalLastName','');
                      }
                      //;----------------------------------------------------------------
                      handleChange(e);
                      setFieldValue(
                        "birthDay",
                        e.target.value === Constants.folioMoralPerson
                          ? format(new Date(), "yyyy-MM-dd")
                          : format(maxDate, "yyyy-MM-dd")
                      );
                    }}
                    defaultValue={0}
                    value={values.typePersonId}
                    error={!!errors.typePersonId}
                    sx={{ width: "100%" }}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    {Object(valuesData?.TypesPerson ?? []).map(
                      (data: CacheCatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText sx={{ color: "#d22e2e" }}>
                    {errors.typePersonId}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  sx={{ marginTop: "30px", marginLeft: "20px" }}
                >
                  <Checkbox
                    name="soloBeneficiario"
                    checked={values.isBeneficiary}
                    onChange={(event, checked) => {
                      setFieldValue("isBeneficiary", checked);
                      setSoloBeneficiario(checked);
                    }}
                  />
                  <Typography sx={{ ...TextSmallFont }}>
                    Solo beneficiario
                  </Typography>
                </Stack>
              </Grid>
              {isInactive && (
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    sx={{ marginTop: "40px", marginLeft: "20px" }}
                  >
                    <Switch
                      inputProps={{ "aria-label": "isSeller" }}
                      name="statusPeople"
                      checked={values.objectStatusId === 1 ? true : false}
                      onChange={(event, checked) => {
                        setFieldValue("objectStatusId", checked ? 1 : 2);
                        updateStatusPeople(props.data, checked ? 1 : 2);
                      }}
                      // disabled={soloBeneficiario}
                    />
                    <Typography sx={{ marginLeft: "20px" }}>
                      {values.objectStatusId === 1 ? "Activo" : "Inactivo"}
                    </Typography>
                  </Stack>
                </Grid>
              )}
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                marginLeft="-20px !important"
              >
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>Nombre</Typography>
                    <TextField
                      placeholder="Nombre"
                      name="name"
                      value={values.name}
                      onChange={(e: any) => {
                        const inputValue = e.target.value;
                        const validatedValue = values.typePersonId===Constants.folioNaturalPerson? inputValue.replace(/[^a-zA-Z\s]/g, "", ""): inputValue;
                        setFieldValue("name", validatedValue);
                        setChange(!change);
                        //;----------------------------------------------------------------
                        if(values.typePersonId===Constants.folioNaturalPerson){
                          if(!!e.target.value&&!!values.lastName&&!!values.maternalLastName){
                            setFullName((e.target.value+' '+values.lastName+' '+values.maternalLastName));
                            if(!waiting)
                              setWaiting(true);
                          }
                        }else{
                          if(!!e.target.value){
                            setFullName(e.target.value);
                            if(!waiting)
                              setWaiting(true);
                          }
                        }
                        //;----------------------------------------------------------------
                      }}
                      helperText={errors.name}
                      error={!!errors.name}
                    />
                     {/* //;---------------------------------------------------------------- */}
                    {waiting ? (<Box sx={{ width: '100%' }}>
                      <LinearProgress color="inherit"/>
                    </Box>):(<></>)}
                  </Stack>
                  {/* //;---------------------------------------------------------------- */}
                </Grid>
                {values.typePersonId !== Constants.folioMoralPerson && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ paddingBottom: "20px" }}
                      >
                        <Typography sx={{ ...TextSmallFont }}>
                          Apellido paterno
                        </Typography>
                        <TextField
                          placeholder="Apellido paterno"
                          name="lastName"
                          value={values.lastName}
                          onChange={(e: any) => {
                            const inputValue = e.target.value;
                            const validatedValue = values.typePersonId===Constants.folioNaturalPerson? inputValue.replace(/[^a-zA-Z\s]/g, "", ""): inputValue;
                            setFieldValue("lastName", validatedValue);
                            //handleChange(e);
                            setChange(!change);
                            if(!!values.name&&!!e.target.value&&!!values.maternalLastName){
                              setFullName((values.name+' '+e.target.value+' '+values.maternalLastName));
                              if(!waiting)
                                setWaiting(true);
                            }
                            //;----------------------------------------------------------------
                          }}
                          helperText={errors.lastName}
                          error={!!errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ paddingBottom: "20px" }}
                      >
                        <Typography sx={{ ...TextSmallFont }}>
                          Apellido materno
                        </Typography>
                        <TextField
                          placeholder="Apellido materno"
                          name="maternalLastName"
                          value={values.maternalLastName}
                          onChange={(e: any) => {
                            const inputValue = e.target.value;
                            const validatedValue = values.typePersonId===Constants.folioNaturalPerson? inputValue.replace(/[^a-zA-Z\s]/g, "", ""): inputValue;
                            setFieldValue("maternalLastName", validatedValue);
                            //handleChange(e);
                            setChange(!change);
                            if(!!values.name&&!!values.lastName&&!!e.target.value){
                              setFullName(values.name+' '+values.lastName+' '+e.target.value);
                              if(!waiting)
                                setWaiting(true);
                            }
                            //;----------------------------------------------------------------
                          }}
                          helperText={errors.maternalLastName}
                          error={!!errors.maternalLastName}
                        />
                      </Stack>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      { (typePersonId === Constants.folioMoralPerson) ? "Fecha de constitución":"Fecha de nacimiento"}
                    </Typography>
                    <TextField
                      name="birthDay"
                      value={values.birthDay}
                      onChange={(e: any) => {
                        handleChange(e);
                        setChange(!change);
                      }}
                      //
                      type="date"
                      InputProps={{
                        inputProps: {
                          max:
                            values.typePersonId === Constants.folioMoralPerson
                              ? format(new Date(), "yyyy-MM-dd")
                              : format(maxDate, "yyyy-MM-dd"),
                          min: format(minDate, "yyyy-MM-dd"),
                        },
                      }}
                      helperText={errors.birthDay}
                      error={!!errors.birthDay}
                      //disabled={soloBeneficiario}
                    />
                  </Stack>
                </Grid>
                {values.typePersonId !== Constants.folioMoralPerson && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ paddingBottom: "20px" }}
                      >
                        <Typography sx={{ ...TextSmallFont }}>
                          Lugar de nacimiento
                        </Typography>
                        <Select
                          name="birthPlace"
                          onChange={(e: any) => {
                            handleChange(e);
                            setChange(!change);
                          }}
                          defaultValue={0}
                          value={values.birthPlace ? values.birthPlace : 0}
                          error={!!errors.birthPlace}
                          sx={{ width: "100%" }}
                          //disabled={soloBeneficiario}
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.Entities ?? []).map(
                            (data: Entidad) => (
                              <MenuItem
                                key={data.cvE_ENT}
                                value={data.cvE_ENT}
                                onClick={(e) => {
                                  setEntidad(
                                    data.noM_ENT
                                      .replace(/\s+/g, "_")
                                      .toUpperCase()
                                  );
                                }}
                              >
                                {data.noM_ENT}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.birthPlace}
                        </FormHelperText>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ paddingBottom: "20px" }}
                      >
                        <Typography sx={{ ...TextSmallFont }}>
                          Género
                        </Typography>
                        <Select
                          name="genderId"
                          onChange={(e: any) => {
                            handleChange(e);
                            setChange(!change);
                          }}
                          defaultValue={0}
                          value={values.genderId ? values.genderId : 0}
                          error={!!errors.genderId}
                          sx={{ width: "100%" }}
                          //disabled={soloBeneficiario}
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.Genders ?? []).map(
                            (data: CacheCatalogValue) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data.description}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        <FormHelperText sx={{ color: "#d22e2e" }}>
                          {errors.genderId}
                        </FormHelperText>
                      </Stack>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>RFC</Typography>
                    <TextField
                      placeholder="RFC"
                      name="rfc"
                      value={values.rfc}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        let maxLength = 13;
                        if (
                          values.typePersonId === Constants.folioMoralPerson
                        ) {
                          maxLength = 12;
                        }
                        const validatedValue = inputValue
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, maxLength);
                        setFieldValue("rfc", validatedValue);
                      }}
                      helperText={errors.rfc}
                      error={!!errors.rfc}
                      //disabled={soloBeneficiario}
                    />
                  </Stack>
                </Grid>
                {values.typePersonId !== Constants.folioMoralPerson && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ paddingBottom: "20px" }}
                    >
                      <Typography sx={{ ...TextSmallFont }}>CURP</Typography>
                      <TextField
                        placeholder="CURP"
                        name="curp"
                        value={values.curp}
                        onChange={handleChange}
                        helperText={errors.curp}
                        error={!!errors.curp}
                        //disabled={soloBeneficiario}
                      />
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>Correo</Typography>
                    <TextField
                      placeholder="Correo"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      helperText={errors.email}
                      error={!!errors.email}
                      //disabled={soloBeneficiario}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      Grupo económico
                    </Typography>
                    <Select
                      name="groupId"
                      onChange={handleChange}
                      defaultValue={"0"}
                      value={values.groupId}
                      error={!!errors.groupId}
                      sx={{ width: "100%" }}
                      //disabled={soloBeneficiario}
                    >
                      <MenuItem key={"0"} value={"0"}>
                        Ninguno
                      </MenuItem>
                      {Object(valuesData?.Groups ?? []).map(
                        (data: CacheCatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.groupId}
                    </FormHelperText>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      Nacionalidad
                    </Typography>
                    <Select
                      name="nationality"
                      defaultValue={0}
                      value={values.nationality}
                      onChange={handleChange}
                      error={!!errors.nationality}
                      sx={{ width: "100%" }}
                      //disabled={soloBeneficiario}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.Nationalities ?? []).map(
                        (data: CacheCatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>Sector</Typography>
                    <Select
                      name="sector"
                      defaultValue={0}
                      value={values.sector}
                      onChange={handleChange}
                      error={!!errors.sector}
                      sx={{ width: "100%" }}
                      //disabled={soloBeneficiario}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.Sector ?? []).map(
                        (data: CacheCatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>VIP</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        inputProps={{ "aria-label": "VIP" }}
                        name="vip"
                        checked={values.vip}
                        onChange={(event, checked) => {
                          setFieldValue("vip", checked);
                        }}
                        // disabled={soloBeneficiario}
                      />
                      <Typography>{values.vip ? "Sí" : "No"}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      Políticamente expuesto
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        inputProps={{
                          "aria-label": "Políticamente expuesto",
                        }}
                        name="politicallyExposed"
                        checked={values.politicallyExposed}
                        onChange={(event, checked) => {
                          setFieldValue("politicallyExposed", checked);
                        }}
                        // disabled={soloBeneficiario}
                      />
                      <Typography>
                        {values.politicallyExposed ? "Sí" : "No"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      Recordatorio de cobranza
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        inputProps={{
                          "aria-label": "Recordatorio de Cobranza",
                        }}
                        name="collectionReminde"
                        checked={values.collectionReminde}
                        onChange={(event, checked) => {
                          setFieldValue("collectionReminde", checked);
                        }}
                        // disabled={soloBeneficiario}
                      />
                      <Typography>
                        {values.collectionReminde ? "Sí" : "No"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      ¿Es vendedor?
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        inputProps={{ "aria-label": "isSeller" }}
                        name="isSeller"
                        checked={values.isSeller}
                        onChange={(event, checked) => {
                          setFieldValue("isSeller", checked);
                          if (!checked) {
                            const updatedRowsBranches = Object(
                              valuesData?.Branches
                            ).map((branch: any) => ({
                              folio: "",
                              branch: branch.folio,
                              branchDescription: branch.description,
                              percentage: 0,
                            }));
                            setRowsBranches(updatedRowsBranches);
                          }
                        }}
                        // disabled={soloBeneficiario}
                      />
                      <Typography>{values.isSeller ? "Sí" : "No"}</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {
                  /*values.isSeller && (
                    values.commissionSeller?.filter(com => com.typePerson === 'VENDEDOR').flatMap((commission) => 
                      commission.branchCommission.map((branchCommission, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`${commission.commissionId}-${branchCommission.folio}`}>
                          <TextField
                            label={`${toCamelCase(branchCommission.branchDescription)} (%)`}
                            value={branchCommission.percentage}
                            onChange={(e) => handleCommissionPercentageChange('VENDEDOR', index, e.target.value)}
                            type="number"
                            inputProps={{ step: '0.01', min: '0', max: '100' }}
                            disabled={!values.isSeller}
                          />
                        </Grid>
                      ))
                    )
                  )*/
                  values.isSeller && (
                    <>
                      <Grid item xs={12} sm={6} md={4}></Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "20px" }}
                        >
                          <DataGrid
                            loading={loading}
                            rows={rowsBranches ?? []}
                            columns={columns.filter(
                              (col) => col.field != "branch"
                            )}
                            getRowId={(row) => row.branch}
                            disableRowSelectionOnClick
                            pageSize={3}
                          />
                        </Stack>
                      </Grid>
                    </>
                  )
                }

                {
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ paddingBottom: "20px" }}
                    >
                      <Typography sx={{ ...TextSmallFont }}>
                        ¿Es Lider de línea de negocio?
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          inputProps={{ "aria-label": "isSeller" }}
                          name="leader"
                          checked={values.leader}
                          onChange={(event, checked) => {
                            setFieldValue("leader", checked);
                            if (!checked) {
                              setBranchIsLead([
                                {
                                  folio: "",
                                  branch: "",
                                  branchDescription: "",
                                  percentage: 0,
                                },
                              ]);
                            }
                          }}
                        />
                        <Typography>{values.leader ? "Sí" : "No"}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                }

                {values.leader && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ marginLeft: "-20px" }}
                    >
                      <Stack direction="column" spacing={2}>
                        <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                          Ramo
                        </Typography>
                        <Select
                          sx={{ width: "100%" }}
                          value={branchIsLead?.[0]?.branch&&branchIsLead?.[0]?.branch!=='' ?
                            branchIsLead?.[0]?.branch: "0"}
                          onChange={(e) => {
                            const selectedFolio = e.target.value;
                            const selectedBranch = (rowsBranches ?? []).find(
                              (branch) => branch.branch === selectedFolio
                            );
                            setBranchIsLead((prevBranchIsLead: any) => {
                              if (!prevBranchIsLead) {
                                return prevBranchIsLead;
                              }
                              const updatedBranch = {
                                ...prevBranchIsLead[0],
                                branch: selectedFolio,
                                branchDescription:
                                  selectedBranch?.branchDescription,
                              };
                              return [updatedBranch];
                            });
                          }}
                          variant="outlined"
                          fullWidth
                        >
                          <MenuItem key={'0'} value={'0'} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(rowsBranches ?? []).map((branch: any) => (
                            <MenuItem key={branch.branch} value={branch.branch}>
                              {branch.branchDescription}
                            </MenuItem>
                          ))}
                        </Select>

                        {/*<Select
                        labelId="leader-branch-label"
                        label="Ramo de Lider"
                        value={selectedLeaderBranch}
                        onChange={handleLeaderBranchSelection}
                        fullWidth
                      >
                        {values.commissionSeller
                          ?.filter((com) => com.typePerson === "LIDER")
                          .flatMap((commission) =>
                            commission.branchCommission.map(
                              (branchCommission) => (
                                <MenuItem
                                  key={branchCommission.folio}
                                  value={branchCommission.branch}
                                >
                                  {branchCommission.branchDescription}
                                </MenuItem>
                              )
                            )
                          )}
                              </Select>*/}
                      </Stack>
                      <Stack direction="column" spacing={2}>
                        <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                          Porcentaje
                        </Typography>
                        <TextField
                          value={branchIsLead ? branchIsLead[0]?.percentage : 0}
                          onChange={(e) => {
                            const inputValue = e.target.value.trim();
                            let value = Number(inputValue);
                            value = Math.min(100, Math.max(0.02, value));

                            setBranchIsLead((prevBranchIsLead: any) => {
                              if (!prevBranchIsLead) {
                                return prevBranchIsLead;
                              }
                              const updatedBranch = {
                                ...prevBranchIsLead[0],
                                percentage: Number(value),
                              };
                              return [updatedBranch];
                            });
                          }}
                          type="number"
                          disabled={!values.leader}
                          fullWidth
                          InputProps={{
                            //inputComponent: NumericFormatCustom as any,
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                            inputProps: {
                              min: 0.02,
                              max: 100,
                              step: 0.01,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ paddingBottom: "20px" }}
                  >
                    <Typography sx={{ ...TextSmallFont }}>
                      ¿Ejecutivo de fianzas?
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        inputProps={{ "aria-label": "isSeller" }}
                        name="bondsExecutive"
                        checked={values.bondsExecutive}
                        onChange={(event, checked) => {
                          setFieldValue("bondsExecutive", checked);
                          if (!checked) {
                            setRowBranchIsEjecutive([
                              {
                                folio: "",
                                branch: "CAVA-338",
                                branchDescription: "MAQUILA",
                                percentage: 0,
                              },
                              {
                                folio: "",
                                branch: "CAVA-339",
                                branchDescription: "PRIMA",
                                percentage: 0,
                              },
                            ]);
                          }
                        }}
                      />
                      <Typography>
                        {values.bondsExecutive ? "Sí" : "No"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/*values.bondsExecutive &&
                  values.commissionSeller
                    ?.filter((com) => com.typePerson === Constants.typePersonEjecutive)
                    .flatMap((commission) =>
                      commission.branchCommission.map(
                        (branchCommission, index) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`${commission.commissionId}-${branchCommission.folio}`}
                          >
                            <TextField
                              label={`${branchCommission.branchDescription} (%)`}
                              value={branchCommission.percentage}
                              onChange={(e) =>
                                handleCommissionPercentageChange(
                                  Constants.typePersonEjecutive,
                                  index,
                                  e.target.value
                                )
                              }
                              type="number"
                              inputProps={{
                                step: "0.01",
                                min: "0",
                                max: "100",
                              }}
                              disabled={!values.bondsExecutive}
                            />
                          </Grid>
                        )
                      )
                            )*/}
                {values.bondsExecutive && (
                  <>
                    <Grid item xs={12} sm={6} md={4}></Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ paddingBottom: "20px" }}
                      >
                        <DataGrid
                          rows={rowBranchIsEjecutive ?? []}
                          columns={columnsIsEjecutive.filter(
                            (col) => col.field != "branch"
                          )}
                          getRowId={(row) => row.branch}
                          disableRowSelectionOnClick
                          pageSize={3}
                        />
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Stack>
          <Stack
            direction="row"
            display="flex"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <Box display="flex">
              <Box sx={{ flexGrow: 1 }}></Box>
              <Box sx={{ flexGrow: 0, pb: 4, pt: 2 }}>
                <Button
                  variant="contained"
                  //type="submit"
                  onClick={()=>{
                    handleActionModal();
                  }}
                  endIcon={<Complete color={ColorPureWhite} />}
                  size="large"
                  disableElevation
                  sx={{ backgroundColor: ColorPink }}
                  disabled={values.objectStatusId !== 1}
                >
                  {props.data ? "Actualizar Persona" : "Registrar Persona"}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
      {/* //;---------------------------------------------------------------- */}
      {endorsementSelectionModal}
      {loadingScreen !== false ? <LoadingScreen message="Cargando" /> : <></>}
      {/* //;---------------------------------------------------------------- */}
    </>
  );
}
export default TabGeneral;
