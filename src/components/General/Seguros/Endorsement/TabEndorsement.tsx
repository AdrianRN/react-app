import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  FilledInputProps,
  FormHelperText,
  InputProps,
  LinearProgress,
  OutlinedInputProps,
  styled
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as Yup from "yup";
import { useAlertContext } from "../../../../context/alert-context";
import { IEndorsement } from "../../../../insuranceModels/Endorsement";
import Policies from "../../../../insuranceModels/policies";
import IVehiclePolicy from "../../../../insuranceModels/vehiclepolicie";
import PolicyService from "../../../../insuranceServices/policies.service";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import { ICatalogValue } from "../../../../models/CatalogValue";
import CacheService from "../../../../services/cache.service";
import catalogValueService from "../../../../services/catalogvalue.service";
import { endorsementService } from "../../../../services/endorsement.service";
import Constants from "../../../../utils/Constants";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Button, InputAdornment, Select, Switch } from "../../../OuiComponents/Inputs";
import TextField from "../../../OuiComponents/Inputs/TextField";
import Grid from "../../../OuiComponents/Layout/Grid";
import Stack from "../../../OuiComponents/Layout/Stack";
import { MenuItem } from "../../../OuiComponents/Navigation";
import Accordion from "../../../OuiComponents/Surfaces/Accordion";
import {
  ColorPureWhite,
  LinkLargeFont,
  LinkMediumFont,
  LinkSmallFont,
  TextSmallFont
} from "../../../OuiComponents/Theme";
import { Modal } from "../../../OuiComponents/Utils";
import receiptsGenerator from "../Policies/ReceiptsGenerator";
import AddVehicleToCopy from "./AddVehicleToCopy";
import EndorsementIssuing from "./EndorsementIssuing";
import TabEndorsementSkeleton from "./TabEndorsementSkeleton";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import dayjs from "dayjs";

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
//Creamos un tipo para los estados del endoso.
type typeCatalogEndoStatus = {
  folio: string,
  description: string,
};
function TabEndorsement(props: any) {
  const [waiting, setWaiting] = React.useState(true);
  const [catalogEndoStatus, setCatalogEndoStatus] = React.useState<typeCatalogEndoStatus[]>();
  React.useEffect(() => {
    const fetchCatalogs = async () => {
      const restCatalogEndoStatus = await CacheService.getByFolioCatalog(Constants.statusEndosermentInsuranceCatalogFolio);
      setCatalogEndoStatus(restCatalogEndoStatus.data.values);
    };
    try {
      fetchCatalogs();
      
    } catch (e) {
      console.error("Al parecer no encontro algun endoso. ", e);
    }
  }, []);
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [loading, setLoading] = React.useState(true);
  const [valuesData, setValuesData] = React.useState<IEndorsement>();
  const [policiesData, setPoliciesData] = React.useState<Policies>();
  const [vehicleData, setVehicleData] = React.useState<IVehiclePolicy>();
  const [endorsemenTypes, setEndorsementTypes] = React.useState<
    ICatalogValue[]
  >([]);
  const [validateStatusPolicy, setValidateStatusPolicy] = React.useState("");
  const [discountsettingOne, setDiscountsettingOne] = React.useState(false);
  const [discountsettingTwo, setDiscountsettingTwo] = React.useState(false);
  const [additionalChargeIva, setAdditionalChargeIva] = React.useState(false);
  const [transactions, setTransactions] = React.useState<ICatalogValue[]>([]);
  const [iva, setIva] = React.useState<number>(16);
  //Este hook controla  la la activacion de prima siempre y cuando se seleccione
  //un tipo de endoso
  const [isSelectedEndorsement, setIsSelectedEndorsement] =
    React.useState(true);
  //Este hook se encarga de renderizar  los datos en la seccion de primas
  const [renderized, setRenderized] = React.useState(0);

  //Este hook abre el modal alerta
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  //Estos hook almacenan el evento para ejecutar el handle del formik desde el modal
  const [hookEndorsementType, setHookEndorsementType] = React.useState<any>();
  const [hookTransactions, setHookTransactions] = React.useState<any>();
  const [hookHandleMovement, setHookHandleMovement] = React.useState("");
  
  //Este hook se encarga de verificar si se ha realizado algun cambio que requiera 
  //reset total del endoso cuando se actualice (ademas activa boton cancelar)
  const [updateEndo, setUpdateEndo] = React.useState(false);
  //Este hook mostrara la seccion de prima dependiendo la transaccion
  const [enableChargeHook, setEnableChargeHook] = React.useState(false);
  const endoserment = props.Endorsement;
  React.useEffect(() => {
      fechtData().finally(()=>
      setWaiting(false));
  }, [loading]);
 
  React.useEffect(() => {
    switch (renderized) {
      case 1:
        //resetea tipo de movimeinto
        values.transactions = "0";
        //Bloquea campos de prima
        setIsSelectedEndorsement(true);
        //restablece el endoso con todos los cambios efectuados
        resetValues();
        setRenderized(0);
        break;
      case 2:
        setIsSelectedEndorsement(false);
        resetValues();
        setRenderized(0); //importante colocar en cada caso
        break;
      default:
      //Nothing
    }
  }, [renderized]);
  const fechtData = async () => {try{
    //console.log('props ---> ',props)
    const typeEndosermentCatalog = await CacheService.getByFolioCatalog(
      Constants.endorsementInsuranceCatalogFolio
    );
    setEndorsementTypes(typeEndosermentCatalog.data.values);
    if (props.endorsement == undefined) {
      const restVehicle = await VehiclePolicy.getVehiclePolicy(props.policyId);
      setVehicleData(restVehicle.data);
      const restPolicie = await PolicyService.getPoliciesByFolio(
        props.policyId
      );
      setPoliciesData(restPolicie.data);
    } else {
      const restEndorsement = props.endorsement
        ? props.endorsement.endorsement
        : props.endorsement;
      values.endorsementType = restEndorsement?.[0].endorsementType;
      handleMovement(restEndorsement?.[0].endorsementType);
      setValuesData(restEndorsement?.[0]);
      setPoliciesData(restEndorsement?.[0].policies?.[0]);
      const restVehicle = await VehiclePolicy.getVehiclePolicy(props.policyId);
      setVehicleData(restVehicle.data?.[0]);
      setIsSelectedEndorsement(false);
      setEnableChargeHook(enableCharge(restEndorsement?.[0].transactions+''??''));
    }

    /*if (restEndorsement) {
      setDiscountsettingOne(restEndorsement.data.settingOne > 0);
      setDiscountsettingTwo(restEndorsement.data.settingTwo > 0);
    }*/
    //setEndorsementData();

    setLoading(false);
  }finally{
    setWaiting(false);
  }};
  // const handleValidate = () => {

  // };
  const handleMovement = async (folio: string) => {
    if (folio == "CAVA-269") {
      const response = await CacheService.getByFolioCatalog(Constants.endorsementInsuranceTypeACatalogFolio);
      setTransactions(response.data.values);
    }
    if (folio == "CAVA-267") {
      const response = await CacheService.getByFolioCatalog(Constants.endorsementInsuranceTypeBCatalogFolio);
      setTransactions(response.data.values);
    }
    if (folio == "CAVA-268") {
      const response = await CacheService.getByFolioCatalog(Constants.endorsementInsuranceTypeDCatalogFolio);
      setTransactions(response.data.values);
    }
  };

  const initialValues = {
    folio: valuesData?.endorsementType ?? "",
    folioOT: valuesData?.folioOT ?? "",
    numberEndorsement: valuesData?.numberEndorsement ?? "",
    policy: props.policyId,
    endorsementType: valuesData?.endorsementType ?? "",
    endorsementMovement: valuesData?.transactions ?? "",
    transactions: valuesData?.transactions ?? "",
    concept: valuesData?.concept ?? "",
    startDate: valuesData?.startDate ?? dayjs(new Date()).format('YYYY-MM-DD'),
    endDate: valuesData?.endDate ?? dayjs(new Date()).add(1,'year').format('YYYY-MM-DD'),
    terminationDate: valuesData?.terminationDate ?? dayjs(new Date()).add(1,'year').format('YYYY-MM-DD'),
    amount: valuesData?.amount ?? 0,
    fees: valuesData?.fees ?? 0,
    issuanceExpenses: valuesData?.issuanceExpenses ?? 0,
    attachedFiles: valuesData?.attachedFiles ?? "",
    objectStatusId: valuesData?.objectStatusId ?? 1,
    netPremium: valuesData?.netPremium ?? 0,
    settingOne: valuesData?.settingOne ?? 0,
    settingTwo: valuesData?.settingTwo ?? 0,
    rights: valuesData?.rights ?? 0,
    financing: valuesData?.financing ?? 0,
    financingPercentage: valuesData?.financingPercentage ?? 0,
    iva: valuesData?.iva ?? "0",
    totalPremium: valuesData?.totalPremium ?? 0,
    additionalCharge: valuesData?.additionalCharge ?? 0,
    subTotal: valuesData?.subTotal ?? 0,
    endorsementStatus: valuesData?.endorsementStatus ?? Constants.endorsementStatus.pending,
    //customPackageFolio:valuesData?.customPackageFolio ?? '',
    policies: [],
    receipt: null,
  };
  const onSubmit = async (data: any) => {
    if (props.endorsement != undefined) {
      const newData = {
        policy: props.policyId,
        concept: data.concept,
        numberEndorsement: data.numberEndorsement,
        endorsementType: data.endorsementType,
        endorsementMovement: data.endorsementMovement,
        transactions: data.transactions,
        startDate: data.startDate,
        endDate: data.endDate,
        terminationDate: data.terminationDate,
        amount: data.amount,
        fees: data.fees,
        issuanceExpenses: data.issuanceExpenses,
        attachedFiles: data.attachedFiles,
        netPremium: data.netPremium,
        settingOne: data.settingOne,
        settingTwo: data.settingTwo,
        additionalCharge: data.additionalCharge,
        rights: data.rights,
        subTotal: data.subTotal,
        financing: data.financing,
        financingPercentage: data.financingPercentage,
        iva: data.iva,
        totalPremium: data.totalPremium,
        endorsementStatus: data.endorsementStatus ?? Constants.endorsementStatus.pending ,//data.endorsementStatus,
        objectStatusId: 1,
      };
      await endorsementService
        .putEndorsementOne(props.endorsementId ?? props.endorsement?.folio, newData)
        .then( async (response: any) => {
          let newEndo = response.data;
          //Si el endoso cambio de tipo o de movimiento
          if(updateEndo==true){//Restaurar todos los cambios aplicados apoliza, auto y plan
            //PArchar vehiculo restVehicle.data
            //Parchar poliza[AddVehicleToCopy( restPolicie.data )]
            //Obtenemos la poliza original
            const restPolicie = await PolicyService.getPoliciesByFolio(props.policyId);
            //Obtenemos los vehiculos de la poliza, en caso de existir
            const restVehicle:any = await VehiclePolicy.getVehiclePolicy(props.policyId);
            //Poliza
            const newPolicy = restPolicie.data;
            //En caso de eliminar la poliza
            if(data.transactions== Constants.endorsementTransactions.cancelPolicy){
              newPolicy.policyStatusFolio = Constants.statusCancelledFolio;//Constants.endorsementTransactions.cancelPolicy;
              newPolicy.policyStatusDescription = 'CANCELADA';
            }
            //Autos
            if(restVehicle.data){
              newPolicy.vehiclePolicy = AddVehicleToCopy( restVehicle.data );//restVehicle.data?.[0];
            }
            //Guardamos la poliza en el endoso
            await endorsementService.putEndorsementPolicies(
              props.endorsement.folio, 
              props.endorsement.endorsement[0].folioEndo,
              props.endorsement.endorsement[0].policies[0].folio ,
              newPolicy)
              .then(async (response: any) => {
                //Ahora parchamos el paquet custom a null
                await endorsementService.patchEndorSementCPackage(props.endorsement.folio, 
                  props.endorsement.endorsement?.[0].folioOT, "" ).then( (response)=>{
                    //Actualizamos los props
                    props.onDataChange(response.data);
                    setValuesData(response.data.endorsement?.[0]);
                    setUpdateEndo(false);
                    setDataAlert(
                      true,
                      "El endoso  se actualizó con éxito.",
                      "success",
                      autoHideDuration
                    );
                  });
              })
              .catch((e: Error) => {
                setDataAlert(true, e.message, "error", autoHideDuration);
              });
            //guardamos la nueva poliza en el endoso obtenido en la respuesta
            // newEndo.endorsement[0].policies = newPolicy;//restPolicie.data;
            // response.data.endorsement[0].policies[0].vehiclePolicy = ;
            
          }else{//En caso de no cambiar el tipo o movimeinto de endoso, actualizar normal
            setDataAlert(
              true,
              "El endoso  se actualizó con éxito.",
              "success",
              autoHideDuration
            );
            props.onDataChange(newEndo);
            setValuesData(newEndo.endorsement?.[0]);
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {//Se crea por primera vez el endoso
      data.policies = [policiesData]; 
      if(data.policies[0].vehiclePolicy)
        data.policies[0].vehiclePolicy = vehicleData ? [AddVehicleToCopy( vehicleData )] : null; 

      if(data.policies[0].personPolicie)
        data.policies[0].personPolicie = policiesData?.personPolicie ?? null;
      //En caso de que la poliza se cancele
      if(data.transactions== Constants.endorsementTransactions.cancelPolicy){
        data.policies[0].policyStatusFolio = Constants.endorsementTransactions.cancelPolicy;
        data.policies[0].policyStatusDescription = 'CANCELADA';

      }
      await endorsementService
        .postEndorsement(data)
        .then(async (response: any) => {
          const restVehicle:any = await VehiclePolicy.getVehiclePolicy(props.policyId);
          if(restVehicle.data){
            //console.log('response.data: ',response.data)
            response.data.endorsement[0].policies[0].vehiclePolicy = AddVehicleToCopy( restVehicle.data ); 
            //console.log(' response.data.endorsement[0].policies[0].vehiclePolicy: ', response.data.endorsement[0].policies[0].vehiclePolicy)
            //newPolicy.vehiclePolicy = [AddVehicleToCopy( restVehicle.data )];//restVehicle.data?.[0];
          }
          //Guardamos la poliza en el endoso
          await endorsementService.putEndorsementPolicies(
            response.data.folio, 
            response.data.endorsement[0].folioEndo,
            response.data.endorsement[0].policies[0].folio ,
            response.data.endorsement[0].policies[0])
            .then(async (response: any) => {
              //Ahora parchamos el paquet custom a null
                  //Actualizamos los props
                  props.onDataChange(response.data);
                  setValuesData(response.data.endorsement?.[0]);
                  setDataAlert(
                    true,
                    "El endoso fue creado correctamente.",
                    "success",
                    autoHideDuration
                  );
            })
            .catch((e: Error) => {
              setDataAlert(true, e.message, "error", autoHideDuration);
            });

        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue, setFieldError } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        //  numberEndorsement: Yup.string().required("Este campo es requerido."),
        //  concept: Yup.string().required("Este campo es requerido."),
        //  endorsementType: Yup.string().required("Este campo es requerido."),
        // // createdAt: Yup.string().required("Este campo es requerido"),
        // // startDate: Yup.string().required("Este campo es requerido."),
        // // endDate: Yup.string().required("Este campo es requerido."),
        // // terminationDate: Yup.string().required("Este campo es requerido."),
        //  netPremium: Yup.string().required("Este campo es requerido."),
        // fees: Yup.string().required("Este campo es requerido."),
        // issuanceExpenses: Yup.string().required("Este campo es requerido."),
        // iva: Yup.string().required("Este campo es requerido."),
        // totalPremium: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });
  
  const computeBonus = ()=>{
    /*Identificando fields estaticos
      subtotal
      iva
      totalPremium
    */

      const v_subTotal:number =
      Number(values.netPremium) -
      Number(values.settingOne) -
      Number(values.settingTwo) +
      Number(values.additionalCharge) +
      Number(values.rights);
      setFieldValue('subTotal',v_subTotal);
      const v_financingPercentage:number = (v_subTotal === 0) ? Number(0): parseFloat(
        ((Number(values.financing) / v_subTotal) * 100).toFixed(2) );
      setFieldValue('financingPercentage',v_financingPercentage);

      const v_iva:number = parseFloat(((v_subTotal * Number(iva)) / 100 ).toFixed(2));
      setFieldValue('iva',v_iva);

      const v_totalPremium:number = parseFloat((v_subTotal + v_iva).toFixed(2));
      setFieldValue('totalPremium',v_totalPremium);
      setCalculate(false);
  };
  //Effect para autoCalcular
  const [calculate, setCalculate] = React.useState(false);
  React.useEffect(()=>{
    if(calculate===true){
      computeBonus();
    }
  },[calculate]);
  //----------------
  const ItemStack = styled(Stack)(({}) => ({
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "5px",
    borderRadius: "16px",
  }));

  const resetValues = () => {
    values.netPremium = 0;
    values.settingOne = 0;
    values.settingTwo = 0;
    values.additionalCharge = 0;
    values.rights = 0;
    values.subTotal = "0";
    values.financing = 0;
    values.iva = "0";
    values.totalPremium = 0;
  };
  const restoreValues = () => {
    setFieldValue('netPremium',valuesData?.netPremium);
    setFieldValue('settingOne',valuesData?.settingOne);
    setFieldValue('settingTwo',valuesData?.settingTwo);
    setFieldValue('additionalCharge',valuesData?.additionalCharge);
    setFieldValue('rights',valuesData?.rights);
    setFieldValue('subTotal',valuesData?.subTotal);
    setFieldValue('financing',valuesData?.financing);
    setFieldValue('iva',valuesData?.iva);
    setFieldValue('totalPremium',valuesData?.totalPremium);
    setFieldValue('endorsementType',valuesData?.endorsementType);
    setFieldValue('transactions',valuesData?.transactions);
    setIsSelectedEndorsement(false);
    setEnableChargeHook(enableCharge(valuesData?.transactions+''));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //Esta funcion determina los valores  numericos en prima que pueden ser ingresados
  //Dependiendo el tipo de endoso
  const premiumValidation = ()=>{
    let message: string='';
    switch(values.endorsementType){
///////Si es un endoso de tipo A
      case 'CAVA-269':
        // y tipo de movimiento Inclusión de cobertura 
        if(values.transactions == 'CAVA-270'){
          //validar que el monto de prima del endoso, monto del recibo sean positivos
          if(Number(values.netPremium)>=0){  
            //handleChange(e);
          }else{
            message="Los valores de la prima deben ser positivos.";
            values.netPremium=0;
            setFieldValue('netPremium',0);
            setDataAlert( true,
              message,//"Los valores de la prima deben ser positivos.",
              "warning", autoHideDuration
            );
          }
        }else{
          //e.target.value='0';
          //handleChange(e);
        }
        break;
////////Si es tipo D 
      case 'CAVA-268':
        //Baja de cobertura
        if(values.transactions == 'CAVA-278'){
          // validar que el monto del endoso y monto del recibo sean negativos
          if(Number(values.netPremium)<0){  
            //handleChange(e);
          }else{
            message="Los valores de la prima deben ser negativos.";
            values.netPremium=-1;
            setFieldValue('netPremium',-1);
            try{setDataAlert( true,
              message,
              "warning", autoHideDuration
            );}catch(exception){}
          }
        }else{
          //handleChange(e);
        }
        
        break;
      default:
        //handleChange(e);
    }
  }
  const inputProps269 = {
        maxLength: 15,
        min: 0, // Valor mínimo
  };
  const inputProps268 = {
    maxLength: 16,
    max:0,
    min: -999999999999.999, // Valor mínimo permitido
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
              "Al cambiar el tipo de endoso o movimiento, se restablecerán todos los cambios afectados. ¿Desea continuar?"
            }
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{ marginRight: "auto", height: "30px" }}
              variant="outlined"
              onClick={handleCloseModal}
            >
              No
            </Button>
            <Button
              onClick={() => {
                setUpdateEndo(true);
                if (hookTransactions != null || hookTransactions != undefined) {
                  //Logica para cargar Movimiento values.transactions
                  handleChange(hookTransactions);
                  setRenderized(2);
                  setDataAlert(
                    true,
                    "Se han restablecido los datos.",
                    "success",
                    autoHideDuration
                  );
                  setHookTransactions(null);
                  handleCloseModal();
                  setEnableChargeHook(enableCharge(hookTransactions.target.value+''));
                } else if (
                  hookEndorsementType != null ||
                  hookEndorsementType != undefined
                ) {
                  //Logica para cargar Tipo de endoso values.endorsementType
                  //handleMovement(data.folio);
                  handleChange(hookEndorsementType);
                  setRenderized(1);
                  setDataAlert(
                    true,
                    "Se han restablecido los datos.",
                    "success",
                    autoHideDuration
                  );
                  handleMovement(hookHandleMovement);
                  setFieldValue('transactions','0');
                  //values.transactions = "";
                  setHookEndorsementType(null);
                  setHookTransactions(null);
                  setHookHandleMovement("");
                  setEnableChargeHook(false);
                  handleCloseModal();
                }
                
              }}
              sx={{ height: "20px", padding: "10px 25px" }}
            >
              Si
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
  //La siguiente  funcion activara la seccion de monto o prima del endoso
  //dependiendo la transaccion del endoso seleccionada.
  const enableCharge = (transaction: string) =>{
    let active: boolean = true;
    switch(transaction){
    case Constants.endorsementTransactions.switchContractor://CAMBIO DE CONTRATANTE
      active = false;
      break;
    case Constants.endorsementTransactions.modify://MODIFICAR ENDOSO GENERAL
      active = false;
      break;
    case Constants.endorsementTransactions.cancelPolicy://CANCELACION DE POLIZA
      active = false;
      break;
    case Constants.endorsementTransactions.addPolicyholder://BENEFICIARIO PREFERETE
    active = false;  
    break;
    default:
      setDataAlert(
        true,
        "Seccion de primas habilitada.",
        "success",
        autoHideDuration
      );
   }
    return active;
  };
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++;
const createReceipts = async() => {
  //
  const branchdata = await CompaniesBranchesService.
  getBranchesByCompanyFolio(valuesData?.policies?.[0]?.insuranceCompany??'');
    let commissionsONESTA: number = 0; 
     const policy = valuesData?.policies[0];
     const indexedBranchData = Object(branchdata.data).reduce((acc: any, el: any)=>{
      acc[el.branch.folio] = el
      return acc
    },{});
    if(indexedBranchData.length>0&&policy){
      if(indexedBranchData[policy?.branchId].branch.commissionPercentage){
        commissionsONESTA=indexedBranchData[policy?.branchId].branch.commissionPercentage;//(policy?.netPremium*( Number(indexedBranchData[policy?.branchId].branch.commissionPercentage) ??0/100));
      }
    }else{
      //Compania sin ramos :(
    }

  const group:any = await catalogValueService.getCatalogValueFolio(valuesData?.policies?.[0]?.groups??'');
  const branch:any = await catalogValueService.getCatalogValueFolio(valuesData?.policies?.[0]?.branchId??'');
  const sumary: any = {
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
    groups: valuesData?.policies?.[0]?.groups,//policyDataHook?.groups,
    groupsDescription: group.data.description??'',
    //cliente
    clientId: valuesData?.policies?.[0]?.clientId,
    clientName: valuesData?.policies?.[0]?.clientName,
    //ramo
    branchId: valuesData?.policies?.[0]?.branchId,
    branch: branch.data.description??'',//'',

    totalPremium: valuesData?.totalPremium, //Prima Total
    payReceipt: '',
    currency: 'CAVA-68',

    policyType:'Endosos Seguros',
    sellerFolio:valuesData?.policies?.[0]?.salesPerson,
  };
  receiptsGenerator(sumary);
};
const issuingEndorsement = async ()=>{
  const newData = {
    policy: valuesData?.policies?.[0]?.folio,
    concept: valuesData?.concept,
    numberEndorsement: valuesData?.numberEndorsement,
    endorsementType: valuesData?.endorsementType,
    endorsementMovement: valuesData?.endorsementMovement,
    transactions: valuesData?.transactions,
    startDate: valuesData?.startDate,
    endDate: valuesData?.endDate,
    terminationDate: valuesData?.terminationDate,
    amount: valuesData?.amount,
    fees: valuesData?.fees,
    issuanceExpenses: valuesData?.issuanceExpenses,
    attachedFiles: valuesData?.attachedFiles,
    netPremium: valuesData?.netPremium,
    settingOne: valuesData?.settingOne,
    settingTwo: valuesData?.settingTwo,
    additionalCharge: valuesData?.additionalCharge,
    rights: valuesData?.rights,
    subTotal: valuesData?.subTotal,
    financing: valuesData?.financing,
    financingPercentage: valuesData?.financingPercentage,
    iva: valuesData?.iva,
    totalPremium: valuesData?.totalPremium,
    endorsementStatus: Constants.endorsementStatus.current ,//Endoso VIGENTE
    objectStatusId: 1,
  };
  await endorsementService
   .putEndorsementOne(props.endorsementId ?? props.endorsement.folio , newData).then(async (response)=>{
    //Planchar poliza-----------------------------------------------
    props.onDataChange(response.data);
    setValuesData(response.data.endorsement?.[0]);
    setUpdateEndo(false); 
    setDataAlert(
        true,
        "Se ha emitido el endoso.",
        "success",
        autoHideDuration
      );
      //Logica para planchar poliza
   }).catch((error)=>{
    setDataAlert(
      true,
      "Se produjo un error al emitir el endoso.",
      "error",
      autoHideDuration
    );
  });
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++;
const startDateHandle = (e:any)=>{
  if(dayjs(e).isBefore(dayjs(values.endDate))){
    setFieldValue('startDate',e);
  }else{
    setDataAlert(
      true,
      "La fecha de inicio de vigencia no puede ser posterior a la fecha de fin de vigencia.",
      "error",
      autoHideDuration
    );
  }
};
const endDateHandle = (e:any)=>{
  if(dayjs(e).isAfter(dayjs(values.startDate))){
    setFieldValue('endDate',e);
  }else{
    setDataAlert(
      true,
      "La fecha de fin de vigencia no puede ser anterior a la fecha de inicio de vigencia.",
      "error",
      autoHideDuration
    );
  }
};
  return (
    <>
      {loading ? (
        <TabEndorsementSkeleton />
      ) : (
        <Box component="form" maxWidth="auto" onSubmit={handleSubmit}>
          <Stack direction="column">
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={LinkLargeFont}>Datos del endoso</Typography>
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
                      <Grid item xs={12} sm={1.5}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Núm. Endoso
                          </Typography>
                          <TextField
                            name="numberEndorsement"
                            value={values.numberEndorsement}
                            onChange={handleChange}
                            type="text"
                            helperText={errors.numberEndorsement}
                            error={!!errors.numberEndorsement}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={1.5}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            OT Endoso
                          </Typography>
                          <TextField
                            name="folioOT"
                            value={values.folioOT}
                            onChange={handleChange}
                            type="text"
                            helperText={errors.folioOT}
                            error={!!errors.folioOT}
                            disabled
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Concepto
                          </Typography>
                          <TextField
                            name="concept"
                            value={values.concept}
                            onChange={handleChange}
                            type="text"
                            helperText={errors.concept}
                            error={!!errors.concept}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Tipo de endoso
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="endorsementType"
                            value={values.endorsementType ?? "0"}
                            onChange={(event) => {
                              if (
                                values.endorsementType + "" !=
                                event.target.value + ""
                              ) {
                                if (
                                  values.endorsementType + "" == "0" ||
                                  values.endorsementType + "" == ""
                                ) {
                                  //Primera vez que se agregua un valor
                                  handleChange(event);
                                  setRenderized(1);
                                  setEnableChargeHook(false);
                                } else if (
                                  values.transactions == "0" ||
                                  values.transactions == ""
                                ) {
                                  //Primera vez que se agregua un valor
                                  handleChange(event);
                                  setRenderized(1);
                                  setEnableChargeHook(false);
                                } else {
                                  //Ya habia un valor previamente, advertir con modal
                                  //Abrir modal y si dice SI entonces hacer reset
                                  //Si dice NO mantener los datos actuales
                                  setIsModalOpen(true);
                                  //Mando valor a hookEndorsementType
                                  setHookEndorsementType(event);
                                }
                              }
                            }}
                            error={!!errors.endorsementType}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          >
                            <MenuItem value={"0"} key={"0"} disabled>
                              Selecciona
                            </MenuItem>
                            {endorsemenTypes.map((data: ICatalogValue) => {
                              return (
                                <MenuItem
                                  onClick={() => {
                                    if (
                                      values.transactions + "" != "" &&
                                      values.transactions + "" != "0" &&
                                      values.transactions + "" != "  " &&
                                      values.transactions + "" != " "
                                    ) {
                                      setHookHandleMovement(data.folio);
                                    } else {
                                      handleMovement(data.folio);
                                    }
                                    //handleMovement(data.folio);
                                    //setIsModalOpen(true);
                                    //setRenderized(1);
                                  }}
                                  key={data.folio}
                                  value={data.folio}
                                >
                                  {data.description}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.endorsementType}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Movimiento
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="transactions"
                            value={values.transactions ?? "0"}
                            onChange={(event) => {
                              if (
                                values.transactions + "" !=
                                event.target.value + ""
                              ) {
                                if (
                                  values.transactions + "" == "0" ||
                                  values.transactions + "" == ""
                                ) {
                                  //Primera vez que se agregua un valor
                                  handleChange(event);
                                  setRenderized(2);
                                  
                                  setEnableChargeHook(enableCharge(event.target.value+''));
                                } else {
                                  //Ya habia un valor previamente, advertir con modal
                                  //Abrir modal y si dice SI entonces hacer reset
                                  //Si dice NO mantener los datos actuales
                                  setIsModalOpen(true);
                                  //Mando valor a hookTransactions
                                  setHookTransactions(event);
                                }
                              }
                              //setEnableChargeHook(enableCharge(event.target.value+''));
                            }}
                            error={!!errors.transactions}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          >
                            <MenuItem value={"0"} key={"0"} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(
                              transactions.map((data: ICatalogValue) => (
                                <MenuItem
                                  key={data.folio}
                                  value={data.folio}
                                >
                                  {data.description}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                          <FormHelperText sx={{ color: "#d22e2e" }}>
                            {errors.transactions}
                          </FormHelperText>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Estado del endoso
                          </Typography>
                          <Select
                          sx={{ width: "100%" }}
                          name="endorsementStatus"
                          onChange={handleChange}
                          value={
                            values.endorsementStatus
                              ? values.endorsementStatus
                              : 0
                          }
                          error={!!errors.endorsementStatus}
                          disabled
                          >
                            <MenuItem key={'0'} value={'0'} disabled>
                              CREACION
                            </MenuItem>
                            {Object( catalogEndoStatus ?? [] ).map((data: any) => (
                              <MenuItem key={data.folio} value={data.folio} >
                                {data?.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Vigencia de
                          </Typography>
                          <TextField
                            name="startDate"
                            value={values.startDate}
                            onChange={(e) => {
                              //handleChange(e);
                              startDateHandle(e.target.value);
                            }}
                            type="date"
                            helperText={errors.startDate}
                            error={!!errors.startDate}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Vigencia hasta
                          </Typography>
                          <TextField
                            name="endDate"
                            value={values.endDate}
                            onChange={(e) => {
                              //handleChange(e);
                              endDateHandle(e.target.value);
                            }}
                            type="date"
                            helperText={errors.endDate}
                            error={!!errors.endDate}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{ paddingBottom: "32px" }}
                        >
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha baja
                          </Typography>
                          <TextField
                            name="terminationDate"
                            type="date"
                            value={values.terminationDate}
                            onChange={handleChange}
                            helperText={errors.terminationDate}
                            error={!!errors.terminationDate}
                            disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {enableChargeHook ? (<Accordion sx={{ marginBottom: "30px" }}>
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
                      <Grid item xs={12} sm={12}>
                        {isSelectedEndorsement == true ? (
                          <Typography sx={{ ...LinkMediumFont }}>
                            Para habilitar captura de esta seccion primero
                            seleccione un tipo de endoso y despues un tipo de
                            movimiento
                          </Typography>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12}></Grid>

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
                                values.netPremium ? values.netPremium : 0
                              }
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
                              }}
                              helperText={errors.netPremium}
                              error={!!errors.netPremium}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                                inputProps: (values.transactions == 'CAVA-278') ? inputProps268 : inputProps269,
                              }}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                              
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
                              value={values.settingOne}
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
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
                                isSelectedEndorsement ||
                                !discountsettingOne ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "Descuento" }}
                              onChange={(event, checked) => {
                                setDiscountsettingOne(checked);
                                if (!checked) {
                                  setFieldValue("settingOne", 0);
                                  if(calculate===false)
                                    setCalculate(true);
                                };
                              }}
                              checked={discountsettingOne}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
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
                              value={values.settingTwo}
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
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
                                isSelectedEndorsement ||
                                !discountsettingTwo ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "Descuento" }}
                              onChange={(event, checked) => {
                                setDiscountsettingTwo(checked);
                                if (!checked) {
                                  setFieldValue("settingTwo", 0);
                                  if(calculate===false)
                                    setCalculate(true);
                                };
                              }}
                              checked={discountsettingTwo}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                            <Typography>DESCUENTO</Typography>
                          </ItemStack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Cargo extra
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="additionalCharge"
                              value={values.additionalCharge}
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
                              }}
                              helperText={errors.additionalCharge}
                              error={!!errors.additionalCharge}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled={
                                isSelectedEndorsement ||
                                !additionalChargeIva ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Switch
                              inputProps={{ "aria-label": "Descuento" }}
                              onChange={(event, checked) => {
                                setAdditionalChargeIva(checked);
                                if (checked) {
                                  setIva(0);
                                  if(calculate===false)
                                    setCalculate(true);
                                }else {
                                  setIva(16);
                                  setFieldValue("additionalCharge", 0);
                                  setCalculate(true);
                                }
                              }}
                              checked={additionalChargeIva}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                            <Typography>AFECTA IVA</Typography>
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
                              value={values.rights}
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
                              }}
                              helperText={errors.rights}
                              error={!!errors.rights}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
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
                              value={values.subTotal}
                              helperText={errors.subTotal}
                              error={!!errors.subTotal}
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
                            Financiamiento
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              name="financing"
                              value={ values.financing}
                              onChange={(e)=>{
                                handleChange(e);
                                if(calculate===false)
                                  setCalculate(true);
                              }}
                              helperText={errors.financing}
                              error={!!errors.financing}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }
                            />
                          </Stack>
                          <ItemStack direction="row" spacing={1}>
                            <Typography>
                              MENSUAL{" "}{values.financingPercentage}%
                            </Typography>
                          </ItemStack>
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
                              value={values.iva}
                              helperText={errors.iva}
                              error={!!errors.iva}
                              InputProps={{
                                inputComponent: NumericFormatCustom as any,
                              }}
                              disabled/*={
                                isSelectedEndorsement ||
                                validateStatusPolicy === Constants.statusActive ||
                                (valuesData?.endorsementStatus === Constants.endorsementStatus.current)
                              }*/
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
                              value={values.totalPremium}
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
                    </Grid>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>):(<></>)}
            <Grid item xs={12} md={8} />
            <Grid item xs={12} md={12} alignSelf="flex-end" textAlign="end">
              {updateEndo&&(props.endorsement != undefined) ? (<>
                <Button
                size="large"
                variant="outlined"
                //disabled={isSelectedEndorsement}
                onClick={()=>{
                  //este boton se encargara de regresar los datos a como estaban:
                  restoreValues();
                  setUpdateEndo(false);
                }}
                disabled={(valuesData?.endorsementStatus === Constants.endorsementStatus.current)}
                >
                Cancelar
              </Button>  <></>
              </>  ):(<></>)}
              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={isSelectedEndorsement ||
                  (props?.endorsement?.endorsement?.[0]?.endorsementStatus === Constants.endorsementStatus.current)}
              >
                {valuesData == undefined ? "Crear endoso" : "Actualizar endoso"}
              </Button>    <></>
              {!updateEndo&&(props.endorsement != undefined) ?
              (<span>
              <Button
                variant="contained"
                //type="submit"
                size="large"
                disabled={isSelectedEndorsement 
                  ||(props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)
                }
                onClick={async ()=>{
                  //Validamos si es necesario que exista una prima
                  if(Number(values.netPremium)===0&&enableChargeHook===true){
                    setFieldError('netPremium','Se requiere ingresar al menos un valor en la prima. No puede ser cero.');
                    setDataAlert(
                      true,
                      "¡Atención! Se requiere ingresar al menos un valor en la prima. No puede ser cero.",
                      "error",
                      autoHideDuration
                    );
                    return '';
                  }else{
                    //Ejecuta las acciones hacia la poliza 
                    await EndorsementIssuing(values.transactions,
                      props.endorsement.endorsement?.[0].policies,
                      props.endorsement.endorsement?.[0].customPackageFolio);

                    //Crea el recibo del endoso
                      if(values.transactions//props.endorsement.endorsement?.[0].transactions
                      !== Constants.endorsementTransactions.switchContractor && 
                      values.transactions !== Constants.endorsementTransactions.addPolicyholder && 
                      values.transactions !== Constants.endorsementTransactions.modify &&
                      values.transactions !== Constants.endorsementTransactions.cancelPolicy){
                          //Crear recibo si es una transaccion que genere costo
                          //console.log('Recibo')
                          await createReceipts();  
                    }

                    //Actualiza y emite el endoso
                    await issuingEndorsement(); 
                  }
                  

                }}
                
              >
                {"Emitir endoso"}
              </Button>
              </span>):(<></>)}
              
            </Grid>
          </Stack>
          <MessageBar
            open={isSnackbarOpen}
            severity={severity}
            message={messageAlert}
            close={handleSnackbarClose}
            autoHideDuration={autoHideDuration}
          />
          {endorsementSelectionModal}
          {(waiting) ? <LoadingScreen message='Cargando' /> : <></>}
        </Box>
      )}
    </>
  );
}

export default TabEndorsement;
