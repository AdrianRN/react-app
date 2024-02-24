import React from "react";
import IVehiclePolicy from "../../../../insuranceModels/vehiclepolicie";
import PolicyService from "../../../../insuranceServices/policies.service";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import Policie from "../../../../models/Policy";
import { endorsementService } from "../../../../services/endorsement.service";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { Box } from "../../../OuiComponents/Layout";
import { Tab, Tabs } from "../../../OuiComponents/Navigation";
import { Paper } from "../../../OuiComponents/Surfaces";
import { LinkSmallFont } from "../../../OuiComponents/Theme";
import TabEndorsement from "./TabEndorsement";
import TabPlanCoverage from "./TabPlanCoverage";
import TabPolicie from "./TabPolicie";
import TabVehicle from "./TabVehicle";
import TabPersonEndo from './TabPersonEndo';
import ReceiptsService from "../../../../services/receipts.service";
import Receipts from "../../../../models/Receipts";
import TabReceipts from "./TabReceipts";
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
function TabModalEndorsement(props: any) {
  const [policyType, setPolicyType] = React.useState({
    vehicle: props.endorsement?.endorsement?.[0]?.policies?.[0]?.vehiclePolicy?.[0]?.vehicleFolio,
    person: props.endorsement?.endorsement?.[0]?.policies?.[0]?.personPolicie?.[0]?.folio,
  });
  const [tabIndex, setTabIndex] = React.useState(0);
  const [EndorsementFolio, setEndorsementFolio] = React.useState<
    any | undefined
  >();
  const [Endorsement, setEndorsement] = React.useState<any | undefined>();
  React.useEffect(() => {
    setEndorsement(props.endorsement);
    if(props.endorsementId)
    { 
      setEndorsementFolio(props.endorsementId);
    }
  }, []);
  const fetchData = async () => {};
  const handleSaveEndorsement = (EndorsementProps: any) => {
    //console.log("Cambio Endoserment", EndorsementProps); 
    setEndorsement(EndorsementProps);
    setPolicyType({
      vehicle: EndorsementProps.endorsement?.[0]?.policies?.[0]?.vehiclePolicy?.[0]?.vehicleFolio,
      person: EndorsementProps.endorsement?.[0]?.policies?.[0]?.personPolicie?.[0]?.folio,
    });
  };
  const endorsementData = () => {};
  const handleTabChange = (index: number) => {setTabIndex(index);};
  const isDisabled = () => {
    if (Endorsement) {
      return false;
    } else {
      return true;
    }
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const vehicleCustomTabPanel = () => {
    return (<><Box>
      <CustomTabPanel value={tabIndex} index={0}>
        <TabEndorsement
          onDataChange={handleSaveEndorsement}
          policyId={props.policyId}
          endorsementId={props.endorsementId ?? undefined}
          endorsement={Endorsement}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <TabPolicie endorsement={Endorsement} 
        onDataChange={handleSaveEndorsement}/>
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        <TabVehicle
          endorsement={Endorsement}
          policyId={props.policyId}
          onDataChange={handleSaveEndorsement}
          tabChange={handleTabChange}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={3}>
        <TabPlanCoverage
          onDataChange={handleSaveEndorsement}
          tabChange={handleTabChange}
          endorsement={Endorsement}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={4}>
        <TabReceipts
          tabChange={handleTabChange}
          endorsement={Endorsement}
        />
      </CustomTabPanel>
    </Box></>);
  };
  const personCustomTabPanel = ()=>{
    return(<Box>
      <CustomTabPanel value={tabIndex} index={0}>
        <TabEndorsement
          onDataChange={handleSaveEndorsement}
          policyId={props.policyId}
          endorsementId={props.endorsementId ?? undefined}
          endorsement={Endorsement}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <TabPolicie endorsement={Endorsement} 
        onDataChange={handleSaveEndorsement}/>
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        <TabPersonEndo 
        onDataChange={handleSaveEndorsement}
        policyId={props.policyId}
        endorsementId={props.endorsementId ?? undefined}
        endorsement={Endorsement}/>
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={3}>
        <TabReceipts
          tabChange={handleTabChange}
          endorsement={Endorsement}
        />
      </CustomTabPanel>
    </Box>);
  };
  const defaultCustomTabPane = ()=>(<Box>
    <CustomTabPanel value={tabIndex} index={0}>
      <TabEndorsement
        onDataChange={handleSaveEndorsement}
        policyId={props.policyId}
        endorsementId={props.endorsementId ?? undefined}
        endorsement={Endorsement}
      />
    </CustomTabPanel>
  </Box>);
  const vehicleTabs = ()=>{
    return (<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs value={tabIndex} onChange={handleChange}>
      <Tab
        label={<Typography sx={LinkSmallFont}>Endoso</Typography>}
        {...a11yProps(0)}
      />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Datos de la póliza</Typography>} {...a11yProps(1)} />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Datos del auto(s)</Typography>} {...a11yProps(2)} />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Plan y cobertura</Typography>} {...a11yProps(3)} />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Recibos</Typography>} {...a11yProps(4)} />
    </Tabs>
  </Box>);
  };
  const personTabs = ()=>{
    return (<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs value={tabIndex} onChange={handleChange}>
      <Tab
        label={<Typography sx={LinkSmallFont}>Endoso</Typography>}
        {...a11yProps(0)}
      />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Datos de la póliza</Typography>} {...a11yProps(1)} />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Datos de persona(s)</Typography>} {...a11yProps(2)} />
      <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Recibos</Typography>} {...a11yProps(3)} />
    </Tabs>
  </Box>);
  };
  const defaultTabs = ()=> (<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
  <Tabs value={tabIndex} onChange={handleChange}>
    <Tab
      label={<Typography sx={LinkSmallFont}>Nuevo Endoso</Typography>}
      {...a11yProps(0)}
    />
  </Tabs>
</Box>);
  return (
    <>
      {(policyType.person || policyType.vehicle) ?
      (<Box paddingBottom={2} paddingTop={2}>
        <Paper square={false} elevation={8} sx={{ p: 2, borderRadius: 4 }}>
            {policyType.vehicle ?
              (vehicleTabs()):(<></>)}

              {policyType.person ?
              (personTabs()):(<></>)}
          <Box>
            {policyType.vehicle ? 
            (vehicleCustomTabPanel()):(<></>)}
            
            { policyType.person ?
            (personCustomTabPanel()):(<></>)}
          </Box>
        </Paper>
      </Box>):(<Box paddingBottom={2} paddingTop={2}>
        <Paper square={false} elevation={8} sx={{ p: 2, borderRadius: 4 }}>
            {defaultTabs()}
          <Box>
            {defaultCustomTabPane()}
          </Box>
        </Paper>
      </Box>)}
    </>
  );
}

export default TabModalEndorsement;
