import React from "react";
import {  Dialog  } from "../../../OuiComponents/Feedback";
import { DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Cancel } from "../../../OuiComponents/Icons";
import { Box } from "../../../OuiComponents/Layout";
import { Tab, Tabs } from "../../../OuiComponents/Navigation";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { LinkSmallFont } from "../../../OuiComponents/Theme";
import TabGeneral from "./TabGeneral";
import TabContacts from './TabContact';
import TabAddress from './TabAddress';
import TabFile from "./TabFile";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabModalPerson(props: any) {
  const [open, setOpen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [personFolio, setPersonFolio] = React.useState<string | undefined>();
  const [personNationality, setPersonNationality] = React.useState<string | undefined>();
  const [personTypePersonId, setPersonTypePersonId] = React.useState<string | undefined>();
  const [beneficiary, setBeneficiary] = React.useState<string | undefined>();
  React.useEffect(() => {
    setPersonFolio(props.data ? props.data : personFolio ?? undefined);
    //setPersonNationality(props.nationality ? props.nationality : personNationality ?? undefined);
    setPersonTypePersonId(props.typePersonId ? props.typePersonId : personTypePersonId ?? undefined);
    setOpen(props.open);
    setBeneficiary(props.beneficiary);
  });

  const handleSavePerson = (person: any) => {
    setPersonFolio(person.folio);
    //setPersonNationality(person.nationality);
    setPersonTypePersonId(person.typePersonId)
  };
  const isDisabled = () => {
    if (personFolio) {
      return false;
    } else {
      return true;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >
        <DialogTitle display="flex">
          <IconButton
            onClick={props.close}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Cancel />
          </IconButton>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabIndex} onChange={handleChange}>
              <Tab
                label={
                  <Typography sx={LinkSmallFont}>Datos generales</Typography>
                }
                {...a11yProps(0)}
              />
              <Tab
                disabled={isDisabled()}
                label={<Typography sx={LinkSmallFont}>Contactos</Typography>}
                {...a11yProps(1)}
              />
              <Tab
                disabled={isDisabled()}
                label={<Typography sx={LinkSmallFont}>Direcciones</Typography>}
                {...a11yProps(2)}
              />
              <Tab
                disabled={isDisabled()}
                label={<Typography sx={LinkSmallFont}>Expediente</Typography>}
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box height="75vh">
            <CustomTabPanel value={tabIndex} index={0}>
              <TabGeneral
                data={personFolio}
                onDataChange={handleSavePerson}
                beneficiary = {beneficiary}
              />
            </CustomTabPanel>
            <CustomTabPanel value={tabIndex} index={1}>
              <TabContacts data={personFolio} />
            </CustomTabPanel>
            <CustomTabPanel value={tabIndex} index={2}>
              <TabAddress data={personFolio} />
            </CustomTabPanel>
            <CustomTabPanel value={tabIndex} index={3}>
              <TabFile data={personFolio} /*nationality={personNationality}*/ typePersonId={personTypePersonId} />
            </CustomTabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TabModalPerson;
