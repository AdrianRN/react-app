import { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import { InputAdornment, InputSearch } from "../../../OuiComponents/Inputs";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import HealthChip from "../../../OuiComponents/DataDisplay/HealthChip";
import { Edit, Search } from "../../../OuiComponents/Icons";
import ProspectsModal from "./ProspectsModal";
import Title from "../../Title/Title";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import {
    ColorBlue, ColorGreen, ColorOrange, ColorPink,
    ColorPureWhite, ColorYellow
  } from "../../../OuiComponents/Theme";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Stack from "../../../OuiComponents/Layout/Stack";
import { IconButton } from "@mui/material";
import PeopleService from "../../../../services/people.service";
import { Health, Typography } from "../../../OuiComponents/DataDisplay";
import Box from "../../../OuiComponents/Layout/Box";
import CatalogValue from "../../../../models/CatalogValue";
import Constants from "../../../../utils/Constants";



export default function Prospects() {
  //const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  
  const [personId, setPersonId] = React.useState("");
  const [childData, setChildData] = React.useState("");
  const theme = useTheme(); // Add useTheme
  const navigate = useNavigate();
  //Se agregan variable para búsqueda
  const [searchByName, setSearchByName] = React.useState("");
  const [change, setChange] = React.useState(true);
  const [rows, setRows] = React.useState([]);


  React.useEffect(() => {}, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      width: 300,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      width: 150,
      valueGetter: (params) => {
        if (params.row.typePerson) {
          return params.row.typePerson.description;
        }
      },
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
      width: 150,
    },
    {
      field: "rfc",
      headerName: "RFC",
      flex: 1,
      width: 150,
    },
    {
      field: "curp",
      headerName: "CURP",
      flex: 1,
      width: 150,
    },
    {
      field: "nationalities",
      headerName: "Nacionalidad",
      flex: 1,
      width: 150,
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
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <IconButton onClick={() => handleEditClick(params)}>
          <Edit color={ColorPink} />
        </IconButton>
      ),
    },
  ];

  

  

  const handleEditClick = (params: any) => {
    setPersonId(params.row);
    setOpenModal(true);
  };

  React.useEffect(() => {
    // PeopleDataService.getAll()
    //     .then((response) => response.data)
    //     .then((json) => { setRows(json); setChange(false); console.log(json); });
  }, [change]);

  // const data = rows.map((row: { [key: string]: any }) => {
  //   const columns = Object.keys(row).map((column) => {
  //     if (column === "name") {
  //       const lastName = row['lastName'] || '';
  //       const maternalLastName = row['maternalLastName'] || '';
  //       const name = row["name"] || '';
  //       if (row.typePerson.description.toString().toUpperCase() === Constants.typeMoralPerson.toUpperCase()){
  //         console.log('row', row)
  //               row['name'] = `${name}`;
  //             }else {
  //               row['name'] = `${name} ${lastName} ${maternalLastName}`;
  //             }
  //       return { field: "name", headerName: "Name" };
  //     }
  //     return { field: column, headerName: column };
  //   });
  //   return columns;
  // });

  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const handleShowClearIcon = () => {
    setSearchByName("");
    setShowClearIcon(false);
    setChange(true);
    setRows([])
  };
  const handleSearchClick = () => {};

  const handleInputValidation = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  

  const handleRecievedValue = (childData: any) => {
      console.log(childData);
    setChildData(childData);
    /*rows[0].personId &&
      setRows(
        rows.map((row) => {
          row.personId === personId && (row.semaforo = childData);
          return row;
        })
      );*/
  };


  const handleClickSearchName = () => {
    setChange(true);
  };

  const handleKeyPressName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setChange(true);
    }
  };

  const handleSearchTextChangeName = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchByName(event.target.value);
    const newText = await handleInputValidation(event.target.value);
  
    setTimeout(async () => {
      if (event.target.value && newText === event.target.value) {
        const response = await PeopleService.getAllByName(newText);
        const list = response.data;
  
        list.map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const lastName = row["lastName"] || "";
              const maternalLastName = row["maternalLastName"] || "";
              const name = row["name"] || "";
              if (!row.typePerson) {
                if (row["lastName"] && row["maternalLastName"]) {
                  row["name"] = `${name} ${lastName} ${maternalLastName}`;
                } else {
                  row["name"] = `${name}`;
                }
                return { field: "name", headerName: "Name" };
              }
              if (
                row.typePerson.description.toString().toUpperCase() ===
                Constants.typeMoralPerson.toUpperCase()
              ) {
                row["name"] = `${name}`;
              } else {
                row["name"] = `${name} ${lastName} ${maternalLastName}`;
              }
              return { field: "name", headerName: "Name" };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });
        setRows(list);
        setShowClearIcon(newText.length > 0);
      }
    }, 500);
  };  

  return (
    <>
      <Title
        title={"Prospectos"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={theme.breakpoints.down("sm") ? 2 : 100}
          sx={{ mb: 5 }}
        >
          <InputSearch
            value={searchByName}
            showClearIcon={showClearIcon}
            handleCancelClick={handleShowClearIcon}
            handleSearchClick={handleClickSearchName}
            onKeyDown={handleKeyPressName}
            onChange={handleSearchTextChangeName}
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

      {openModal && (
        <ProspectsModal
          recievedValue={handleRecievedValue}
          open={openModal}
          close={() => {
            setChange(true);
            setOpenModal(false);
          }}
          person={personId}
        />
      )}
    </>
  );
}
