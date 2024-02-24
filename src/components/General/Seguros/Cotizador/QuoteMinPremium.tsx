import React, { useState } from "react";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
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

import dayjs from "dayjs";
import { Alert, Snackbar } from "../../../OuiComponents/Feedback";
import { ArrowRight } from "../../../OuiComponents/Icons";
import PeopleDataService from "../../../../services/people.service";
import { Paper } from "../../../OuiComponents/Surfaces";
import SendQuoteMinPremiumPeopleModal from "./SendQuoteMinPremiumPeopleModal";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";


function QuoteMinPremium() {
  const [vigencyEndDateHook, setVigencyEndDateHook] = React.useState(
    dayjs(new Date()).startOf("day")
  );
  const [vigencyStartDateHook, setVigencyStartDateHook] = React.useState(
    dayjs(new Date()).startOf("day")
  );

  React.useEffect(() => {
    const difference = vigencyEndDateHook.diff(vigencyStartDateHook, "day");

    // Verificar si la diferencia es negativa
    if (difference < 0) {
      setIsNegativeDifference(true);
    } else {
      setIsNegativeDifference(false);
    }
  }, [vigencyStartDateHook, vigencyEndDateHook]);

  const [isNegativeDifference, setIsNegativeDifference] = React.useState(false);
  const [suretyAmountHook, setSuretyAmountHook] = React.useState(0);
  const [expeditionCostHook, setExpeditionCostHook] = React.useState(0);
  const [creditBureauFeesHook, setCreditBureauFeesHook] = React.useState(0);
  const [ivaRate, setIvaRate] = useState(16);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const [qouteData, setQouteData] = React.useState<any>({});
  const [sendQuote, setSendQuote] = React.useState(false);

  const handleIvaRateChange = (event: any) => {
    setIvaRate(event.target.value);
  };

  // console.log(qouteData);
  let month365days = 12 / 365;
  let prima = (suretyAmountHook / 12) * ((vigencyEndDateHook.diff(vigencyStartDateHook, "day")) * month365days);
  let subtotal = prima + (prima * 0.035) + expeditionCostHook + creditBureauFeesHook;

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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

  const getStylesGrid = () => {
    // Evaluar las condiciones en orden y devolver el primer valor verdadero
    if (windowWidth < 860) {
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(1, 1fr)",
      };
    } else if (windowWidth >= 860 && windowWidth < 1040) {
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(2, 1fr)",
      };
    } else {
      return {
        display: "grid",
        gridGap: "20px 50px",
        gridTemplateColumns: "repeat(3, 1fr)",
      };
    }
  };
  const dummyKeyGrid = windowWidth.toString();

  const hideTimeout = 2900;
  const [messageAlertEr, setMessageAlert] = React.useState("");
  const handleErrorClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsErrorOpen(false);
  };
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);

  const differenceInYears = vigencyEndDateHook.diff(vigencyStartDateHook, "day") / 365;

  const formattedDifference =
    Number.isInteger(differenceInYears)
      ? differenceInYears.toFixed(0) // Sin decimales si es un número entero
      : differenceInYears.toFixed(2); // Con dos decimales si tiene decimales

  // const gottenQoute = props.QuoteData;
  //Listado de usuarios
  const [users, setUser] = React.useState<any[]>([]);
  const [change, setChange] = React.useState(true);
  React.useEffect(() => {
    if (change) {
      handlePeopleData();
    }
  }, [change]);
  // Fetch PeopleDataService data
  const handlePeopleData = async () => {
    const peopleDataResponse = await PeopleDataService.getAll();
    const peopleData = peopleDataResponse.data;
    if (peopleData == null) {
      return;
    }

    const updatedRows = peopleData.map((row: { [key: string]: any }) => {
      //const {folio, name, lastName, maternalLastName} = row;
      //return {folio, name, lastName, maternalLastName};
      const fullName = `${row.name} ${row.lastName} ${row.maternalLastName}`;
      return { folio: row.folio, fullName };
    });
    setUser(updatedRows);
    setChange(false);
  };

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
        <SendQuoteMinPremiumPeopleModal
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
      <Stack spacing={2}>
        <Stack spacing={40}>
          <Snackbar
            open={isErrorOpen}
            autoHideDuration={hideTimeout}
            onClose={handleErrorClose}
          >
            <div>
              <Alert severity="error" sx={{ width: "50%" }}>
                {messageAlertEr}
              </Alert>
            </div>
          </Snackbar>
        </Stack>
      </Stack>
      <Box key={dummyKeyGrid} sx={{}}>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <article style={{ width: "100%", maxWidth: "1142px", ...getStylesGrid() }}>
            {/*////////////////////////////SECCION 0 - Fechas////////////////////////////////*/}
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
                      value={vigencyStartDateHook.format("YYYY-MM-DD")}
                      onChange={(e) => {
                        const newStartDate = dayjs(e.target.value);
                        const newDifference = vigencyEndDateHook.diff(newStartDate, "day");

                        // Verificar si la nueva fecha resulta en una diferencia negativa
                        if (newDifference < 0) {
                          // Mostrar Snackbar
                          setIsErrorOpen(true);
                          setMessageAlert("La fecha de inicio no puede ser después de la fecha de fin.");

                          // Revertir la fecha al estado anterior
                          setVigencyStartDateHook(vigencyStartDateHook);
                        } else {
                          // Actualizar la fecha
                          setVigencyStartDateHook(newStartDate);
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/*//////////////////////////// Fecha fin de vigencia ////////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Fecha Fin de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      name="vigencyEndDate"
                      value={vigencyEndDateHook.format("YYYY-MM-DD")}
                      onChange={(e) => {
                        const newEndDate = dayjs(e.target.value);
                        const newDifference = newEndDate.diff(vigencyStartDateHook, "day");

                        // Verificar si la nueva fecha resulta en una diferencia negativa
                        if (newDifference < 0) {
                          // Mostrar Snackbar
                          setIsErrorOpen(true);
                          setMessageAlert("La fecha de inicio no puede ser después de la fecha de fin.");

                          // Revertir la fecha al estado anterior
                          setVigencyEndDateHook(vigencyEndDateHook);
                        } else {
                          // Actualizar la fecha
                          setVigencyEndDateHook(newEndDate);
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/*///////////////////////////// total dias de vigencia ///////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Total Días de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="totalVigencyDays"
                      value={vigencyEndDateHook.diff(vigencyStartDateHook, "day")}
                      disabled
                      InputProps={{
                        readOnly: vigencyEndDateHook.diff(vigencyStartDateHook, "day") < 0,
                      }}
                    />
                  </Grid>
                </Grid>

                {/*///////////////////////////// años ///////////////////////////////*/}
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
                      {formattedDifference}

                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Años
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>



            {/*////////////////////////////SECCION 1  ////////////////////////////////*/}
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
                {/*///////////////////////////// Total dias de vigencia ///////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Total Días de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="vigencyEndDate"
                      disabled
                      value={vigencyEndDateHook.diff(vigencyStartDateHook, "day")}

                    />
                  </Grid>
                </Grid>
                {/*/////////////////////////// Meses / 365 dias del año/////////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Meses / 365 Días del Año
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="vigencyEndDate"
                      disabled
                      value={month365days.toFixed(5)}

                    />
                  </Grid>
                </Grid>
                {/*///////////////////////// Meses de vigencia exactos ///////////////////////////////////*/}
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

                      {((vigencyEndDateHook.diff(vigencyStartDateHook, "day")) * month365days).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Meses de Vigencia Exactos
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
            {/*////////////////////////////SECCION 2 - Prima minima anual, años vigencia... ////////////////////////////////*/}
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
                {/*/////////////////////////////// Prima minima anual /////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Prima Mínima Anual
                    </Typography>
                    <TextField
                      fullWidth
                      name="suretyAmount"
                      value={suretyAmountHook}
                      onChange={(e) => {
                        setSuretyAmountHook(Number(e.target.value));
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid>
                </Grid>

                {/*////////////////////////////// Años de vigencia //////////////////////////////*/}


                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} md={11} lg={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Años de Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="vigencyEndDate"
                      value={formattedDifference}
                      disabled

                    />
                  </Grid>
                </Grid>

                {/*////////////////////////////// Prima minima Total por toda la vigencia //////////////////////////////*/}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={11} sm={11} md={11} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      Prima Mínima Total por toda la Vigencia
                    </Typography>
                    <TextField
                      fullWidth
                      name="suretyAmount"
                      value={suretyAmountHook * Number(differenceInYears)}
                      disabled

                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid>
                </Grid>

                {/*/////////////////////////// prima minima mensual /////////////////////////////////*/}
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
                      {(suretyAmountHook / 12).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        ...SideBarItemFont,
                        color: "#f1f1f1",
                        paddingBottom: "7px",
                      }}
                    >
                      Prima Mínima Mensual
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

          </article>
        </div>
        <div style={{ position: "relative", marginTop: "20px" }}>
          {/*////////////////////////////SECCION 3  ////////////////////////////////*/}
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
                {/*////////////////////////////// meses de vigencia //////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Meses de Vigencia{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="annualRate"
                    type="number"
                    value={((vigencyEndDateHook.diff(vigencyStartDateHook, "day")) * month365days).toFixed(2)}
                    disabled
                  ></TextField>
                </Grid>
                {/*///////////////////////////// Prima minima mensual  ///////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}> Prima Mínima Mensual </Typography>
                  <TextField
                    fullWidth
                    name="bonus"
                    value={(suretyAmountHook / 12).toFixed(2)}
                    disabled

                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>
                {/*///////////////////////////// prima   ///////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}> Prima</Typography>
                  <TextField
                    fullWidth
                    name="bonus"
                    value={prima}
                    disabled
                    InputProps={{
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
                    value={prima * 0.035}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  ></TextField>
                </Grid>


                {/*//////////////////////////// Gastos de Expedición ////////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}>
                    {" "}
                    Gastos de Expedición{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    name="expeditionCost"
                    value={expeditionCostHook}
                    onChange={(e) => setExpeditionCostHook(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
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
                    value={creditBureauFeesHook}
                    onChange={(e) => {
                      setCreditBureauFeesHook(Number(e.target.value));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid>
                {/*///////////////////////////Subtotal/////////////////////////////////*/}
                <Grid item xs={11} sm={5} md={3.8} alignSelf="center">
                  <Typography sx={{ ...TextSmallFont }}> Subtotal </Typography>
                  <TextField
                    fullWidth
                    name="subtotal"
                    value={subtotal}
                    disabled
                    InputProps={{
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
                    value={ivaRate}
                    onChange={handleIvaRateChange}
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
                    value={subtotal * Number(('0.' + ivaRate))}
                    disabled

                    InputProps={{
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
                    ${(subtotal + (subtotal * Number('0.' + ivaRate))).toFixed(2)}

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
        <div
          style={{
            display: "flex",
            margin: "0 auto", // Centrar horizontalmente
            marginTop: "20px",
            maxWidth: "1150px",
            width: "100%",
          }}
        >
          <Button
            disabled={false}
            endIcon={<ArrowRight color={ColorPureWhite} />}
            onClick={() => {
              if (
                (vigencyEndDateHook.diff(vigencyStartDateHook, "day")) !== 0 &&
                suretyAmountHook
              ) {
                setSendQuote(true);
                setQouteData({
                  vigencyStartDate: vigencyStartDateHook,
                  vigencyEndDate: vigencyEndDateHook,
                  vigencyTotalDays: vigencyEndDateHook.diff(vigencyStartDateHook, "day"),
                  years: Number(formattedDifference),
                  months: Number(((vigencyEndDateHook.diff(vigencyStartDateHook, "day")) * month365days).toFixed(2)),
                  minAnnualBonus: suretyAmountHook,
                  minTotalBonus: suretyAmountHook * Number(differenceInYears),
                  minMonthlyBonus: Number((suretyAmountHook / 12).toFixed(2)),
                  bonus: prima,
                  cnsf: prima * 0.035,
                  expeditionCost: expeditionCostHook,
                  creditBureauFees: creditBureauFeesHook,
                  subTotal: subtotal,
                  rateIva: ivaRate,
                  totalIva: subtotal * Number(('0.' + ivaRate)),
                  totalBonus: Number((subtotal + (subtotal * Number('0.' + ivaRate))).toFixed(2))
                });
              } else {
                setDataAlert(
                  true,
                  "Favor de completar los campos.",
                  "error",
                  autoHideDuration
                );
              }
            }
            }
            style={{ marginLeft: "auto" }}
          >
            Enviar Cotización
          </Button>
        </div>
      </Box>

      <Snackbar
        open={isNegativeDifference}
        autoHideDuration={hideTimeout}
        onClose={() => setIsNegativeDifference(false)}
      >
        <div>
          <Alert severity="error" sx={{ width: "50%" }}>
            La fecha de inicio no puede ser después de la fecha de fin.
          </Alert>
        </div>
      </Snackbar>


    </>
  );
}

export default QuoteMinPremium;