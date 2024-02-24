import React, { useEffect, useState } from "react";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { ColorPureWhite, TextSmallFont } from "../../../OuiComponents/Theme";
import { Button, Switch } from "../../../OuiComponents/Inputs";
import ModelCompany from "../../../../models/Company";
import ModelCompanyBranches from "../../../../models/CompaniesBranches";
import CompaniesService from "../../../../services/companies.service";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CacheService from "../../../../services/cache.service";
import Constants from "../../../../utils/Constants";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import { Cancel, Complete } from "../../../OuiComponents/Icons";

interface BranchesCompanyFormData {
  Company: ModelCompany;
  CompanyBranches: ModelCompanyBranches[];
  Branches: CacheCatalogValue;
}

function TabBranch(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [valuesData, setValuesData] = useState<BranchesCompanyFormData>();
  const [loadBranches, setLoadBranches] = useState(true);
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({}); // Maintain switch states individually

  useEffect(() => {
    const fetchData = async () => {
      const restCompany = await CompaniesService.getByFolio(props.data);
      const restCompanyBranches =
        await CompaniesBranchesService.getByFolioCompany(props.data);
      const restBranches = await CacheService.getByFolioCatalog(
        Constants.branchesCatalogFolio
      );

      setValuesData({
        Company: restCompany.data ?? [],
        CompanyBranches: restCompanyBranches.data ?? [],
        Branches: restBranches.data ?? [],
      });

      // Initialize switch states
      const initialSwitchStates: Record<string, boolean> = {};
      valuesData?.CompanyBranches.forEach((branch: any) => {
        initialSwitchStates[branch.branchId] = true;
      });
      setSwitchStates(initialSwitchStates);

      setLoadBranches(false);
    };

    fetchData();
  }, [loadBranches]);

  const handleSetBranch = (event: React.ChangeEvent<HTMLInputElement>, branch: any) => {
    const branchId = event.target.value;
    const isChecked = event.target.checked;

    // Update switch state individually
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [branchId]: isChecked,
    }));

    if (isChecked) {
      const postChecked = {
        companyId: props.data,
        branchId: branchId,
        branch: {
          description: branch.description,
          folio: branchId,
          issuingCost: 0,
          commissionPercentage: 0,
          paymentMethods: [
            {
              paymentMethod: 'CAVA-234',
              description: '',
              surcharge: 0
            }
          ]
        }
      };

      CompaniesBranchesService.post(postChecked)
        .then((response: any) => { })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      valuesData?.CompanyBranches.forEach((branch: any) => {
        if (branch.branchId === branchId) {
          CompaniesBranchesService.deleteByFolio(branch.companyBranchFolio)
            .then((response: any) => { })
            .catch((e: Error) => {
              setDataAlert(true, e.message, "error", autoHideDuration);
            });
        }
      });
    }
  };

  const handleComplete = () => {
    //setDataAlert(true, "La configuración de los ramos se guardo con éxito.", "success", autoHideDuration);
    props.onClose(false);
  }

  return (
    <>
      <Box component="form">
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
        {valuesData?.Branches.values ? (
          Object.values(valuesData?.Branches.values).map((branch: any) => (
            <Grid container paddingTop={1} key={branch.folio}>
              {" "}
              {/* Ensure each switch has a unique key */}
              <Grid item xs={12} sm={6} md={5} lg={4} xl={3}>
                <Stack direction="row" spacing={1}>
                  <Typography
                    flexGrow={1}
                    sx={{ ...TextSmallFont, marginLeft: "2px" }}
                  >
                    {branch ? branch.description : ""}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Switch
                      inputProps={{ "aria-label": "ant design" }}
                      value={branch.folio}
                      checked={switchStates[branch.folio] || false}
                      onChange={(event) => handleSetBranch(event, branch)}
                      disabled={
                        valuesData.Company.companyType.description ===
                          Constants.typeSuretyCompany &&
                          branch.description !== Constants.sureties
                          ? true
                          : valuesData.Company.companyType.description ===
                            Constants.typeInsuranceCompany &&
                            branch.description === Constants.sureties
                            ? true
                            : false
                      }
                    />
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={7} />
            </Grid>
          ))
        ) : (
          <></>
        )}
        {valuesData?.Branches.values ?
          <Grid container paddingTop={3}>
            <Grid item xs={12} sm={6} md={5} lg={4} xl={3} textAlign='center' container justifyContent="flex-start">
              <Button
                size="small"
                endIcon={<Cancel color={ColorPureWhite} />}
                onClick={handleComplete}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid> : <></>
        }
      </Box>
    </>
  );
}

export default TabBranch;
