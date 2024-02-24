import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import React from "react";
import { useNavigate } from "react-router";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import PeopleDataService from "../../../../services/people.service";
import { ListItemButton } from "../../../OuiComponents/DataDisplay";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import Search from "../../../OuiComponents/Icons/Search";
import { InputAdornment, InputSearch } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import Title from "../../Title/Title";
import Box from "../../../OuiComponents/Layout/Box";
import { Health } from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  ColorOrange,
  ColorYellow,
  ColorGreen,
  ColorBlue,
} from "../../../OuiComponents/Theme";

import PersonModel from "../../../../models/People";
import Edit from "../../../OuiComponents/Icons/Edit";
import TabModalPerson from "../../Admin/People/TabModalPerson";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import Constants from "../../../../utils/Constants";

export default function Customers() {
  const [rows, setRows] = React.useState([]);
  const [originalRows, setOriginalRows] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [personFolio, setPersonFolio] = React.useState<PersonModel>();
  const [personTypePersonId, setPersonTypePersonId] = React.useState<string | undefined>();
  const [showFormPersons, setFormPersons] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState<String | null>();
  
  const [inputValue, setInputValue] = React.useState('');
  React.useEffect(() => {
    // Verificar si el valor no es una cadena vacía o solo espacios antes de ejecutar la lógica
    if (change === false) {
      setChange(true);
    }
  
    if (inputValue.trim() === '' || inputValue.trim() === '') { // Comprobación si inputValue está vacío o solo contiene espacios
      // Establecer un temporizador de 5 segundos para la búsqueda
      const timerId = setTimeout(() => {
        PeopleDataService.getAllByName(inputValue)
          .then((response) => response.data)
          .then((json) => {
            if (json.length > 0) {
              setOriginalRows(json);
              setRows(json);
              setChange(false);
            } else if (inputValue.trim() !== '') { // Validar si no es solo espacios
              // Realizar búsqueda por CURP si no se encuentran resultados
              PeopleDataService.getByCURP(inputValue)
                .then((response) => response.data)
                .then((json) => {
                  setOriginalRows(json);
                  setRows(json);
                  setChange(false);
                });
            } else {
              setOriginalRows(json);
              setRows(json);
              setChange(false);
            }
          });
      }, 3000); // Temporizador de 3 segundos para consulta con inputValue vacío o solo espacios
  
      // Limpiar el temporizador existente cada vez que se produce un cambio
      return () => clearTimeout(timerId);
    } else {
      // Temporizador de 2 segundos para búsqueda cuando inputValue contiene información
      const timerId = setTimeout(() => {
        PeopleDataService.getAllByName(inputValue)
          .then((response) => response.data)
          .then((json) => {
            if (json.length > 0) {
              setOriginalRows(json);
              setRows(json);
              setChange(false);
            } else if (inputValue.trim() !== '') { // Validar si no es solo espacios
              // Realizar búsqueda por CURP si no se encuentran resultados
              PeopleDataService.getByCURP(inputValue)
                .then((response) => response.data)
                .then((json) => {
                  setOriginalRows(json);
                  setRows(json);
                  setChange(false);
                });
            } else {
              setOriginalRows(json);
              setRows(json);
              setChange(false);
            }
          });
      }, 2000); // Temporizador de 2 segundos para consulta con inputValue no vacío
  
      // Limpiar el temporizador existente cada vez que se produce un cambio
      return () => clearTimeout(timerId);
    }
  }, [inputValue]);

  const navigate = useNavigate();

  const handleShowClearIcon = () => {
    setSearchText("");
    setShowClearIcon(false);
    setChange(true);
  };

  const handleSearchClick = () => {
    setChange(true);
  };
  

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    const newText = event.target.value;
    setSearchText(newText);
    setShowClearIcon(newText.length > 0);

    if (newText.length === 0) {
      setChange(true);
    } else {
      const results = originalRows.filter((row: any) => {
        let fullName = "";

        if (row.typePerson?.description?.toString().toUpperCase() === Constants.typeMoralPerson) {
          fullName = row.name.trim()
        } else {
          fullName =
            `${row.name} ${row.lastName} ${row.maternalLastName}`.trim();
        }

        const rfc = `${row.rfc}`.trim();

        const curp = `${row.curp}`.trim();

        return (
          fullName.toUpperCase().includes(newText.toUpperCase()) ||
          rfc.toUpperCase().includes(newText.toUpperCase()) ||
          curp.toUpperCase().includes(newText.toUpperCase())
        );
      });
      setRows(results);
      if(results.length===1)
      {
        //console.log("aqui")
        var folio: any="";
        results.forEach((row:any) => {folio = row.folio;});
        navigate("/index/seguros/polizas/" + folio)
      }
      console.log("->")
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      width: 200,
      renderCell: (params: any) => (
        <ListItemButton
          onClick={() => navigate("/index/seguros/polizas/" + params.row.folio)}
        >
          {params?.row?.typePerson?.description?.toString().toUpperCase() === Constants.typeMoralPerson
            ? params.row.name
            : `${params.row.name} ${params.row.lastName} ${params.row.maternalLastName}`}
        </ListItemButton>
      ),
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
    },
    {
      field: "rfc",
      headerName: "RFC",
      flex: 1,
    },
    {
      field: "curp",
      headerName: "CURP",
      flex: 1,
    },
    {
      field: "nationalities",
      headerName: "Nacionalidad",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.nationalities) {
          return params.row.nationalities.description;
        }
      },
    },
    {
      field: "healt",
      headerName: "Score",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Box>
            {(params.row.healt == null || params.row.healt == 0) && (
              <Health
                bgColor={ColorPink}
                circleColor={ColorPureWhite}
                circleNumber="1"
              />
            )}
            {params.row.healt > 0 && params.row.healt <= 20 && (
              <Health
                bgColor={ColorPink}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 20 && params.row.healt <= 40 && (
              <Health
                bgColor={ColorOrange}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 40 && params.row.healt <= 60 && (
              <Health
                bgColor={ColorYellow}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 60 && params.row.healt <= 80 && (
              <Health
                bgColor={ColorGreen}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 80 && params.row.healt <= 100 && (
              <Health
                bgColor={ColorBlue}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
          </Box>
        </>
      ),
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => ToEditUser(params)}>
            <Edit color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];

  const ToEditUser = (params: any) => {
  
    const currentUrl = window.location.origin;
    const newUrl = `${currentUrl}/index/administracion/personas?openEditPersonModal=true&folio=${params.row.folio}&typePersonId=${params.row.typePersonId}`;
    window.open(newUrl, "_blank");
  };


  return (
    <>

      {showFormPersons ? (
        <TabModalPerson
          data={personFolio}
          //nationality={personNationality}
          typePersonId={personTypePersonId}
          open={showFormPersons}
          beneficiary={beneficiary}
          close={() => {
            setChange(true);
            setFormPersons(false);
          }}
        />
      ) : (
        <></>
      )}

      <Title
        title={"Clientes"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <InputSearch
            value={inputValue}
            showClearIcon={showClearIcon}
            handleCancelClick={handleShowClearIcon}
            handleSearchClick={handleSearchClick}
            onChange={handleInputChange}
            placeholder="Buscar"
          >
            <InputAdornment position="start">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          </InputSearch>
        </Stack>
        <DataGrid
          //loading={change}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.personId + ""}
          disableRowSelectionOnClick
        />
      </Paper>
      {/*(change !== false) ? <LoadingScreen message="Cargando" /> : <></>*/}
    </>
  );
}
