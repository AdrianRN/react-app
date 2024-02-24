import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import PoliciesService from "../../../../insuranceServices/policies.service";
import PeopleService from "../../../../services/people.service";
import { Health, HealthChip, Tooltip } from "../../../OuiComponents/DataDisplay";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import {
  Attached,
  Delete,
  Edit,
  History,
  Plus,
} from "../../../OuiComponents/Icons";
import { Button } from "../../../OuiComponents/Inputs";
import Box from "../../../OuiComponents/Layout/Box";
import Stack from "../../../OuiComponents/Layout/Stack";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import {
  ColorPink,
  ColorPureWhite,
  ColorWhite,
  TextMediumFont,
  TextSmallFont,
  TextMediumBoldFont,
  ColorGray
} from "../../../OuiComponents/Theme";
import Title from "../../Title/Title";
import PoliciesModal from "./PoliciesModal";
import QuotesService from "../../../../insuranceServices/quotes.service";
import Quote from "../../../../models/Quote";
import ChubbCatalogVehicleService from "../../../../insuranceServices/chubbCatalogVehicles.service";
import { InputAdornment, InputSearch } from "../../../OuiComponents/Inputs";
import Search from "../../../OuiComponents/Icons/Search";
import { Grid } from "../../../OuiComponents/Layout";
import People from "../../../../models/People";
import FormatData from "../../../../utils/Formats.Data";
import Constants from "../../../../utils/Constants";
import PoliciyService from "../../../../insuranceServices/policies.service";
import { Policies as IPolicy } from "../../../../insuranceModels/policies";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización de español si no lo has hecho aún

import fileStorageService from "../../../../services/fileStorage.service";

