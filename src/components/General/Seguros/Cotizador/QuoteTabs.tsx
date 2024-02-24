import React from 'react'
import { Box } from '../../../OuiComponents/Layout';
import { Paper } from '../../../OuiComponents/Surfaces';
import { Tab, Tabs } from '../../../OuiComponents/Navigation';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { LinkSmallFont } from '../../../OuiComponents/Theme';
import QuoteNoBonus from './QuoteNoBonus';
import QuoteMinPremium from './QuoteMinPremium';
import Title from '../../Title/Title';
import { SIZE_WEB_URL } from '../../../../enviroment/enviroment';

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

function QuoteTabs(props: any) {
    const [tabIndex, setTabIndex] = React.useState(0)
    const [policyFolio, setPolicyFolio] = React.useState<string | undefined>()

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
                <Title style={{paddingTop: "16px", paddingBottom: "24px"}} title={"Cotizaciones"} url={(window.location.href).slice(SIZE_WEB_URL)} />

                <Paper square={false} elevation={8} sx={{ p: 2, borderRadius: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleChange}>
                            <Tab label={<Typography sx={LinkSmallFont}>Sin prima mínima</Typography>} {...a11yProps(0)} />
                            <Tab label={<Typography sx={LinkSmallFont}>Con prima mínima</Typography>} {...a11yProps(0)} />
                        </Tabs>
                    </Box>
                    <Box>
                        <CustomTabPanel value={tabIndex} index={0}>
                            <QuoteNoBonus />
                        </CustomTabPanel >
                        <CustomTabPanel value={tabIndex} index={1}>
                            <QuoteMinPremium />
                        </CustomTabPanel >
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default QuoteTabs