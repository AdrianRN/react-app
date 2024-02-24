import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import Stack from "../../../OuiComponents/Layout/Stack";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import {
  History,
} from "../../../OuiComponents/Icons";
import {
  ColorGray,
  ColorPink,
  ColorWhite,
  TextMediumBoldFont,
} from "../../../OuiComponents/Theme";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import Button from "../../../OuiComponents/Inputs/Button";
import Plus from "../../../OuiComponents/Icons/Plus";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import IconButton from "@mui/material/IconButton/IconButton";
import bondService from "../../../../services/bonds.service";
import { useNavigate, useParams } from "react-router-dom";
import PeopleService from "../../../../services/people.service";
import Title from "../../Title/Title";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import { People } from "../../../../models/People";
import { InputAdornment, InputSearch } from "../../../OuiComponents/Inputs";
import Search from "../../../OuiComponents/Icons/Search";
import IBonds from "../../../../models/Bonds";
import { ListItemButton } from "../../../OuiComponents/DataDisplay";
import ModalOperationBondPolicyInquiry from "./ModalOperationBondPolicyInquiry";
import CatalogValueService from "../../../../services/catalogvalue.service";
import CompaniesService from "../../../../services/companies.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import Constants from "../../../../utils/Constants";
import { Grid } from "@mui/material";
import CacheService from "../../../../services/cache.service";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CatalogValue from "../../../../models/CatalogValue";
import FormatData from "../../../../utils/Formats.Data";

interface suretyPolicyData {
  people: People;
  bonds: IBonds[];
  beneficiaryGroup: CacheCatalogValue;
  subBranchesCatalog: CacheCatalogValue;
}

