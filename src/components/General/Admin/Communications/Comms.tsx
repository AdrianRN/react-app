import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react"; // Hooks
import Message from "../../../../models/Message";
import {
  deleteMessage,
  getPublicMessages,
  updateMessage,
  addMessage,
} from "../../../../services/message.service";
import PeopleService from "../../../../services/people.service";
import UserService from "../../../../services/user.service";
import Button from "../../../OuiComponents/Inputs/Button";
import Delete from "../../../OuiComponents/Icons/Delete";
import Edit from "../../../OuiComponents/Icons/Edit";
import Plus from "../../../OuiComponents/Icons/Plus";
import CustomSnackbar from '../../../OuiComponents/Feedback/CustomSnackbar';
import { ColorPink, ColorPureWhite, LinkLargeFont, LinkSmallFont, TextSmallFont, TextXSmallFont } from "../../../OuiComponents/Theme";
import Format from "../../../../utils/Formats.Data";
import moment from "moment";
import Title from "../../Title/Title";
import IconButton from "@mui/material/IconButton/IconButton";
import Box from "../../../OuiComponents/Layout/Box";
import Dialog from "../../../OuiComponents/Feedback/Dialog";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Input from "@mui/material/Input/Input";
import TextField from "../../../OuiComponents/Inputs/TextField";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import Stack from "../../../OuiComponents/Layout/Stack";

import { DialogContent } from "@mui/material";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import { Check } from "@mui/icons-material";


