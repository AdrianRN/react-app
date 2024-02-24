import React from 'react'
import { Box } from '../../../OuiComponents/Layout';
import { Paper } from '../../../OuiComponents/Surfaces';
import { Tab, Tabs } from '../../../OuiComponents/Navigation';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { LinkSmallFont } from '../../../OuiComponents/Theme';
import TabBondPolicy from './TabBondPolicy';
import { useParams } from 'react-router-dom';
import TabReceipts from './TabReceipts';

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

function TabModalBondPolicy(props: any) {
    const [tabIndex, setTabIndex] = React.useState(0)
    const [policyFolio, setPolicyFolio] = React.useState<string | undefined>()
    const { personId } = useParams<string>()

    React.useEffect(() => {
        setPolicyFolio(props.dataPolicy ? props.dataPolicy : policyFolio ?? undefined)
    }, [])

    const handleSavePolicy = (policyFolio: string) => {
        setPolicyFolio(policyFolio)
    }

    const isDisabled = () => {
        if (policyFolio) {
            return false
        } else {
            return true
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <Box paddingBottom={2}>
                <Paper square={false} elevation={8} sx={{ p: 2, borderRadius: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleChange}>
                            <Tab label={<Typography sx={LinkSmallFont}>Datos de la póliza</Typography>} {...a11yProps(0)} />
                            <Tab label={<Typography sx={LinkSmallFont}>Recibos</Typography>} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <Box>
                        <CustomTabPanel value={tabIndex} index={0}>
                            <TabBondPolicy data={props} debtor={personId} onDataChange={handleSavePolicy} />
                        </CustomTabPanel >
                        <CustomTabPanel value={tabIndex} index={1}>
                            <TabReceipts data={props.data}/>
                        </CustomTabPanel >
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default TabModalBondPolicy