export default function SuretyPolicies() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const { personId } = useParams<string>();
  const [valuesData, setValuesData] = React.useState<suretyPolicyData>();
  const [loading, setLoading] = React.useState(true);
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [change, setChange] = React.useState(true);
  const [rows, setRows] = React.useState<IBonds[]>([]);
  const [policyState, setPolicyState] = React.useState<boolean>(true)
  const navigate = useNavigate();

  const handleNewPolicieClick = () => {
    if (personId) {
      if (valuesData?.people && valuesData.people.healt < 90) {
        setDataAlert(
          true,
          "No es posible generar una fianza para este cliente, favor de completar su expediente.",
          "warning",
          autoHideDuration
        );
      } else {
        navigate("/index/fianzas/polizas/emision/" + personId + "/");
      }
    } else {
      navigate("/index/fianzas/polizas/emision");
    }
  };

  React.useEffect(() => {
    if (!policyState) {
      handlePoliciesHistory(1);

    } else if (policyState) {
      handlePoliciesHistory(2);
    }
  }, [policyState]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const restPeople = personId
      ? await PeopleService.getById(personId)
      : undefined;
    const restBonds = personId
      ? await bondService.getBondByClientOrPolicyNumber(personId, 0) //STATUS => 0=todas, 1=canceladas, vencidas 2=pendientes,vigentes
      : undefined;
    const responseBeneficiaryGroup = await CacheService.getByFolioCatalog(
      Constants.beneficiaryGroupFolio
    );
    const responseCatalogSubBranches = await CacheService.getByFolioCatalog(
      Constants.subBranchI
    );

    setValuesData({
      people: restPeople ? restPeople.data : restPeople,
      bonds: restBonds ? restBonds.data : restBonds,
      beneficiaryGroup: responseBeneficiaryGroup.data,
      subBranchesCatalog: responseCatalogSubBranches.data,
    });

    setRows(restBonds?.data ?? []);
    setLoading(false);
  };

  const handleShowClearIcon = () => {
    setSearchText("");
    setShowClearIcon(false);
    setChange(true);

    if (personId) {
      setRows(Object(valuesData?.bonds) ?? []);
    } else {
      setRows([]);
    }
  };

  const handleSearchClick = () => {
    setChange(true);
  };

  const handleInputChange = async (event: any) => {
    const newText = event.target.value;
    setSearchText(newText);

    setShowClearIcon(newText.length > 0);

    if (personId) {
      if (newText === "") {
        setRows(valuesData?.bonds ? Object(valuesData.bonds) : []);
      } else {
        if (newText.length === 0) {
          setChange(true);
        } else {
          const results = Object(valuesData?.bonds).filter((row: any) => {
            const noPolicy = `${row.noPolicy}`.trim();
            return noPolicy.toUpperCase().includes(newText.toUpperCase());
          });
          setRows(results);
        }
      }
    } else {
      if (newText === "") {
        setRows([]);
        return;
      }

      if (newText.length === 0) {
        setChange(true);
      } else {
        const restBonds = await bondService.getBondByClientOrPolicyNumber(newText, 2);
        setRows(restBonds.data);
      }
    }
  };

  enum BondStatus {
    PENDIENTE = "PENDIENTE",
  }

  const [formOperationBondPolicyInquiry, setFormOperationBondPolicyInquiry] = React.useState(false);

  const [bondPolicyRow, setBondPolicyRow] = React.useState();
  const toOperationBondPolicyInquiry = (params: any) => {
    setBondPolicyRow(params.row);
    setFormOperationBondPolicyInquiry(true);
  };

  // const getCatalogValueDesc = async (folio: string): Promise<any> => {
  //   return CatalogValueService.getCatalogValueFolio(folio)
  //     .then((typeCurrency) => {
  //       console.log('typeCurrency: ', typeCurrency)
  //       const currencyData = typeCurrency.data;
  //       return currencyData.description;
  //     })
  //     .catch((error) => {
  //       console.error("Error obteniendo la descripción del catálogo:", error);
  //       return "CATALOGO DESCONOCIDO";
  //     });
  // };

  const getPeopleName = async (personID: string): Promise<any> => {
    return PeopleService.getById(personID).then(
      (clientResponse: any) => {
        const clientType = clientResponse.data.typePersonId ? clientResponse.data.typePersonId : '';
        const clientData = clientResponse.data;

        if (clientType === Constants.folioMoralPerson) {
          return (clientData.name)
        }

        return (
          clientData.name +
          " " +
          clientData.lastName +
          " " +
          clientData.maternalLastName
        );
      }
    ).catch((error) => {
      console.error('Error Obteniendo el nombre del cliente. ', error);
      return 'NO NAME';
    });
  };

  const getCompanyName = async (folio: string): Promise<any> => {
    return CompaniesService.getByFolio(folio).then((companyName) => {
      const company = companyName.data;
      return company.corporateName;
    }).catch((error) => {
      console.error('Error Obteniendo nombre de compania. ', error);
      return 'NO COMPANY NAME';
    });
  };

  // const GetCatalogDescription = ({ v_status }: { v_status: string }) => {
  //   const [catalogDescription, setCatalogDescription] = React.useState('');
  //   React.useEffect(() => {
  //     getCatalogValueDesc(v_status)
  //       .then((description) => {
  //         console.log('description: ', description)
  //         setCatalogDescription(description);
  //       })
  //       .catch((error) => {
  //         console.error('Error obteniendo la descripción del catálogo:', error);
  //       });
  //   }, [v_status]);
  //   return <Typography color={ColorGray}>{catalogDescription}</Typography>;
  // };

  const GetBondDebtor = (folio: string) => {
    const [fullName, setFullName] = React.useState('');
    React.useEffect(() => {
      getPeopleName(folio).then((namePerson) => {
        setFullName(namePerson);
      }).catch((error) => {
        console.error('Error Obteniendo el nombre del cliente. ', error);
      });
    }, [folio]);
    return <>{fullName}</>;
  };

  const GetCompanyName = ({ folio }: { folio: string }) => {
    const [corpName, setCorpName] = React.useState('');
    React.useEffect(() => {
      getCompanyName(folio).then((companyName) => {
        setCorpName(companyName);
      }).catch((error) => {
        console.error('Error Obteniendo nombre de compania. ', error);
      });
    }, [folio]);
    return <Typography color={ColorGray}>{corpName}</Typography>;
  };

  const getBeneficiaryGroup = (groupId: string) => {
    if (valuesData?.beneficiaryGroup) {
      const group =  Object(valuesData?.beneficiaryGroup.values ?? []).find((group: CatalogValue) => group.folio === groupId)
      return group ? group.description : '';
    } else {
      return ''
    }
  }

  const getSubBranch = (subBranchFolio: string) => {
    if (valuesData?.subBranchesCatalog) {
      const subBranch = Object(valuesData?.subBranchesCatalog.values ?? []).find((subBranch: any) => subBranch.folio === subBranchFolio)
      return subBranch ? subBranch.description : '';
    } else {
      return ''
    }
  }

  const columns: GridColDef[] = [
    {
      field: "suretyCompany",
      headerName: "Afianzadora",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const folio = params.row.suretyCompany;
        return (
          <>
            <Grid>
              <ListItemButton
                onClick={() => {
                  toOperationBondPolicyInquiry(params);
                }}
              >
                <GetCompanyName folio={folio} />
              </ListItemButton>
            </Grid>
          </>
        );
      }
    },
    {
      field: "noPolicy",
      headerName: "Número de póliza",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "beneficiaryName",
      headerName: "Beneficiario",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography color={ColorGray}>{params.row.beneficiaryName}</Typography>
      },
    },
    {
      field: "debtor",
      headerName: "Fiado",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return <Typography color={ColorGray}>{GetBondDebtor(params.row.debtor)}</Typography>
      },
    },
    {
      field: "group",
      headerName: "Grupo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography color={ColorGray}>{getBeneficiaryGroup(params.row.group)}</Typography>
      },
    },
    {
      field: "branch",
      headerName: "Ramo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const v_status: string = params.row.branch;
        return <Typography color={ColorGray}>{Constants.bondBranchesIndexed[v_status].description}</Typography>
      },
    },
    {
      field: "subBranch",
      headerName: "SubRamo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography color={ColorGray}>{getSubBranch(params.row.subBranch)}</Typography>
      },
    },
    {
      field: "totalAmount",
      headerName: "Monto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography color={ColorGray}>{FormatData.currencyFormat(params.row.totalAmount)}</Typography>
      },
    },
    {
      field: "bondStatusFolio",
      headerName: "Estatus",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const v_status: string = params.row.bondStatusFolio;
        //getCatalogDescription
        return <Typography color={ColorGray}>{Constants.policyStatus[v_status].description}</Typography>
        //return <Typography color={ColorGray}>PENDIENTE</Typography>;
      },
    },
  ];

  const handlePoliciesHistory = async (policyStatus: number) => {
    if (personId) {
      const restPoliciesHistory = await bondService.getBondByClientOrPolicyNumber(personId, policyStatus);
      setRows(restPoliciesHistory.data);

    }else if(searchText){
      const restBonds = await bondService.getBondByClientOrPolicyNumber(searchText, policyStatus);
      setRows(restBonds.data);
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
      {formOperationBondPolicyInquiry ? (
        <ModalOperationBondPolicyInquiry
          data={bondPolicyRow}
          open={formOperationBondPolicyInquiry}
          close={() => setFormOperationBondPolicyInquiry(false)}
        />
      ) : (
        <></>
      )}
      <Title
        title={"Pólizas de fianzas"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: 8 }}>
        <Stack direction="column" spacing={3}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1 }}
            alignItems="center"
          >
            <Grid item xs={12} lg={6}>
              {valuesData?.people ? (
                <Typography sx={TextMediumBoldFont}>
                  {valuesData.people.typePersonId === Constants.folioMoralPerson
                    ? `${valuesData.people.name}`
                    : `${valuesData.people.name}  ${valuesData.people.lastName} ${valuesData.people.maternalLastName}`}
                </Typography>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={12} lg={6} textAlign="center">
              &nbsp;
            </Grid>
            <Grid item xs={12} lg={3} textAlign="center">
              <InputSearch
                value={searchText}
                showClearIcon={showClearIcon}
                handleCancelClick={handleShowClearIcon}
                handleSearchClick={handleSearchClick}
                onChange={handleInputChange}
                placeholder="Buscar"
                sx={{ width: "100%" }}
              >
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              </InputSearch>
            </Grid>
            <Grid item xs={12} lg={5} textAlign="center">
              &nbsp;
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2} textAlign="center">
              <Button variant="contained" onClick={handleNewPolicieClick}>
                <Plus color={ColorWhite} />
                Nueva póliza
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2} textAlign="center">
              <Button
                startIcon={
                  <History color={policyState ? ColorWhite : ColorPink} />
                }
                variant={policyState ? "contained" : "outlined"}
                onClick={() => {
                  setPolicyState(!policyState);
                }}
              >
                Historial
              </Button>
            </Grid>
          </Grid>
          <DataGrid
            loading={loading}
            rows={rows}
            getRowId={(row) => row.folio}
            columns={columns}
            disableRowSelectionOnClick
          />
        </Stack>
      </Paper>
    </>
  );
}