export default function Communications() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [people, setPeople] = useState();
  const [user, setUser] = useState();
  const [personId, setPersonId] = useState("0");
  const [userId, setUserId] = useState("0");
  const [currentMessage, setCurrentMessage] = useState<Message>(new Message());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogMode, setIsDialogMode] = useState("add");
  const [dateCreated, setDateCreated] = useState(Format.dateCurrentYYYYMMDD());
  const [expectedDate, setExpectedDate] = useState(
    Format.dateCurrentYYYYMMDD()
  );

  const handleNewMessageClick = () => {
    setIsDialogMode("add");
    setIsModalOpen(true);
    setCurrentMessage(new Message());
  };
  const handleDateCreatedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setDateCreated(newValue);
    const dateConvert = moment(newValue).format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ");
    let msg = currentMessage;
    msg.createDate = new Date(dateConvert);
    setCurrentMessage(msg);
  };
  const handleDateExpectedDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setExpectedDate(newValue);
    const dateConvert = moment(newValue).format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ");
    let msg = currentMessage;
    msg.expectedDate = new Date(dateConvert);
    setCurrentMessage(msg);
  };

  const handleEditMessageClick = (params: any) => {
    setIsDialogMode("edit");
    setIsModalOpen(true);
    if (params.row.person && params.row.person.email) {
      setCurrentMessage(params.row);
    } else {
      // advertencia si no person está en null
      console.warn("La propiedad 'person' o 'email' está ausente en params.row");
      
      // Se le pasa el email del localStorage
      const localStorageEmail = localStorage.getItem("userEmail") || "developer.tests@axen.pro";
      setCurrentMessage({
        ...params.row,
        person: { email: localStorageEmail },
      });
    }
    console.log(params.row)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMessage(new Message());
  };
  const handleSaveModal = () => {
    if (!currentMessage.title.trim() || !currentMessage.description.trim()) {
      setDataAlert(true, "El título y la descripción son obligatorios", "warning", 3000);
      return;
    }
    if(currentMessage.description.length > 350){
      setDataAlert(true, "El comunicado solo puede tener máximo 350 caracteres", 'warning', 3000);
      return
    }
    if (currentMessage.expectedDate <= currentMessage.createDate) {
      setDataAlert(true, 'La fecha de vencimiento tiene que ser mayor a la de creación', 'warning', 3000);
      return;
    }
    if (isDialogMode === "edit") {
      const message = {
        title: currentMessage.title,
        description: currentMessage.description,
        personId: currentMessage.personId,
        expectedDate:
          currentMessage.expectedDate.toString().length > 0
            ? Format.formatDateConversion(
              currentMessage.expectedDate.toString()
            )
            : new Date(),
        createDate:
          currentMessage.createDate.toString().length > 0
            ? Format.formatDateConversion(currentMessage.createDate.toString())
            : new Date(),
        objectStatusId: currentMessage.objectStatusId,
      };
      updateMessage(currentMessage.messageId, message)
        .then((response: any) => {
          if (response.message == "OK") {
            setDataAlert(true, "El comunicado interno ha sido actualizado", "success", 3000)
            getUpdatedMessages();
          } else {
            setDataAlert(true, "El comunicado interno no pudo ser actualizado", "warning", 3000)
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, "Ha ocurrido un error: " + e.message, "error", 3000)
        });
    } else if (isDialogMode === "add") {
      const newMessage = {
        title: currentMessage.title,
        description: currentMessage.description,
        personId: personId !== null && personId !== "0" ? personId : userId,
        expectedDate: currentMessage.expectedDate,
        createDate: currentMessage.createDate,
        objectStatusId: 1,
      };
      addMessage(newMessage)
        .then((response: any) => {
          if (response.message == "OK") {
            setDataAlert(true, "Nuevo comunicado interno creado", "success", 3000)
            getUpdatedMessages();
          } else {
            setDataAlert(true, "No se puedo crear el comunicado interno", "warning", 3000)
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, "Ha ocurrido un error: " + e.message, "error", 3000)
        });
    }
    setCurrentMessage(new Message());
    setIsModalOpen(false);
  };

  const handleMessageTitleChange = (newTitle: string) => {
    if (currentMessage) {
      let msg: Message = currentMessage;
      msg.title = newTitle;
      setCurrentMessage(msg);
    }
  };
  const handleMessageDescriptionChange = (newDescription: string) => {
    if (currentMessage) {
      let msg: Message = currentMessage;
      msg.description = newDescription;
      setCurrentMessage(msg);
    }
  };

  const handleDeleteMessageClick = (params: any) => {
    deleteMessage(params.row.messageId)
      .then((response: any) => {
        getUpdatedMessages();
        setDataAlert(true, "El comunicado interno ha sido deshabilitado", "success", 3000)
      })
      .catch((e: Error) => {
        setDataAlert(true, "Ha ocurrido un error: " + e.message, "error", 3000)
      });
  };
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    getUpdatedMessages();
    PeopleService.getByEmail({ email: localStorage.getItem("userEmail") || "" })
      .then((response) => response.data)
      .then((json) => {
        setPeople(json);
        if (json) {
          setPersonId(json.folio);
        }
      });
      UserService.getByEmail(userEmail)
      .then((response) => response.data)
      .then((json) => {
        setUser(json);
        if (json) {
          setUserId(json.folio);
        }
      });
  }, []);
  console.log(userId)
  const getUpdatedMessages = async () => {
    return getPublicMessages()
      .then((response: any) => response.data)
      .then((json: any) => {
        setMessages(json);
      })
      .catch((error: any) => {
        console.error("Error al obtener mensajes actualizados", error);
      });
      
      
  }

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Descripción",
      flex: 1,
      width: 150,
    },
    {
      field: "person.email",
      headerName: "Usuario",
      flex: 1,
      width: 150,
      valueGetter: (params) => {
        if (params.row.person) {
          return params.row.person.email;
        } else {
          return localStorage.getItem("userEmail") || "Sin usuario"; // Valor predeterminado si person es null o undefined
        }
      },
    },
    {
      field: "createDate",
      headerName: "Creado",
      flex: 1,
      width: 150,
    },
    {
      field: "expectedDate",
      headerName: "Vencimiento",
      flex: 1,
      width: 150,
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => handleEditMessageClick(params)}>
            <Edit color={ColorPink} />
          </IconButton>
          <IconButton onClick={() => handleDeleteMessageClick(params)}>
            <Delete color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("success");
  const [messageAlert, setMessageAlert] = useState("");
  const [autoHideDuration, setAutoHideDuration] = useState(2000);
  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };
  const setDataAlert = (open: boolean, message: string, severity: string, autoHideDuration: number) => {
    setIsSnackbarOpen(open);
    setMessageAlert(message);
    setSeverity(convertToValidSeverity(severity));
  }
  const convertToValidSeverity = (severityString: string) => {
    switch (severityString) {
      case "success":
      case "info":
      case "warning":
      case "error":
        return severityString; // Si es uno de los valores válidos, devolverlo
      default:
        return "info"; // O puedes asignar un valor predeterminado como "info"
    }
  };
  return (
    <>

      <CustomSnackbar
        open={isSnackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
        severity={severity} // Cambia la severidad según sea necesario
        message={messageAlert} // 
      />
      <Title title={"Administración de comunicados internos"} url={(window.location.href).slice(SIZE_WEB_URL)} />


      <Paper sx={{ p: '24px', borderRadius: '16px' }}>
        <Box
          sx={{
            marginBottom: "32px",
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Button
            startIcon={<Plus color="#fff" />}
            variant="contained"
            onClick={handleNewMessageClick}
          >
            Nuevo
          </Button>
        </Box>
        <DataGrid
          rows={messages}
          columns={columns.filter((col) => col.field != "messageId")}
          getRowId={(message) => message.messageId}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog open={isModalOpen}

        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 20,
            top: 8
          }}
        >
          <Cancel />
        </IconButton>
        <DialogContent>
        <Box >
          {/* Descripcion */}
          <Typography variant='h5' sx={{ ...LinkLargeFont }}>
            <strong>
              {isDialogMode === "add"
                ? "Nuevo comunicado interno"
                : "Editar comunicado interno"}
            </strong>
          </Typography>
          {/* Fecha de creacion y vencimiento */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-around',
              mt: 3,

            }}

              justifyContent="center"
              alignItems="center"

            >

              <Typography sx={{ ...TextXSmallFont, pr: 1 }}>
                Fecha de creación:
              </Typography>

              {isDialogMode === "add" && (
                <Input
                  type="date"
                  value={dateCreated} // Establece el valor del campo según el estado
                  onChange={handleDateCreatedChange}
                  disabled
                />
              )}
              {isDialogMode === "edit" && (
                <Typography
                  sx={{ ...TextXSmallFont, }}>

                  {currentMessage?.createDate.toString()}
                </Typography>
              )}
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-around',
              mt: 3,

            }}

              justifyContent="center"
              alignItems="center"

            >
              <Typography
                sx={{ ...TextXSmallFont, pr: 1 }}>
                Vencimiento:
              </Typography>

              {isDialogMode === "add" && (
                <TextField
                  sx={{ alignItems: "center" }}
                  type="date"
                  value={expectedDate} // Establece el valor del campo según el estado
                  inputProps={{
                    // min: "2024-01-15",
                    min: new Date().toISOString().split('T')[0]
                  }}
                  onChange={handleDateExpectedDateChange}
                />
              )}
              {isDialogMode === "edit" && (
                <Typography
                  sx={{ ...TextSmallFont }}
                >
                  {currentMessage?.expectedDate.toString()}
                </Typography>
              )}
            </Box>
          </Stack>
          {/* Titulo y nombre */}
          <Box
            sx={{
              display: "flex",
              alignContent: "space-between",
              flexWrap: "wrap",
            }}
          >

            {/* Titulo */}
            <Box sx={{ marginRight: "auto", mt: 2 }}>
              <Typography
                sx={{ ...TextSmallFont }}>
                Titulo
              </Typography>
              <TextField
                defaultValue={currentMessage?.title}
                // value={currentMessage?.title}
                inputProps={{
                  maxLength: 100,
                }}
                onChange={(e) => handleMessageTitleChange(e.target.value)}
                sx={{
                  width: "245px",
                }}
              />
            </Box>
            {/* Nombre */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ ...TextSmallFont }}>
                Nombre
              </Typography>
              <TextField
                disabled
                defaultValue={
                  currentMessage?.person.email.length > 0
                    ? currentMessage?.person.email
                    : localStorage.getItem("userEmail")
                }
                sx={{ width: "245px" }}
              />
            </Box>
          </Box>
          {/* TextArea */}
          <TextField
            inputProps={{
              maxLength: 500,
            }}
            defaultValue={currentMessage?.description}
            multiline
            rows={5}
            sx={{
              width: "100%",
              marginTop: "24px",
            }}
            onChange={(e) => handleMessageDescriptionChange(e.target.value)}
          />
          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              alignContent: "space-between",
              flexWrap: "wrap",
              marginTop: "34px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ marginRight: "auto" }}
              onClick={handleCloseModal}
            >
              Cerrar
            </Button>
            <Button
              variant="contained"
              startIcon={<Check sx={{ backgroundColor: "#e5105d" }} />}
              onClick={handleSaveModal}
            >
              Guardar
            </Button>
          </Box>
        </Box>
        </DialogContent>
      </Dialog>

    </>
  );
}
