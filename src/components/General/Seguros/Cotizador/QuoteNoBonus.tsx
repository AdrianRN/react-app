import React from "react";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPureWhite,
  SideBarItemFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import {
  Button,
  InputAdornment,
  Select,
  TextField,
} from "../../../OuiComponents/Inputs";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Box, Paper, SelectChangeEvent } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import dayjs, { Dayjs } from "dayjs";
import { ArrowRight } from "../../../OuiComponents/Icons";
import SendQuotePeopleModal from "./SendQuotePeopleModal";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import * as Yup from "yup";
import { useFormik } from "formik";

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
type NoBonusFormat = {
  vigencyStartDate: Dayjs;
  vigencyEndDate: Dayjs;
  vigencyTotalDays: number;

  totalSuretyAmount: number;
  bonus: number;
  CNSF: number;
  expeditionCost: number;
  creditBureauFees: number;
  subtotal: number;
  rateIva: number;
  totalIva: number;
  totalBonus: number;
};
function QuoteNoBonus() {
  //(props: any) {
  const [qouteData, setQouteData] = React.useState<any>({});
  const initialValues = {
    //SECCION 0 - Monto Total Contrato
    contractAmount:0,
    rateIva:16,
    totalIva:0,
    totalContractAmount: 0,
    //SECCION 1 - Total Monto Afianzado
    suretyAmount:0,
    securedPercentage:0.02,
    totalSuretyAmount:0,
    //SECCION 2 - Total Dias de Vigencia
    vigencyStartDate: dayjs(new Date()),
    complianceDate:dayjs(new Date()),
    vigencyEndDate: dayjs(new Date()).add(365, "days"),
    vigencyTotalDays: (dayjs(new Date()).add(365, "day")).diff(dayjs(new Date()), "day"),
    //SECCION 3 - Prima Total
    annualRate:0.02,
    bonus: 0,
    CNSF: 0,
    expeditionCost: 0,
    creditBureauFees: 0,
    subtotal: 0,
    rateIvaS3:16,
    totalIvaS3:0,
    totalBonus: 0,
  };
  const YUPValidation = Yup.object({
    //SECCION 0 - Monto Total Contrato
    contractAmount:Yup.number().required("Este campo es requerido."),
    rateIva:Yup.number().required("Este campo es requerido."),
      //totalIva:Yup.number().required("Este campo es requerido."),
      //totalContractAmount: Yup.number().required("Este campo es requerido."),
    //SECCION 1 - Total Monto Afianzado
    suretyAmount:Yup.number().required("Este campo es requerido."),
    securedPercentage:Yup.number().required("Este campo es requerido.").min(0.02, "Debe ser al menos 0.02.").max(100, "No puede ser mayor al 100."),
        //totalSuretyAmount:Yup.number().required("Este campo es requerido."),
    //SECCION 2 - Total Dias de Vigencia
        //vigencyStartDate: Yup.string().required("Este campo es requerido."),
        //complianceDate:Yup.string().required("Este campo es requerido."),
        //vigencyEndDate: Yup.string().required("Este campo es requerido."),
        //vigencyTotalDays:Yup.string().required("Este campo es requerido."),
    //SECCION 3 - Prima Total
    annualRate:Yup.number().required("Este campo es requerido.").required("Este campo es requerido.").min(0.02, "Debe ser al menos 0.02.").max(100, "No puede ser mayor al 100."),
        //bonus: Yup.number().required("Este campo es requerido."),
        //CNSF: Yup.number().required("Este campo es requerido."),
    expeditionCost: Yup.number().required("Este campo es requerido."),
    creditBureauFees: Yup.number().required("Este campo es requerido."),
        //subtotal: Yup.number().required("Este campo es requerido."),
    rateIvaS3:Yup.number().required("Este campo es requerido."),
        //totalIvaS3:Yup.number().required("Este campo es requerido."),
        //totalBonus: Yup.number().required("Este campo es requerido."),
  });
  const onSubmit = (data:any)=>{
    if(values.contractAmount <= 0){
      setFieldError('contractAmount','El monto del contrato debe ser mayor que cero.');
      setDataAlert(
        true,
        "Favor de validar el monto del contrato.",
        "error",
        autoHideDuration
      );
    }else{
      sendRequest();
    }
  };
  const sendRequest = () => {
    if (
      values.totalContractAmount > 0 &&
      values.totalSuretyAmount > 0 &&
      values.vigencyTotalDays > 0 &&
      values.totalBonus > 0
    ) {
      setSendQuote(true);
      setQouteData({
        vigencyStartDate: values.vigencyStartDate,
        vigencyEndDate:   values.vigencyEndDate,
        vigencyTotalDays: Number(values.vigencyTotalDays),
        totalSuretyAmount: Number(values.totalSuretyAmount),
        bonus: Number(values.bonus),
        CNSF: Number(values.CNSF),
        expeditionCost: Number(values.expeditionCost),
        creditBureauFees: Number(values.creditBureauFees),
        subtotal: Number(values.subtotal),
        rateIva: Number(values.rateIva),
        totalIva: Number(values.totalIva),
        totalBonus: Number(values.totalBonus),
      });
    } else {
      setDataAlert(
        true,
        "Favor de completar los campos.",
        "error",
        autoHideDuration
      );
    }
  };
  const { handleSubmit, handleChange, errors, values, setFieldValue, setFieldError, validateForm, submitForm } =
    useFormik({
      initialValues,
      validationSchema: YUPValidation,
      onSubmit,
      //enableReinitialize: true,
  });
  const calculateStaticFields = () => {
    //Constantes
    const c_rateIva:number = Number(values.rateIva??0);
    const c_contractAmount:number = Number(values.contractAmount??0);
    const c_securedPercentage:number = Number(values.securedPercentage??0);
    const c_annualRate:number = Number(values.annualRate??0);
    const c_expeditionCost:number = Number(values.expeditionCost??0);
    const c_creditBureauFees:number = Number(values.creditBureauFees??0);
    const c_rateIvaS3:number = Number(values.rateIvaS3??0);
    const c_vigencyTotalDays:number = Number(values.vigencyTotalDays??0);
    /*
    Listado de los fields que son estaticos
    Seccion 0
      totalIva
      totalContractAmount
    Seccion 1
      totalSuretyAmount
    Seccion 3
      bonus
      CNSF
      subtotal
      totalIvaS3
      totalBonus
    setFieldValue('',);
    */
   //Seccion 0
   const v_totalIva = (Number(c_rateIva / 100) * c_contractAmount);
   setFieldValue('totalIva',v_totalIva);
   const v_totalContractAmount: number = (c_contractAmount + v_totalIva);
   setFieldValue('totalContractAmount',v_totalContractAmount);
   //Seccion 1
   const v_totalSuretyAmount:number = Number(c_securedPercentage/ 100) * c_contractAmount;
   setFieldValue('totalSuretyAmount',v_totalSuretyAmount);
   //Seccion 3
   const v_bonus:number = ((v_totalSuretyAmount*Number(c_annualRate/100))/365)*c_vigencyTotalDays;//(Number(c_annualRate/ 100) * v_totalSuretyAmount);
   setFieldValue('bonus',v_bonus);
   const v_CNSF:number = (3.5 / 100) * v_bonus;
   setFieldValue('CNSF',v_CNSF);
   const v_subtotal:number = v_bonus + v_CNSF + c_expeditionCost + c_creditBureauFees;
   setFieldValue('subtotal',v_subtotal);
   const v_totalIvaS3:number = ((c_rateIvaS3 / 100) * v_subtotal);
   setFieldValue('totalIvaS3',v_totalIvaS3);
   const v_totalBonus:number = (v_subtotal + v_totalIvaS3 );
   setFieldValue('totalBonus',v_totalBonus);
   setCalculate(false);
   
  };
  //Effect para autoCalcular
  const [calculate, setCalculate] = React.useState(false);
  React.useEffect(()=>{
    if(calculate===true){
      calculateStaticFields();
    }
  },[calculate]);
  //-----------------Handle SECCION 2
  //Fecha Inicio de Vigencia
  const handleVigencyStartDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const selectedDate = dayjs(e.target.value);
    if(selectedDate<values.vigencyEndDate){
      //const selectedDatePlusYear = selectedDate.add( 365, "day" );
      const daysBetween = Number(values.vigencyEndDate.diff( selectedDate, "day"  ));
      setFieldValue('vigencyStartDate',selectedDate);
      //setFieldValue('vigencyEndDate',selectedDatePlusYear);
      setFieldValue('vigencyTotalDays',daysBetween);
      if(calculate===false){
        setCalculate(true);
      }
    }else{
      setDataAlert(
        true,
        "La fecha de Inicio de Vigencia no puede ser superior a la Fecha Fin de Vigencia.",
        "error",
        autoHideDuration
      );
    }
    
  };
  //Fecha Fin de Vigencia
  const handleVigencyEndDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (dayjs(e.target.value) < values.vigencyStartDate) {
      setDataAlert(
        true,
        "La fecha de Fin de Vigencia no puede ser anterior a la Fecha Inicio de Vigencia.",
        "error",
        autoHideDuration
      );
    } else {
      const selectedDate = dayjs(e.target.value);
      const daysBetween = Number(selectedDate.diff( values.vigencyStartDate, "day" ));
      setFieldValue('vigencyEndDate',selectedDate);
      setFieldValue('vigencyTotalDays',daysBetween);
      if(calculate===false){
        setCalculate(true);
      }
    }
  };

  
  //Este effecto y hook determinan el ancho de pantalla
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      //console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Limpia el listener del evento al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // El array vacío significa que este efecto se ejecuta solo al montar y desmontar el componente

  const getStyles = (
    sm: string,
    md: string,
    lg: string,
    defaultSize: string
  ) => {
    // Evaluar las condiciones en orden y devolver el primer valor verdadero
    if (windowWidth < 600) {
      return { marginTop: sm };
    }
    if (windowWidth >= 600 && windowWidth < 640) {
      return { marginTop: md }; // '50%' };
    }
    if (windowWidth >= 640 && windowWidth < 897) {
      return { marginTop: lg }; //'40%' };
    }

    return { marginTop: defaultSize }; //'44%' };
  };
  const dummyKey = windowWidth.toString();
  ////GRID auto
  const getStylesGrid = () => {
    // Evaluar las condiciones en orden y devolver el primer valor verdadero
    if (windowWidth < 860) {
      //console.log("Pantalla Chica");
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(1, 1fr)",
      };
    } else if (windowWidth >= 860 && windowWidth < 1040) {
      //console.log("Pantalla Mediana");
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(2, 1fr)",
      };
    } else {
      //console.log("Pantalla Normal");
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(3, 1fr)",
      };
    }
  };
  const dummyKeyGrid = windowWidth.toString();



  //Manejo de Modal para enviar cotizacion
  const [sendQuote, setSendQuote] = React.useState(false);

  ///Manejo de Alertas
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  return (
    <>
      {sendQuote ? (
        <SendQuotePeopleModal
          open={sendQuote}
          close={() => {
            setSendQuote(false);
          }}
          QuoteData={qouteData}
        />
      ) : (
        <></>
      )}
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Box key={dummyKeyGrid} sx={{}} component="form" maxWidth="auto" onSubmit={handleSubmit}>
        {" "}
        {/*component='form' onSubmit={handleSubmit}>*/}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <article style={getStylesGrid()}>
            {/*////////////////////////////SECCION 0 - Monto Contrato////////////////////////////////*/}
            <Paper
              square={false}
              elevation={5}
              sx={{
                p: 1,
                borderRadius: 4,
                minHeight: "467px",
                maxWidth: "347.67px",
                position: "relative",
              }}
            >
              <Stack direction="column" spacing={3}>
                {/*///////////////////////////// Monto del Contrato ///////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Monto del Contrato
                    </Typography>
                    <TextField
                      fullWidth
                      name="contractAmount"
                      value={values.contractAmount}
                      onChange={(e)=>{
                        handleChange(e);
                        if(calculate===false){
                          setCalculate(true);
                        }
                      }}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        inputProps:{
                          maxLength: 15,
                        }
                      }}
                      helperText={errors.contractAmount}
                      error={!!errors.contractAmount}
                    ></TextField>
                  </Grid>
                </Grid>
                {/*/////////////////////////// IVA S0/////////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>IVA</Typography>
                  </Grid>
                  <Grid item xs={12} sm={5} md={4} alignSelf="center">
                    <Select
                      sx={{ width: "100%" }}
                      name="rateIva"
                      value={values.rateIva}
                      onChange={(e)=>{
                        handleChange(e);
                        if(calculate===false){
                          setCalculate(true);
                        }
                      }}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      <MenuItem key={1} value={16}>
                        16 %
                      </MenuItem>
                      <MenuItem key={2} value={11}>
                        11 %
                      </MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={6} md={7} alignSelf="center">
                    <TextField
                      fullWidth
                      name="totalIva"
                      value={values.totalIva}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    ></TextField>
                  </Grid>
                </Grid>
                {/*///////////////////////// Monto Total Contrato ///////////////////////////////////*/}
                <Grid
                  container
                  rowSpacing={1}
                  alignItems={"bottom"}
                  key={dummyKey}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    alignSelf="center"
                    bgcolor={"#8e8f8f"}
                    sx={{
                      borderRadius: 4,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 5,
                      right: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        fontSize: "24px",
                        paddingTop: "7px",
                      }}
                    >
                      $
                      {Intl.NumberFormat("en-US").format(
                        values.totalContractAmount
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Monto Total Contrato
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
            {/*////////////////////////////SECCION 1 - Monto de Fianza////////////////////////////////*/}
            <Paper
              square={false}
              elevation={5}
              sx={{
                p: 1,
                borderRadius: 4,
                minHeight: "467px",
                maxWidth: "347.67px",
                position: "relative",
              }}
            >
              <Stack direction="column" spacing={3}>
                {/*/////////////////////////////// Monto de fianza /////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Monto de fianza
                    </Typography>
                    <TextField
                      fullWidth
                      name="suretyAmount"
                      value={values.suretyAmount}
                      onChange={(e)=>{
                        handleChange(e);
                        if(calculate===false){
                          setCalculate(true);
                        }
                      }}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        inputProps:{
                          maxLength: 15,
                        }
                      }}
                      helperText={errors.suretyAmount}
                      error={!!errors.suretyAmount}
                    ></TextField>
                  </Grid>
                </Grid>

                {/*////////////////////////////// Porcentaje afianzado //////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Porcentaje afianzado
                    </Typography>
                    <TextField
                      fullWidth
                      name="securedPercentage"
                      value={values.securedPercentage}
                      onChange={(e)=>{
                        handleChange(e);
                        if(calculate===false){
                          setCalculate(true);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps:{
                          maxLength: 4,
                        }
                      }}
                      helperText={errors.securedPercentage}
                      error={!!errors.securedPercentage}
                    ></TextField>
                  </Grid>
                </Grid>

                {/*/////////////////////////// Total Monto Afianzado /////////////////////////////////*/}
                <Grid
                  container
                  rowSpacing={1}
                  alignItems={"bottom"}
                  key={dummyKey}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    alignSelf="center"
                    bgcolor={"#8e8f8f"}
                    sx={{
                      borderRadius: 4,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 5,
                      right: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        fontSize: "24px",
                        paddingTop: "7px",
                      }}
                    >
                      $
                      {Intl.NumberFormat("en-US").format(values.totalSuretyAmount)}
                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Total Monto Afianzado
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
            {/*////////////////////////////SECCION 2 - Fechas////////////////////////////////*/}
            <Paper
              square={false}
              elevation={5}
              sx={{
                p: 1,
                borderRadius: 4,
                minHeight: "467px",
                maxWidth: "347.67px",
                position: "relative",
              }}
            >
              <Stack direction="column" spacing={3}>
                {/*///////////////////////////// Fecha Inicio de Vigencia ///////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Fecha Inicio de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      name="vigencyStartDate"
                      value={values.vigencyStartDate.format("YYYY-MM-DD")}
                      onChange={handleVigencyStartDate}
                    />
                  </Grid>
                </Grid>

                {/*//////////////////////////// Fecha Cumplimiento ////////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Fecha Cumplimiento
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      name="complianceDate"
                      value={values.complianceDate.format("YYYY-MM-DD")}
                      onChange={(e) => {
                        setFieldValue('complianceDate',dayjs(e.target.value));
                      }}
                    />
                  </Grid>
                </Grid>

                {/*///////////////////////////// Fecha Fin de Vigencia ///////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Fecha Fin de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      name="vigencyEndDate"
                      value={values.vigencyEndDate.format("YYYY-MM-DD")}
                      onChange={handleVigencyEndDate}
                    />
                  </Grid>
                </Grid>

                {/*///////////////////////////// Total Dias de Vigencia ///////////////////////////////*/}
                <Grid
                  container
                  rowSpacing={1}
                  alignItems={"bottom"}
                  key={dummyKey}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    alignSelf="center"
                    bgcolor={"#8e8f8f"}
                    sx={{
                      borderRadius: 4,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 5,
                      right: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        fontSize: "24px",
                        paddingTop: "7px",
                      }}
                    >
                      {values.vigencyTotalDays}
                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Total Dias de Vigencia
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </article>
        </div>
        <div style={{ position: "relative", marginTop: "20px" }}>
          {/*////////////////////////////SECCION 3 - Tarifa Anual////////////////////////////////*/}
          <Paper
            square={false}
            elevation={5}
            sx={{
              p: 1,
              borderRadius: 4,
              minHeight: "467px",
              gridColumn: "1/4",
              margin: "0 auto", // Centrar horizontalmente
              maxWidth: "1150px",
              width: "100%",
            }}
          >
            <Stack direction="column" spacing={3}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                {/*////////////////////////////// Tarifa Anual //////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Tarifa Anual{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="annualRate"
                    value={values.annualRate}
                    InputProps={{
                      //inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                      inputProps:{
                        maxLength: 4,
                        step: 0.01,
                      },
                      // sx:{//Con esto le quitas las flechas a los input de tipo number
                      //   '& input[type=number]': {
                      //     '-moz-appearance': 'textfield'
                      //   },
                      //   '& input[type=number]::-webkit-outer-spin-button': {
                      //       '-webkit-appearance': 'none',
                      //       margin: 0
                      //   },
                      //   '& input[type=number]::-webkit-inner-spin-button': {
                      //       '-webkit-appearance': 'none',
                      //       margin: 0
                      //   }
                      // }
                    }}
                    onChange={(e)=>{
                      handleChange(e);
                      if(calculate===false){
                        setCalculate(true);
                      }
                    }}
                    helperText={errors.annualRate}
                    error={!!errors.annualRate}
                  ></TextField>
                </Grid>
                {/*///////////////////////////// Prima  ///////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}> Prima </Typography>
                  <TextField
                    fullWidth
                    name="bonus"
                    value={values.bonus}
                    //onChange={handleBonus}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>
                {/*///////////////////////////// Derechos CNSF 3.5% ///////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Derechos CNSF 3.5%{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="CNSF"
                    value={values.CNSF}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                {/*//////////////////////////// Gastos de Expedición ////////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Gastos de Expedición{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="expeditionCost"
                    value={values.expeditionCost}
                    onChange={(e)=>{
                      handleChange(e);
                      if(calculate===false){
                        setCalculate(true);
                      }
                    }}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      inputProps:{
                        maxLength: 15,
                      }
                    }}
                    helperText={errors.expeditionCost}
                    error={!!errors.expeditionCost}
                  ></TextField>
                </Grid>
                {/*///////////////////////////Gastos Buro de Crédito/////////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Gastos Buro de Crédito{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="creditBureauFees"
                    value={values.creditBureauFees}
                    onChange={(e)=>{
                      handleChange(e);
                      if(calculate===false){
                        setCalculate(true);
                      }
                    }}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      inputProps:{
                        maxLength: 15,
                      }
                    }}
                    helperText={errors.creditBureauFees}
                    error={!!errors.creditBureauFees}
                  ></TextField>
                </Grid>
                {/*///////////////////////////Subtotal/////////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}> Subtotal </Typography>
                  <TextField
                    fullWidth
                    name="subtotal"
                    value={values.subtotal}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>
              </Grid>

              {/*////////////////////////////IVA S3////////////////////////////////*/}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={11} sm={11} md={11} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>IVA</Typography>
                </Grid>
                <Grid item xs={11} sm={5} md={1.8} alignSelf="center">
                  <Select
                    sx={{ width: "100%" }}
                    name="rateIvaS3"
                    defaultValue={16}
                    onChange={(e)=>{
                      handleChange(e);
                      if(calculate===false){
                        setCalculate(true);
                      }
                    }}
                  >
                    <MenuItem key={0} value={0} disabled>
                      Selecciona
                    </MenuItem>
                    <MenuItem key={1} value={16}>
                      16 %
                    </MenuItem>
                    <MenuItem key={2} value={11}>
                      11 %
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={11} sm={6} md={3.9} alignSelf="center">
                  <TextField
                    fullWidth
                    name="totalIvaS3"
                    value={values.totalIvaS3}
                    //onChange={handleTotalIvaS3}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>
              </Grid>

              {/*///////////////////////////// Prima Total ///////////////////////////////*/}

              <Grid
                container
                rowSpacing={1}
                alignItems={"bottom"}
                key={dummyKey}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  alignSelf="center"
                  bgcolor={"#8e8f8f"}
                  sx={{
                    borderRadius: 4,
                    textAlign: "center",
                    alignContent: "center",
                  }}
                  style={getStyles("25%", "50%", "40%", "5%")}
                >
                  <Typography
                    sx={{
                      ...SideBarItemFont,
                      color: "#f1f1f1",
                      fontSize: "24px",
                      paddingTop: "7px",
                    }}
                  >
                    ${Intl.NumberFormat("en-US").format(values.totalBonus)}
                  </Typography>
                  <Typography
                    sx={{
                      ...SideBarItemFont,
                      color: "#f1f1f1",
                      paddingBottom: "7px",
                    }}
                  >
                    Prima Total
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </div>
        {/*///////////////////////////// SECCION 4 - Enviar Cotizacion ///////////////////////////////*/}
        <div
          style={{
            display: "flex",
            marginTop: "25px",
            margin: "0 auto", // Centrar horizontalmente
            maxWidth: "1150px",
            width: "100%",
          }}
        >
          <Stack direction="column" spacing={3} style={{ marginLeft: "auto" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} sm={12} md={12} alignSelf="center">
                <Button
                  disabled={false}
                  endIcon={<ArrowRight color={ColorPureWhite} />}
                  type="submit"
                  style={{ marginLeft: "auto" }}
                >
                  Enviar Cotización
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </div>
      </Box>
    </>
  );
}

export default QuoteNoBonus;