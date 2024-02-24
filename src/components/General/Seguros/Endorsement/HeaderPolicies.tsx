import { Grid, Stack, Box } from "@mui/material";
import React, { useContext } from "react";
import CatalogValue from "../../../../models/CatalogValue";
import Button from "../../../OuiComponents/Inputs/Button";
import { Select, TextField } from "../../../OuiComponents/Inputs";
import {
  Avatar,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import {
  ColorGray2,
  ColorGrayDark,
  ColorGrayLight,
  ColorWhite,
  DisplaySmallBoldFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import Policies from "../../../../insuranceModels/policies";
import CacheService from "../../../../services/cache.service";
import CompaniesService from "../../../../services/companies.service";
import {
  FinanceIcon,
  CarIcon,
  LifeIcon,
  GmIcon,
  DamageIcon,
  SavingIcon,
  InsertPhotoIcon,
} from "../../../OuiComponents/Icons";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { styled } from "@mui/material/styles";
import FormatData from "../../../../utils/Formats.Data";
import ModelCompany from "../../../../models/Company";
import TabModalEndorsement from "./TabModalEndorsement";
import { useParams } from 'react-router-dom';
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Title from "../../Title/Title";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import Constants from "../../../../utils/Constants";

interface HeaderPoliciesData {
  Branchs: CatalogValue;
  InsuranceCompany: any;
}

interface MenuBranche {
  description: string;
  folio: string;
  icon: React.ReactNode;
}

function HeaderPolicies() {
  const { polizaId, clientId } = useParams();
  const [valuesData, setValuesData] = React.useState<HeaderPoliciesData>();
  const [image, setImage] = React.useState<string | null>(null);
  const [menuBranches, setMenuBranches] = React.useState<MenuBranche[]>([]);
  const [insuranceCompany, setInsuranceCompany] =
    React.useState<ModelCompany>();
  const [activeTab, setActiveTab] = React.useState('');
  React.useEffect(() => {

    const fetchData = async () => {
      const restBranches = await CacheService.getByFolioCatalog(Constants.branchesCatalogFolio);
      const restInsuranceCompany = await CompaniesService.getByCompanyType(
        Constants.folioInsuranceCompany
      );
      if (restBranches) {
        setMenuBranches(transformDataBranches(restBranches.data.values));
      }
      setValuesData({
        Branchs: restBranches.data.values,
        InsuranceCompany: restInsuranceCompany.data,
      });
    };
    fetchData();
  }, []);

  function transformDataBranches(branches: any) {
    const transformedData = branches.map((item: any) => ({
      description: transformDescription(item.description),
      folio: item.folio,
      icon: getIconForDescription(item.description),
    }));

    function transformDescription(description: string) {
      if (description === "GASTOS MEDICOS") {
        return "GM";
      } else {
        return (
          description.charAt(0).toUpperCase() +
          description.slice(1).toLowerCase()
        );
      }
    }

    function getIconForDescription(description: string): React.ReactNode {
      switch (description) {
        case "FIANZAS":
          return <FinanceIcon color={ColorWhite} />;
        case "AUTO":
          return <CarIcon color={ColorWhite} />;
        case "VIDA":
          return <LifeIcon color={ColorWhite} />;
        case "GASTOS MEDICOS":
          return <GmIcon color={ColorWhite} />;
        case "DAÑOS":
          return <DamageIcon color={ColorWhite} />;
        case "AHORRO":
          return <SavingIcon color={ColorWhite} />;
        default:
          return null;
      }
    }
    return transformedData;
  }

  const handleInsurance = (event: any) => {
    const currentInsuranceCompany = valuesData?.InsuranceCompany.find(
      (company: any) => company.folio === event.target.value
    );
    setInsuranceCompany(currentInsuranceCompany);
  };

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
    width: "125%",
  }));

  const onClickHandler = (folio: string) => {
    setActiveTab(folio);
  };
  function renderButtons(menuItems: any) {
    return menuItems.map((menuItem: any) => (
      <Item key={menuItem.folio}>
        <Button
          key={menuItem.folio}
          variant="contained"
          fullWidth
          startIcon={menuItem.icon}
          disabled={!insuranceCompany}
          onClick={() => onClickHandler(menuItem.folio)}
        >
          {menuItem.description}
        </Button>
      </Item>
    ));
  }
  function chunkArray(arr: any, chunkSize: number) {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }
  const chunks = chunkArray(menuBranches, 6);
  return (
    <>
      <Title title={"Nuevo Endoso"} url={(window.location.href).slice(SIZE_WEB_URL)} />
      <Paper sx={{ p: '24px', borderRadius: 8 }}>
        <Stack direction="column" spacing={5} sx={{ mb: 2 }}>
          {(!polizaId || clientId !== "0") &&
        
              <Stack display="column" spacing={1}>
                <Box sx={{ pr: 6, pl: 2, pt: 2, pb: 2 }}>
                  <Stack
                    display="column"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Grid
                      container
                      rowSpacing={3}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} sm={6} md={5}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Aseguradora
                          </Typography>
                          <TextField
                          
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box
                          sx={{
                            width: "80%",
                            marginLeft: "50%",
                          }}
                        >
                          {insuranceCompany ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              border="2px dashed #1475cf"
                              height="150px" // Ajusta la altura de la caja
                              width="150px" // Ajusta el ancho de la caja
                              marginLeft="16px"
                              borderRadius={3}
                              sx={{}}
                            >
                              <Avatar
                                src={
                                  image
                                    ? image
                                    : FormatData.getUriLogoCompany(
                                      insuranceCompany.logo
                                    ) ?? ""
                                }
                                variant="rounded"
                                alt={insuranceCompany.logo}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                width: "243px",
                                height: "78px",
                                padding: "24px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                flexShrink: "0",
                                borderRadius: "16px",
                                border: "1px dashed " + ColorGrayLight,
                                background: ColorGray2,
                                marginTop: "20px",
                              }}
                            >
                              <InsertPhotoIcon color={ColorGrayDark} />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>
                <Box sx={{ pr: 6, pl: 2, pt: 0, pb: 0 }}>
                  <Stack display="column" spacing={1}>
                    <Grid
                      container
                      rowSpacing={3}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>Ramos</Typography>
                          {chunks.map((chunk, index) => (
                            <Stack
                              key={index}
                              direction="row"
                              spacing={2}
                              sx={{ width: "40%" }}
                            >
                              {renderButtons(chunk)}
                            </Stack>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>
              </Stack>
          }
          <Box>
            {activeTab === "CAVA-1" && <TabModalEndorsement data={insuranceCompany} folioBranch={activeTab} clientId={clientId} />}
            {polizaId && <TabModalEndorsement dataPolicy={polizaId} />}
          </Box>
        </Stack>
      </Paper>
    </>
  );
}

export default HeaderPolicies;
