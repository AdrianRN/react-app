
import React from "react";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Box from "../../../OuiComponents/Layout/Box";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import { DisplaySmallBoldFont, LinkSmallFont } from "../../../OuiComponents/Theme";
import Title from "../../Title/Title";
import { Tab, Tabs } from "../../../OuiComponents/Navigation";
import { Cancel } from "../../../OuiComponents/Icons";
import TabPersonalInfo from "./TabPersonalInfo";
import TabEmail from "./TabEmail";
import TabCurrentSummary from "./TabCurrentSummary";
import Dialog from "../../../OuiComponents/Feedback/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import IconButton from "@mui/material/IconButton/IconButton";
import { DialogContent } from "@mui/material";
import Grid from "../../../OuiComponents/Layout/Grid";
import { Stack } from "../../../OuiComponents/Layout";
import Divider from "../../../OuiComponents/DataDisplay/Divider";
import TabInsuranceLog from './TabInsuranceLog';
import TabAttachments from "./TabAttachments";
import Receipts from "../../../../models/Receipts";
import TabPayment from "./TabPayment";
import PeopleService from "../../../../services/people.service";
import CompaniesContactService from "../../../../services/companiescontact.service";
import People from "../../../../models/People";
import CompaniesContact from "../../../../models/CompaniesContact";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanelReceipt(props: TabPanelProps) {
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

function TabModalReceiptDetails(props: any) {

  const [tabIndex, setTabIndex] = React.useState(0)
  const [receipt, setReceipt] = React.useState<Receipts>();
  const [personInfo, setPersonInfo] = React.useState<People>();
  const [contact, setContact] = React.useState<CompaniesContact>();



  React.useEffect(() => {

    //fetchData()
    setReceipt(props.receiptDetails)
    

  });

  // const fetchData = async () => {

  //     const person = await PeopleService.getById(props.receiptDetails.clientId)
  //     const contact = await CompaniesContactService.getByFolioPerson(props.receiptDetails.clientId)

  //     setPersonInfo(person.data)
  //     setContact(contact.data)



  // }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Dialog
        open={props.openTabReceipt}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >

        <DialogTitle display="flex" sx={{ pr: 0 }}>
          <IconButton
            onClick={props.closeTabReceipt}
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
                SEGUIMIENTO
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ ...LinkSmallFont }}>
                Recibo:{props.receiptDetails.receiptNumber}
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
                  <Tab label={<Typography sx={LinkSmallFont}>Correo electrónico</Typography>} {...a11yProps(2)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Bitácora</Typography>} {...a11yProps(3)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Adjuntos</Typography>} {...a11yProps(4)} />
                  <Tab label={<Typography sx={LinkSmallFont}>Método de pago</Typography>} {...a11yProps(5)} />
                </Tabs>
              </Box>

            </Grid>
            <Grid item xs={9.8} sx={{ overflowY: 'auto', maxHeight: '70vh' }}>

              <Box sx={{ pl: 0 }}>


                <TabPanelReceipt value={tabIndex} index={0}>
                  <TabCurrentSummary data={receipt} />
                </TabPanelReceipt  >

                <TabPanelReceipt value={tabIndex} index={1}>

                  <TabPersonalInfo personInfo={personInfo} contact={contact} data={receipt} />

                </TabPanelReceipt>

                <TabPanelReceipt value={tabIndex} index={2}>
                  <TabEmail data={receipt} />
                </TabPanelReceipt >

                <TabPanelReceipt value={tabIndex} index={3}>
                  <TabInsuranceLog data={receipt} />
                </TabPanelReceipt >

                <TabPanelReceipt value={tabIndex} index={4}>
                  <TabAttachments data={receipt} />
                </TabPanelReceipt  >

                <TabPanelReceipt value={tabIndex} index={5}>
                  <TabPayment data={receipt} close={props.closeTabReceipt}/>
                </TabPanelReceipt >


              </Box>
            </Grid>
          </Grid>
        </DialogContent>

      </Dialog>
    </>
  );
}
export default TabModalReceiptDetails
