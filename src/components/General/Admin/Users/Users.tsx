import { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import People from "../../../../models/People";
import {
  default as PeopleDataService,
  default as UserService,
} from "../../../../services/user.service";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import { Delete, Edit, Plus, Search } from "../../../OuiComponents/Icons";
import Button from "../../../OuiComponents/Inputs/Button";
import {
  ColorPink,
  ColorPureWhite,
  ColorWhite,
  LinkSmallFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import Title from "../../Title/Title";
import ModalFormUser from "./ModalFormUsers";
import User from "../../../../models/User";
import IconButton from "@mui/material/IconButton/IconButton";
import Box from "../../../OuiComponents/Layout/Box";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import TextField from "../../../OuiComponents/Inputs/TextField";
import InputAdornment from "../../../OuiComponents/Inputs/InputAdornment";
import Stack from "../../../OuiComponents/Layout/Stack";
import { InputSearch } from "../../../OuiComponents/Inputs";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";

export default function Users() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [originalRows, setOriginalRows] = React.useState([{}]);
  const [rows, setRows] = React.useState([{}]);
  const [showModalFormUser, setModalFormUser] = React.useState(false);
  const [user, setUser] = React.useState<User>();
  const [change, setChange] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [changeInput, setChangeInput] = React.useState(true);
  const [showClearIcon, setShowClearIcon] = React.useState(false);

  React.useEffect(() => {
    
    const fetchData = async () => {
      UserService.getAll(search)
        .then((response) => response.data)
        .then((json) => {
          setOriginalRows(json);
          setRows(json);
          setChange(false);
        });
    };
    fetchData();
  }, [change]);

  const handleInputValidation = (str: string) => { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = handleInputValidation(e.target.value);
    setSearch(e.target.value);
    setShowClearIcon(newText.length > 0);
    let rowText: string = '';

    if (newText.length === 0) {
      setChange(true);
    } else {
      const results = originalRows.filter((row: any) => {
        const fullName = `${row.name} ${row.lastName} ${row.maternalLastName}`.trim();
        rowText = handleInputValidation(fullName)
        return rowText.includes(newText);
      });
      setRows(results);
    }
  };

  const handleNewUserClick = () => {
    setUser(undefined);
    setModalFormUser(true);
  };

  const handleUserEditClick = (params: any) => {
    setUser(params.row);
    console.log(params.row)
    setModalFormUser(true);
  };

  const handleUserDeleteClick = (params: any) => {
    const fetchDelete = async () => {
      setChange(true);
      UserService.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setDataAlert(true,"El usuario se ha deshabilitado.","success",autoHideDuration);
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    };
    fetchDelete();
  };

  const columns: GridColDef[] = [
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
      field: "lastName",
      headerName: "Apellido paterno",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.lastName}</Typography>
        );
      },
    },
    {
      field: "maternalLastName",
      headerName: "Apellido materno",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.maternalLastName}
          </Typography>
        );
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
      field: "initials",
      headerName: "Iniciales",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.initials}</Typography>
        );
      },
    },
    {
      field: "signature",
      headerName: "Firma",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.signature}</Typography>
        );
      },
    },
    {
      field: "objectStatusId",
      headerName: "Estatus",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.objectStatusId === 1 ? "Activo" : "No activo"}
          </Typography>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Tooltip title={<Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>Editar</Typography>}>
            <IconButton onClick={() => handleUserEditClick(params)}>
              <Edit color={ColorPink} />
            </IconButton>
          </Tooltip>
          <Tooltip title={<Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>Eliminar</Typography>}>
            <IconButton onClick={() => handleUserDeleteClick(params)}>
              <Delete color={ColorPink} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleShowClearIcon = () => {
    setSearch("");
    setShowClearIcon(false);
    setChange(true);
  };

  const handleClickSearchName = () => {
    setChangeInput(true);
  };

  const handleKeyPressName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setChangeInput(true);
    }
  };

  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />

      <Title
        title={"Administración de usuario"}
        url={(window.location.href).slice(SIZE_WEB_URL)}
      />

      <Paper  sx={{ p: "24px", borderRadius: "16px" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
          {showModalFormUser ? (
            <ModalFormUser
              data={user}
              open={showModalFormUser}
              close={() => {
                setChange(true);
                setModalFormUser(false);
              }}
            />
          ) : (
            <></>
          )}
         
              <InputSearch
                value={search}
                showClearIcon={showClearIcon}
                handleCancelClick={handleShowClearIcon}
                handleSearchClick={handleClickSearchName}
                onKeyDown={handleKeyPressName}
                onChange={handleInputChange}
                placeholder='Buscar'
              >
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              </InputSearch>
            
            
              <Button
                variant="contained"
                onClick={() => handleNewUserClick()}
                startIcon={<Plus color={ColorPureWhite}/>}
              >
                Nuevo usuario
              </Button>
            
        </Stack>
        <DataGrid
          //loading={change}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.folio + ""}
          disableRowSelectionOnClick
        />
      </Paper>
      {(change !== false) ? <LoadingScreen message="Cargando" /> : <></>}

    </>
  );
}
