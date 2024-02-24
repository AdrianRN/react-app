import React from 'react'
import { Dialog } from '../../../OuiComponents/Feedback'
import { DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Cancel } from '../../../OuiComponents/Icons';
import { Box } from '../../../OuiComponents/Layout';
import { Tab, Tabs } from '../../../OuiComponents/Navigation';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { LinkSmallFont } from '../../../OuiComponents/Theme';
import TabGeneral from './TabGeneral';
import TabContacts from './TabContact';
import TabBranches from './TabBranch';
import TabPortals from './TabPortal';
import TabAddress from './TabAddress';
import TabIssuingCost from './TabIssuingCost';
import Constants from '../../../../utils/Constants';
import TabConditions from './TabConditions';

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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabModalCompany(props: any) {
    const [open, setOpen] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0)
    const [companyFolio, setCompanyFolio] = React.useState<string | undefined>()
    const [companyType, setCompanyType] = React.useState<any>(props.type ?? undefined);

    React.useEffect(() => {
        if(props.data){
            fetchPropsData();
        }
        setOpen(props.open);
    })
    const fetchPropsData = () => {
        setCompanyFolio(props.data ? props.data : companyFolio ?? undefined)
        setCompanyType(props.type ?? undefined);
        
    };
    const handleSaveCompany = (company: {folio:string, type:string}) => {
        if(company.folio!==''){
            setCompanyFolio(company.folio);
            setCompanyType(company.type);
        }
    }

    const isDisabled = () => {
        if (companyFolio) {
            return false
        } else {
            return true
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    const handleCompanyDescription = (status: string) =>{
        setCompanyType((prev:any)=>({folio:prev?.folio??'', description:status}))
    }
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="modal-modal-title"
                fullWidth
                maxWidth='lg'
                PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
            >
                <DialogTitle display='flex'>
                    <IconButton
                        onClick={props.close}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                    >
                        <Cancel />
                    </IconButton>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleChange}>
                            <Tab label={<Typography sx={LinkSmallFont} >Datos generales</Typography>} {...a11yProps(0)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Contactos</Typography>} {...a11yProps(1)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Línea de negocios</Typography>} {...a11yProps(2)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Portales</Typography>} {...a11yProps(3)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Direcciones</Typography>} {...a11yProps(4)} />
                            {//companyType?.description===Constants.typeInsuranceCompany?(
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Gastos y comisiones</Typography>} {...a11yProps(5)} />
                            //):(<></>)
                            }
                            {companyType===Constants.typeSuretyCompany?
                            (<Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Condiciones</Typography>} {...a11yProps(6)} />):(<></>)}
                        </Tabs>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box height='75vh'>
                        <CustomTabPanel value={tabIndex} index={0}>
                            {/*onChange={(params:any)=>handleCompanyDescription(params?.description??companyType.description)}*/}
                            <TabGeneral data={companyFolio} onClose={props.close} onDataChange={handleSaveCompany} onTabContacts={handleChange} />
                        </CustomTabPanel >
                        <CustomTabPanel value={tabIndex} index={1}>
                            <TabContacts data={companyFolio} onClose={props.close} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={2}>
                            <TabBranches data={companyFolio} onClose={props.close} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={3}>
                            <TabPortals data={companyFolio} onClose={props.close}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={4}>
                            <TabAddress data={companyFolio} onClose={props.close}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={5}>
                            <TabIssuingCost data={companyFolio} onClose={props.close}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={6}>
                            <TabConditions data={companyFolio} onClose={props.close}/>
                        </CustomTabPanel>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TabModalCompany