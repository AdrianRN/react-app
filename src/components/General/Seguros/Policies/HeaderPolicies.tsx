import { Grid, Stack, Box } from "@mui/material";
import React from "react";
import Button from "../../../OuiComponents/Inputs/Button";
import { Select } from "../../../OuiComponents/Inputs";
import {
  Avatar,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPureWhite,
  ColorWhite,
  LinkLargeFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import CompaniesService from "../../../../services/companies.service";
import {
  FinanceIcon,
  CarIcon,
  LifeIcon,
  GmIcon,
  DamageIcon,
  SavingIcon,
} from "../../../OuiComponents/Icons";
import { MenuItem } from "../../../OuiComponents/Navigation";
import FormatData from "../../../../utils/Formats.Data";
import ModelCompany from "../../../../models/Company";
import TabModalPolicy from "./TabModalPolicy";
import { useParams } from 'react-router-dom';
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Title from "../../Title/Title";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import Constants from "../../../../utils/Constants";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import LifeHealthPolicyTabs from "./LifeHealth/LifeHealthPolicyTabs";
import PoliciyService from "../../../../insuranceServices/policies.service";
import DiversePolicyTabs from "./Diverse/DiversePolicyTabs";
import PersonalAccidents from "../../../OuiComponents/Icons/PersonalAccidents";
interface HeaderPoliciesData {
  insuranceCompany: any;
}

interface companyBranches {
  order: Number,
  branchId: string,
  description: string
}

let nextId = 8;

function HeaderPolicies() {
  const { polizaId, clientId, modifyble } = useParams();
  const [valuesData, setValuesData] = React.useState<HeaderPoliciesData>();
  const [image, setImage] = React.useState<string | null>(null);
  const [insuranceCompany, setInsuranceCompany] = React.useState<ModelCompany>();
  const [companyBranches, setCompanyBanches] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState('');
  const [selectedBranch, setSelectedBranch] = React.useState<string>('');
  const [load, setLoad] = React.useState(true)

  let modifyValueDisabled: boolean = false;
  if (modifyble) {
    if (modifyble === '0') {
      modifyValueDisabled = true;
    } else if (modifyble === '1') {
      modifyValueDisabled = false;
    }
  }

  React.useEffect(() => {
    fetchData();
    fetchDataPolicy()
  }, [load]);

  const fetchData = async () => {
    const restInsuranceCompany = await CompaniesService.getByCompanyType(Constants.folioInsuranceCompany);

    setValuesData({
      insuranceCompany: Object(restInsuranceCompany.data ?? []).filter((c: any) => c.objectStatusId === 1),
    });

    setLoad(false)
  };

  const fetchDataPolicy = async () => {
    const responsePolicyData = polizaId ? await PoliciyService.getPoliciesByFolio(polizaId) : undefined

    if (responsePolicyData && valuesData?.insuranceCompany) {
      handleSelectInsurance(responsePolicyData.data.insuranceId)
      setActiveTab(responsePolicyData.data.branchId);
    }
  };

  const handleSelectInsurance = (folio: any) => {
    const responsecompanyBranches = valuesData?.insuranceCompany.find(
      (company: any) => company.folio === folio
    )

    setInsuranceCompany(responsecompanyBranches);
    fetchBranches(responsecompanyBranches ? responsecompanyBranches.folio : '')
    setActiveTab('')
    setSelectedBranch('')
  };

  const fetchBranches = (folio: any) => {
    setCompanyBanches([])
    CompaniesBranchesService.getByFolioCompany(folio).then((response) => {
      Object(response.data ?? []).map((branch: any) => {
        handleOrderBranches(branch)
      })
    })
  };

  const handleOrderBranches = (branch: any) => {
    let addCompanyBranch: { order: number; branchId: any; description: any; } | null = null

    switch (branch.branchId) {
      case Constants.folioCarBranch:
        addCompanyBranch = { order: 1, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioFleetsBranch:
        addCompanyBranch = { order: 2, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioGroupHealthBranch:
        addCompanyBranch = { order: 4, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioIndividualHealthBranch:
        addCompanyBranch = { order: 5, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioGroupLifeBranch:
        addCompanyBranch = { order: 6, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioIndividualLifeBranch:
        addCompanyBranch = { order: 7, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioPersonalAccidentsBranch:
        addCompanyBranch = { order: 8, branchId: branch.branchId, description: branch.branch.description }
        break;
      case Constants.folioDiverseBranch:
        addCompanyBranch = { order: 3, branchId: branch.branchId, description: branch.branch.description }
        break;
      default:
        addCompanyBranch = { order: nextId++, branchId: branch.branchId, description: branch.branch.description }
        break;
    }

    setCompanyBanches(currentCompanyBranches => [...currentCompanyBranches, addCompanyBranch])
  }

  const onClickHandler = (folio: any) => {
    setActiveTab(folio);

    setSelectedBranch(folio); 
  };

  const getIssueHeader = (polizaId: any): React.ReactNode => {
    return (
      <>
        {polizaId ?
          <></> :
          <Paper sx={{ p: '15px', borderRadius: 8 }}>
            <Stack direction="column" spacing={5}>
              <Box padding={2} width='60%' height='12vh' alignSelf='center'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Stack direction='column' spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Aseguradora
                      </Typography>
                      <Select
                        sx={{ width: "100%" }}
                        onChange={(e) => handleSelectInsurance(e.target.value)}
                        defaultValue={0}
                      >
                        <MenuItem key={0} value={0} disabled>Selecciona</MenuItem>
                        {Object(valuesData?.insuranceCompany ?? []).map(
                          (data: any) => (
                            <MenuItem key={data.folio} value={data.folio}>
                              {data?.corporateName}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} display='flex' alignItems='start' justifyContent='center'>
                    <Box width='30%' height='30%' >
                      <Avatar
                        src={
                          image
                            ? image
                            : insuranceCompany?.logo ? FormatData.getUriLogoCompany(
                              insuranceCompany?.logo
                            ) : ""
                        }
                        variant="rounded"
                        alt={insuranceCompany?.logo}
                        style={{ width: 'auto', height: 'auto' }}
                        imgProps={{
                          sx: {
                            objectFit: 'contain'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box width='60%' height='auto' alignSelf='center' padding={2}>
                {companyBranches ?
                  <>
                    <Typography sx={{ ...LinkLargeFont, mb: 2 }}>
                      Ramos
                    </Typography>
                    <Grid container rowSpacing={1} columnGap={{ md: 3, lg: 2, xl: 1 }} columnSpacing={{ xs: 1 }}>
                      {companyBranches.sort((a: any, b: any) => (a.order > b.order ? 1 : -1)).map((branch: companyBranches) => (
                        <Grid item xs={12} md={4} lg={3} xl={2} key={branch.order.toString()}>
                          <Button 
                          fullWidth 
                          variant={selectedBranch === branch.branchId ? "outlined" : "contained"}
                          startIcon={getIcon(branch.description,selectedBranch === branch.branchId)} 
                          onClick={() => onClickHandler(branch.branchId)}>
                            
                              {branch.description}
                            
                          </Button>
                        </Grid>
                      ))
                      }
                    </Grid>
                  </> : <></>
                }
              </Box>
            </Stack>
          </Paper >
        }
      </>
    )
  }

  const getIssueTab = (folio: string): React.ReactNode => {
    let issueTab = null

    switch (folio) {
      case Constants.folioCarBranch:
        issueTab = <TabModalPolicy data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />
        break;
      case Constants.folioFleetsBranch:
        issueTab = <TabModalPolicy data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />
        break;
      case Constants.folioGroupHealthBranch:
        issueTab = <LifeHealthPolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />;
        break;
      case Constants.folioIndividualHealthBranch:
        issueTab = <LifeHealthPolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />;
        break;
      case Constants.folioGroupLifeBranch:
        issueTab = <LifeHealthPolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />;
        break;
      case Constants.folioIndividualLifeBranch:
        issueTab = <LifeHealthPolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />;
        break;
      case Constants.folioPersonalAccidentsBranch:
        issueTab = <LifeHealthPolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />;
        break;
      case Constants.folioDiverseBranch:
        issueTab = <DiversePolicyTabs data={insuranceCompany} folioBranch={activeTab} clientId={clientId} dataPolicy={polizaId} modifyValueDisabled={modifyValueDisabled} />
        break;
      default:
        issueTab = <></>;
        break;
    }

    return (
      <>
        {issueTab}
      </>
    )
  }

  const getIcon = (description: string,isSelected: boolean): React.ReactNode => {
    let icon = null;
    switch (description.split(' ')[0]) {
      case "FIANZAS":
        icon = <FinanceIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "AUTO":
        icon = <CarIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "FLOTILLAS":
        icon = <CarIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "VIDA":
        icon = <LifeIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "SALUD":
        icon = <GmIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "ACCIDENTES":
        icon = <PersonalAccidents color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "GASTOS":
        icon = <GmIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "DIVERSOS":
        icon = <DamageIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      case "AHORRO":
        icon = <SavingIcon color={isSelected ? ColorPink  : ColorWhite} />;
        break;
      default:
        icon = <></>;
        break;
    }

    return (
      <>
        {icon}
      </>
    )
  }

  return (
    <>
      <Title title={"Emisión de póliza"} url={(window.location.href).slice(SIZE_WEB_URL)} />
      <Stack direction="column" spacing={3}>
        {getIssueHeader(polizaId)}
        {getIssueTab(activeTab)}
      </Stack>
    </>
  );
}

export default HeaderPolicies;