export default function Policies() {
  const [listPolicies, setPolicies] = useState([]);
  const [listQuotes, setListQuotes] = useState<Quote[]>([]);
  const [user, setUser] = useState<People>();
  const { personId } = useParams();
  const [open, setOpen] = useState(false);
  const [loadQuotes, setLoadQuotes] = useState(false);
  const [policieFolio, setpolicieFolio] = useState("");
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [change, setChange] = useState(true);
  const [rows, setRows] = useState<IPolicy[]>([]);
  const [policyState, setPolicyState] = useState<boolean>(true)
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState([]);

  useEffect(() => {
    if (!policyState) {
      handlePoliciesHistory(1)

    } else if (policyState) {
      handlePoliciesHistory(2)
    }
  }, [policyState]);

  useEffect(() => {
    if (open === false)
      fetchData()
  }, [open]);

  const handlePoliciesHistory = async (policyStatus: number) => {
    if (personId) {
      try {
        const restPoliciesHistory = await PoliciyService.getPoliciesExpiredCanceledPendingAsync(
          personId,
          policyStatus
        );
        setRows(restPoliciesHistory.data);

      } catch (error) {
        console.log("Error fetching policies history records: ", error);
        return null;
      }
    }
  }

  const handleDataChange = () => {
    setChange(true)
  }
  // Función para capitalizar la primera letra de una cadena
  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // Función para formatear la fecha
  function formatDate(dateString: string) {
    const date = dayjs(dateString);
    const monthName = date.locale('es').format('MMM');
    const capitalizedMonthName = capitalize(monthName);
    return `${capitalizedMonthName} ${date.year()}`;
  }
  const fetchData = async () => {
    if (personId) {
      const peopleResponse = await PeopleService.getById(personId)
      const restPoliciesHistory = await PoliciyService.getPoliciesExpiredCanceledPendingAsync(
        personId,
        2
      );
      const quotesResponse = await QuotesService.getQuotesByClientFolio(personId)

      await getAttachedFiles();
      setUser(peopleResponse.data)
      setPolicies(restPoliciesHistory.data)
      setRows(restPoliciesHistory.data)
      setListQuotes(quotesResponse.data)
      setLoadQuotes(true);
    }
    setChange(false)
  }

  const fetchVehicleDetails = async (vehicleId: string, index: number) => {
    try {
      const vehicleDetails =
        await ChubbCatalogVehicleService.getCatalogVehicleByFolio(vehicleId);
      const vehicle = vehicleDetails.data;

      const updatedQuote = {
        ...listQuotes[index],
        brand: vehicle ? vehicle.brand : vehicleId,
        description: vehicle ? vehicle.description : "no fue encontrado",
      };

      return updatedQuote;
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateQuotes = async () => {
      if (listQuotes && loadQuotes) {
        if (listQuotes.length > 0) {
          const updatedListQuotes = [];

          for (let index = 0; index < listQuotes.length; index++) {
            const updatedQuote = await fetchVehicleDetails(
              listQuotes[index].vehicleId,
              index
            );
            if (updatedQuote !== null) {
              updatedListQuotes.push(updatedQuote);
            }
          }

          setListQuotes(updatedListQuotes);
          setLoadQuotes(false);
        }
      }
    };

    updateQuotes();
  }, [listQuotes, loadQuotes]);

  const handlePolicyTypeIcon = (policy: any) => {
    const branchId = policy.branchId;
    const branchMappings: Record<string, { label: string; chipColor: string }> = {
      [Constants.folioFleetsBranch]: { label: 'FL', chipColor: '#0000CD' },
      [Constants.folioCarBranch]: { label: 'AU', chipColor: '#4169E1' },
      [Constants.folioGroupHealthBranch]: { label: 'SG', chipColor: '#F44336' },
      [Constants.folioGroupLifeBranch]: { label: 'VG', chipColor: '#90EE90' },
      [Constants.folioIndividualLifeBranch]: { label: 'VI', chipColor: '#008000' },
      [Constants.folioPersonalAccidentsBranch]: { label: 'AP', chipColor: '#8B0000' },
      [Constants.folioDiverseBranch]: { label: 'DI', chipColor: '#778899' },
      [Constants.folioIndividualHealthBranch]: { label: 'SI', chipColor: '#FF0000' },
      [Constants.folioBondBranch]: { label: 'FI', chipColor: '#FF6347' },
      [Constants.folioCreditInsurance]: { label: 'SC', chipColor: '#FFFF00' },
    };

    const mapping = branchMappings[branchId];

    if (mapping) {
      const { label, chipColor } = mapping;
      return <HealthChip color={chipColor} label={label} />;
    }
  }

  const columns: GridColDef[] = [
    {
      field: " ",
      headerName: " ",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <>
            <Grid container spacing={1} alignItems='center' textAlign='center'>
              <Grid item xs={6}>
                {handlePolicyTypeIcon(params.row ?? '')}
              </Grid>
              <Grid item xs={6}>
                <CustomAttachedFile policyData={attachedFiles && attachedFiles} policyFolio={params.row ?? ''} />
              </Grid>
            </Grid>
          </>
        )
      }
    },
    {
      field: "insuranceCompany",
      headerName: "Aseguradora",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.insuranceCompany}>
            <span>
              <Typography sx={TextSmallFont}>{params.row.insuranceCompany}</Typography>
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "noPolicy",
      headerName: "Póliza",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.noPolicy}>
            <span>
              <Typography sx={TextSmallFont}>{params.row.noPolicy}</Typography>
            </span>
          </Tooltip>

        );
      },
    },
    {
      field: "clientId",
      headerName: "Cliente",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        var fullName = '';
        if (params.row.clientId === user?.folio) {
          if (user?.typePersonId.toString().toUpperCase() === Constants.folioMoralPerson) {
            fullName = user?.name.trim();
          } else {
            fullName = `${user?.name} ${user?.lastName} ${user?.maternalLastName}`.trim();
          }
        } else {
          fullName = params?.row?.clientName + '';
        }
        return (
          <>
            <Typography sx={TextSmallFont}>{fullName}</Typography>
          </>
        );
      },
    },
    {
      field: "startValidity",
      headerName: "Vigencia",
      flex: 1,
      minWidth: 170,
      renderCell: (params) => {
        const startValidity = formatDate(params?.row?.startValidity + '');
        const endValidity = formatDate(params?.row?.endValidity + '');
        return (
          <Tooltip title={`${FormatData.stringDateFormatDDMMYYY(params?.row?.startValidity ?? '')} - ${FormatData.stringDateFormatDDMMYYY(params?.row?.endValidity ?? '')}`}>
            <span>
              <Typography sx={TextSmallFont}>
                {startValidity} - {endValidity}
              </Typography>
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "endorsement",
      headerName: "Endoso",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.endorsement}</Typography>
        );
      },
    },
    {
      field: "policyStatusFolio",
      headerName: "Estatus",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.policyStatusFolio ? Constants.policyStatus[params.row.policyStatusFolio].description : "SIN ESTATUS"}
          </Typography>
        );
      },
    },
    {
      field: "health",
      headerName: "Salud",
      flex: 1,
      minWidth: 100,
      renderCell: (params: any) => (
        <>
          <Box>
            <Health
              bgColor={ColorPink}
              circleColor={ColorPureWhite}
              circleNumber="1"
            />
          </Box>
        </>
      ),
    },
  ];

  const handleNewPolicieClick = () => {
    if (personId !== undefined) {
      navigate("/index/seguros/polizas/emision/" + personId + "/");
    } else {
      navigate("/index/seguros/polizas/emision");
    }
  };

  const handlePolicesModal = (params: any) => {
    setOpen(true);
    setpolicieFolio(params.row.folio);
  };

  const handleCotizar = () => {
    //navigate("/index/seguros/multicotizador/" + personId);
    navigate("/index/seguros/multicotizador");
  };

  const quoteColumns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Fecha de cotización",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography sx={TextSmallFont}>
          {FormatData.stringDateFormatDDMMYYY(params.row.createdAt)}
        </Typography>
      ),
    },
    {
      field: "expirationDate",
      headerName: "Fecha de Caducidad",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography sx={TextSmallFont}>
          {FormatData.stringDateFormatDDMMYYY(params.row.chubbResponse.expirationDate ?? params.row.hdiResponse.expirationDate)}
        </Typography>
      ),
    },
    {
      field: "concept",
      headerName: "Concepto",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography sx={TextSmallFont}>
          {`${params.row.brand ?? ''} ${params.row.description ?? ''}`}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={TextSmallFont}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit color={ColorPink} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete color={ColorPink} />
          </IconButton>
        </Typography>
      ),
    },
  ];

  const handleEdit = (quote: Quote) => {
    navigate(`/index/seguros/multicotizador/quote/${quote.quoteFolio}`);
  };

  const handleDelete = (quote: Quote) => {
    const fetchDelete = async () => {
      QuotesService.deleteByFolio(quote.quoteFolio)
        .then((response: any) => {
          console.log("La cotizacion ha sido eliminada.");

          const updatedQuotes = listQuotes.filter(
            (q) => q.quoteFolio !== quote.quoteFolio
          );
          setListQuotes(updatedQuotes);
        })
        .catch((e: Error) => {
          console.log(e.message);
        });
    };

    fetchDelete();
  };

  const handleShowClearIcon = () => {
    setSearchText("");
    setShowClearIcon(false);
    setChange(false);

    if (personId != null && personId !== undefined) setRows(listPolicies);
    else {
      setRows([]);
      setPolicies([]);
    }
  };

  const handleSearchClick = () => {
    setChange(true);
  };

  const handleInputChange = async (event: any) => {
    const newText = event.target.value;
    setSearchText(newText);
    setShowClearIcon(newText.length > 0);

    if (personId != null && personId !== undefined) {
      if (newText === "") {
        setRows(listPolicies);
        setChange(false);
      } else {
        if (newText.length === 0) {
          setChange(false);
        } else {
          const results = listPolicies.filter((row: any) => {
            const noPolicy = `${row.noPolicy}`.trim();
            return noPolicy.toUpperCase().includes(newText.toUpperCase());
          });
          setRows(results);
          setChange(false);
        }
      }
    } else {
      if (newText === "") {
        setRows([]);
        setPolicies([]);
        setChange(false);
        return;
      }

      if (newText.length === 0) {
        setChange(false);
      } else {
        const restPolicy =
          await PoliciesService.GetPoliciesByClientOrPolicyNumber(newText);

        await getAttachedFiles();
        setPolicies(restPolicy.data ?? []);
        setRows(restPolicy.data ?? []);
        setChange(false);
      }
    }
  };

  const getAttachedFiles = async () => {
    const responseFiles = await fileStorageService.get();
    setAttachedFiles(responseFiles.data ?? []);
  }

  return (
    <>
      <Title title={"Pólizas"} url={window.location.href.slice(SIZE_WEB_URL)} />

      <Paper sx={{ p: "24px", borderRadius: 8 }}>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            pb:"25px",
            pt:"25px"
          }}
        >
          {user ? (
            <Typography sx={TextMediumBoldFont}>
              {user.typePersonId.toString().toUpperCase() ===
                Constants.folioMoralPerson
                ? user.name
                : `${user.name} ${user.lastName} ${user.maternalLastName}`}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
        {/* <Grid item xs={12} lg={6} textAlign="center">
              &nbsp;
            </Grid> */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
          </Box>
          {/* <Grid item xs={12} lg={3} textAlign="center">
              &nbsp;
            </Grid> */}
          <Box>
            <Button variant="contained" sx={{mr:"7px"}} onClick={() => handleCotizar()}>
              <Plus color={ColorWhite} />
              Cotizar
            </Button>
          </Box>
          <Box >
            <Button
              variant="contained"
              
              onClick={() => handleNewPolicieClick()}
              startIcon={<Plus color={ColorWhite} />}
            >
              Nueva póliza
            </Button>
          </Box>
          {personId &&  (
            <Box>
              <Button
                variant={policyState ? "contained" : "outlined"}
                sx={{ml:"7px"}}
                startIcon={
                  <History color={policyState ? ColorWhite : ColorPink} />
                }
                onClick={() => {
                  setPolicyState(!policyState);
                }}
              >
                Historial
              </Button>
            </Box>
          )
          }

        </Stack>
        <DataGrid
          loading={change}
          onRowClick={handlePolicesModal}
          rows={rows}
          getRowId={(row) => row.policyId + ""}
          columns={columns}
          disableRowSelectionOnClick
          sx={{ mb: 10 }}
        />

        <Typography sx={TextMediumFont} style={{ marginBottom: "15px" }}>
          {`Cotizaciones`}
        </Typography>

        <DataGrid
          rows={listQuotes}
          getRowId={(row) => row.quoteFolio + ""}
          columns={quoteColumns}
          disableRowSelectionOnClick
        />

      </Paper >
      {open && (
        <PoliciesModal
          folio={policieFolio}
          open={open}
          setOpen={setOpen}
          folioclient={personId}
          onDataChange={handleDataChange}
        />
      )
      }
    </>
  );
}

const CustomAttachedFile = (policyData: any) => {
  const policyFolio = policyData.policyFolio.folio;
  const [hasAttachedFile, setHasAttachedFile] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAttachedFile = async () => {
      const hasFile = policyData.policyData.find((policy: any) => policy.externalFolio === policyFolio);
      if (hasFile) {
        setHasAttachedFile(true);
      } else {
        setHasAttachedFile(false);
      }
    };
    fetchAttachedFile();
  }, [policyData.policyData, policyFolio]);

  if (hasAttachedFile === null) {
    return <Attached color={ColorGray} />
  }
  return <Attached color={hasAttachedFile ? ColorPink : ColorGray} />
};

