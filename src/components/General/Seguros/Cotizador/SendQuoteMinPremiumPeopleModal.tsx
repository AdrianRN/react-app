import React, { useEffect } from "react";
import { Dialog } from "../../../OuiComponents/Feedback";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models";
import {
  ColorPureWhite,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { IconButton } from "@mui/material";
import { Button, Checkbox } from "../../../OuiComponents/Inputs";
import Autocomplete from "@mui/material/Autocomplete";
import {
  ArrowRight,
  Cancel,
  Complete,
  Refresh,
} from "../../../OuiComponents/Icons";
import PeopleDataService from "../../../../services/people.service";
import CompaniesContactService from "../../../../services/companiescontact.service";
import { TextField } from "../../../OuiComponents/Inputs";
import BondQuotationService from "../../../../services/bondQuotation.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";

interface SendQuoteProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface RowData {
  fullName: string;
  folio: string;
  // Otras propiedades necesarias
}
function SendQuotePeopleModal(props: any) {
  const [value, setValue] = React.useState<RowData | null>(null);

  //Cotizacion Recibida
  const gottenQoute = props.QuoteData;

  //Listado de usuarios
  const [users, setUser] = React.useState<RowData[]>([]);
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
      const fullName = `${row.name} ${row.lastName} ${row.maternalLastName}`;
      return { folio: row.folio, fullName };
    });
    setUser(updatedRows);
    setChange(false);
  };

  const autocompleteHandle = async (event: React.SyntheticEvent<Element, Event>,newValue: RowData | null) => {
    if (newValue !== null && typeof newValue === "string") {
      const selectedRow = users.find(
        (users) => users.folio === newValue
      );
      setValue(selectedRow || null);
    } else {
      setValue(newValue);
    }

  }
  return (
    <>
      <Dialog
        open={true}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        sx={{ p: 10, borderRadius: 4  }}
      >
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Cancel />
        </IconButton>
        <Stack
          direction="column"
          spacing={3}
          sx={{ margin: 4, minHeight: "467px" }}
        >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={11} sm={11} md={11} alignSelf="center">
              <Typography sx={{ ...TextSmallFont }}>
                Selecciona una persona
              </Typography>
            </Grid>
            <Grid item xs={11} sm={11} md={11} alignSelf="center">
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.fullName}
                value={value}
                onChange={async (event, newValue) => autocompleteHandle(event, newValue)}
                renderOption={(props, option) => (
                  <li {...props} key={option.folio}>
                    {option.fullName}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="" placeholder="Buscar..." />
                )}
              />
            </Grid>

            <Grid item xs={11} sm={11} md={11} alignSelf="center">
              <DataGridContact
                close={props.close}
                Folio={value?.folio}
                GottenQuote={gottenQoute}
              />
            </Grid>
          </Grid>
        </Stack>
      </Dialog>
    </>
  );
}

export default SendQuotePeopleModal;

interface addRowData {
  id: string;
  name: string;
  email: string;
}
function generateRandomId() {
  return Math.random().toString(36).substr(2, 9); // Genera un string alfanumérico de 9 caracteres
}

