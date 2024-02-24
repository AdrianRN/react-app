import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import { useNavigate } from "react-router";
import PeopleDataService from "../../../../services/people.service";
import { InputAdornment, InputSearch } from "../../../OuiComponents/Inputs";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { ListItemButton } from "../../../OuiComponents/DataDisplay";
import Stack from "../../../OuiComponents/Layout/Stack";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { IconButton } from "@mui/material";
import Search from "../../../OuiComponents/Icons/Search";
import Title from "../../Title/Title";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
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
import Edit from "../../../OuiComponents/Icons/Edit";



export default function Customers() {
  const [rows, setRows] = React.useState([]);
  const [originalRows, setOriginalRows] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");


  React.useEffect(() => {
    const fetchData = async () => {
      PeopleDataService.getAllByName(searchText)
        .then((response) => response.data)
        .then((json) => {
          setRows(json);
          setOriginalRows(json);
          setChange(false);
        });
        
    };
    fetchData();
  }, [change]);

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
    
    const newText = event.target.value;
    setSearchText(newText);
    setShowClearIcon(newText.length > 0);

    if (newText.length === 0) {
      setChange(true);
    } else {
      const results = originalRows.filter((row: any) => {
        const fullName =
          `${row.name} ${row.lastName} ${row.maternalLastName}`.trim();

        const rfc = `${row.rfc}`.trim();

        const curp = `${row.curp}`.trim();

        return (
          fullName.toUpperCase().includes(newText.toUpperCase()) ||
          rfc.toUpperCase().includes(newText.toUpperCase()) ||
          curp.toUpperCase().includes(newText.toUpperCase())
        );
        
      });
      setRows(results);
      if(results.length==1)
      {
        var folio: any="";
        results.forEach((row:any) => {folio = row.folio;});
        navigate("/index/fianzas/polizas/" + folio)
      }
    }
  };
  const ToEditUser = (params: any) => {
    const currentUrl = window.location.origin;
    const newUrl = `${currentUrl}/index/administracion/personas?openEditPersonModal=true&folio=${params.row.folio}&typePersonId=${params.row.typePersonId}`;
    window.open(newUrl, "_blank");
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      width: 200,
      renderCell: (params: any) => (
        <ListItemButton
          onClick={() => navigate("/index/fianzas/polizas/" + params.row.folio)}
        >
          {params.row.name}
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
            {params.row.healt > 80 && (
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

  return (
    <>
      <Title
        title={"Clientes"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />

      <Paper sx={{ p: "24px", borderRadius: 8 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <InputSearch
            value={searchText}
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
          loading={change}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.personId}
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
}
