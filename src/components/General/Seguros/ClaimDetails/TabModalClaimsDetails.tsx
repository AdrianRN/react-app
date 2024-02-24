
import React from "react";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Box from "../../../OuiComponents/Layout/Box";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { DisplaySmallBoldFont, LinkSmallFont } from "../../../OuiComponents/Theme";
import Title from "../../Title/Title";
import { Tab, Tabs } from "../../../OuiComponents/Navigation";
import { Cancel } from "../../../OuiComponents/Icons";
import TabCurrentSummary from "./TabCurrentSummary";
import Dialog from "../../../OuiComponents/Feedback/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import IconButton from "@mui/material/IconButton/IconButton";
import { DialogContent } from "@mui/material";
import Grid from "../../../OuiComponents/Layout/Grid";
import { Stack } from "../../../OuiComponents/Layout";
import Divider from "../../../OuiComponents/DataDisplay/Divider";
import TabClaimsLog from './TabClaimsLog';
import PeopleService from "../../../../services/people.service";
import CompaniesContactService from "../../../../services/companiescontact.service";
import People from "../../../../models/People";
import CompaniesContact from "../../../../models/CompaniesContact";
import TabPersonalInfo from "./TabPersonalInfo";
import TabEmail from "./TabEmail";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanelClaim(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


function TabModalClaimsDetails(props: any) {

  const [tabIndex, setTabIndex] = React.useState(0)
  const [formData, setFormData] = React.useState(props.claimData);
  const [clientid, setclientid] = React.useState(props.clientId);
  const [contact, setContact] = React.useState<CompaniesContact>();

  React.useEffect(() => {
    //console.log(props.claimData);
    setFormData(props.claimData);
    setclientid(props.clientId);

    
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Dialog
        open={props.openTabClaims}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >

        <DialogTitle display="flex" sx={{ pr: 0 }}>
          <IconButton
            onClick={props.closeTabclaim}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Cancel />
          </IconButton>

          <Grid container justifyContent="space-between" alignItems="center" sx={{ pt: 3, pr: 5 }}>
            <Grid item>
              <Typography sx={{ ...LinkSmallFont, }}>
                SINIESTRO
              </Typography>
            </Grid>
          </Grid>

        </DialogTitle>
        <Box sx={{ pl: 2, pr: 5 }}>
          <Divider />
        </Box>
        <DialogContent sx={{ pl: 0, overflowY: 'hidden' }}>
          <Grid container>
            <Grid item xs={2.2}>
              <Box sx={{ mt: 4, pr: 0, pl: 2, borderRight: 1, borderColor: "divider" }}>

                <Tabs value={tabIndex} onChange={handleChange} orientation="vertical">
                  <Tab label={<Typography sx={LinkSmallFont}>Resumen actual</Typography>} {...a11yProps(0)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Datos del cliente</Typography>} {...a11yProps(1)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Correo electronico</Typography>} {...a11yProps(2)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Bitácora</Typography>} {...a11yProps(3)} />
                </Tabs>
              </Box>

            </Grid>
            <Grid item xs={9.8} sx={{ overflowY: 'auto', maxHeight: '70vh' }}>

              <Box sx={{ pl: 0 }}>

                <TabPanelClaim value={tabIndex} index={0}>
                  <TabCurrentSummary data={formData} />
                </TabPanelClaim>

                <TabPanelClaim value={tabIndex} index={1}>
                  <TabPersonalInfo data={clientid}/>
                </TabPanelClaim>

                <TabPanelClaim value={tabIndex} index={2}>
                  <TabEmail  data={clientid} folio={formData.folio}/>
                </TabPanelClaim >

                <TabPanelClaim value={tabIndex} index={3}>
                  <TabClaimsLog data={formData}/>
                </TabPanelClaim>

              </Box>
            </Grid>
          </Grid>
        </DialogContent>

      </Dialog>
    </>
  );
}
export default TabModalClaimsDetails