type QuoteMinPremDataBase = {
  vigencyStartDate: string;
  vigencyEndDate: string;
  vigencyTotalDays: number;
  years: number;
  months: number;
  minAnnualBonus: number;
  minTotalBonus: number;
  minMonthlyBonus: number;
  bonus: number;
  cnsf: number;
  expeditionCost: number;
  creditBureauFees: number;
  subTotal: number;
  rateIva: number;
  totalIva: number;
  totalBonus: number;
  emails: EmailQuote[];
};
type EmailQuote = {
  email: string;
};
function DataGridContact(props: any) {
  //Manejo de correo
  const [emails, setEmails] = React.useState<EmailQuote[]>([]);
  //Para desactivar boton Disable = true y para habilitar Disable = false
  const [enableSend, setEnableSend] = React.useState(!(emails.length > 0));
  const addEmail = (newEmail: EmailQuote) => {
    setEmails((prevEmails) => [...prevEmails, newEmail]);
  };

  const removeEmail = (emailToRemove: EmailQuote) => {
    setEmails((prevEmails) =>
      prevEmails.filter((email) => email.email !== emailToRemove.email)
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.name}</Typography>;
      },
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.email}</Typography>;
      },
    },
    {
      field: "Acciones",
      headerName: "Enviar a...",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Seleccionar
              </Typography>
            }
          >
            <IconButton>
              <Checkbox
                value={params.row.email}
                onChange={(e) => {
                  if (e.target.checked) {
                    addEmail({ email: e.target.value });
                    setEnableSend(false);
                  } else {
                    removeEmail({ email: e.target.value });
                    emails.length - 1 > 0
                      ? setEnableSend(false)
                      : setEnableSend(true);
                  }
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const [rows, setRows] = React.useState<addRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    CompaniesContactService.getByFolioCompany(props.Folio)
      .then((response) => {
        // Filtrar y seleccionar solo las columnas necesarias del JSON
        const filteredData = response.data.map((row: any) => {
          const { folio, name, email } = row;
          return { id: folio, name, email };
        });

        setEmails([]);
        setEnableSend(true);
        setRows(filteredData); // Actualiza el estado con los datos filtrados
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    setDisableAddButton(true);
    cleanTextFields();
  }, [props.Folio]);
  const [messageHelperTextName, setMessageHelperTextName] =
    React.useState("  ");
  const [messageHelperTextEmail, setMessageHelperTextEmail] =
    React.useState("  ");
  const [disableAddButton, setDisableAddButton] = React.useState(true);
  const [namePerson, setNamePerson] = React.useState("");
  const [emailPerson, setEmailPerson] = React.useState("");
  const cleanTextFields = () => {
    setNamePerson("");
    setEmailPerson("");
  };
  const addRow = (newRow: addRowData) => {
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const sendEmail = () => {
    const QuoteData: QuoteMinPremDataBase = {
      vigencyStartDate: JSON.stringify(
        props.GottenQuote.vigencyStartDate
      ).replace(/^"(.+(?="$))"$/, "$1"),
      vigencyEndDate: JSON.stringify(props.GottenQuote.vigencyEndDate).replace(
        /^"(.+(?="$))"$/,
        "$1"
      ),
      vigencyTotalDays: props.GottenQuote.vigencyTotalDays,
      years: props.GottenQuote.years,
      months: props.GottenQuote.months,
      minAnnualBonus: props.GottenQuote.minAnnualBonus,
      minTotalBonus: props.GottenQuote.minTotalBonus,
      minMonthlyBonus: props.GottenQuote.minMonthlyBonus,
      bonus: props.GottenQuote.bonus,
      cnsf: props.GottenQuote.cnsf,
      expeditionCost: props.GottenQuote.expeditionCost,
      creditBureauFees: props.GottenQuote.creditBureauFees,
      subTotal: props.GottenQuote.subTotal,
      rateIva: props.GottenQuote.rateIva,
      totalIva: props.GottenQuote.totalIva,
      totalBonus: props.GottenQuote.totalBonus,
      emails: emails,
    };
    BondQuotationService.postBondQuotationMinPremSendEmail(QuoteData);
  };

  ///Manejo de errores
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  const namePersonHandle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNamePerson(e.target.value);
    if (emailPerson && e.target.value) setDisableAddButton(false);
    else setDisableAddButton(true);
  }
  const emailHandle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const email = e.target.value;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setEmailPerson(email);
    if (re.test(email)) {
      if (namePerson && email) setDisableAddButton(false);
      else setDisableAddButton(true);

      setMessageHelperTextEmail("  ");
    } else {
      setMessageHelperTextEmail("No es un email valido");
    }

  }
  const addButtonHandle = ()=>{
    if (namePerson && emailPerson) {
      const dataSent: addRowData = {
        id: generateRandomId() + "",
        name: namePerson,
        email: emailPerson,
      };
      addRow(dataSent);
      cleanTextFields();
      setDataAlert(
        true,
        "Registro agregado.",
        "success",
        autoHideDuration
      );
    } else {
      setDataAlert(
        true,
        "No se pudo agregar el registro.",
        "error",
        autoHideDuration
      );
    }
  }
  const sendQuotaHandle = () => {
    try {
      sendEmail();
      setDataAlert(
        true,
        ("Cotización enviada."),
        "success",
        autoHideDuration
      );
    } catch (exceptio) {
      setDataAlert(
        true,
        ("No se pudo enviar la cotización."),
        "error",
        autoHideDuration
      );
    }
  }
  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12} md={6} lg={3} alignSelf="center">
          <Typography sx={{ ...TextSmallFont }}>Nombre</Typography>
          <TextField
            value={namePerson}
            helperText={messageHelperTextName}
            onChange={(e) => namePersonHandle(e)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3} alignSelf="center">
          <Typography sx={{ ...TextSmallFont }}>Email</Typography>
          <TextField
            value={emailPerson}
            helperText={messageHelperTextEmail}
            onChange={(e) => emailHandle(e)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={2} alignSelf="flex-end">
          <Button
            size="small"
            endIcon={<Complete color={ColorPureWhite} />}
            disabled={disableAddButton}
            onClick={() => addButtonHandle()}
          >
            Agregar
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ p: 5, mr: 10, ml: 10 }}>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns.filter((col) => col.field != "id")}
          disableRowSelectionOnClick
        />
        <Grid
          item
          xs={11}
          sm={11}
          md={11}
          alignSelf="center"
          sx={{ justifyContent: "space-between" }}
        >
          <Button onClick={props.close} variant="outlined">
            Cancelar
          </Button>
          <Button
            disabled={enableSend}
            endIcon={<ArrowRight color={ColorPureWhite} />}
            onClick={() => sendQuotaHandle()}
            style={{ margin: "10px" }}
          >
            Enviar Cotización
          </Button>
        </Grid>
      </Box>
    </>
  );
}
