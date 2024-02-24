import React from 'react'
import { Box } from '../../../OuiComponents/Layout';
import { Paper } from '../../../OuiComponents/Surfaces';
import { Tab, Tabs } from '../../../OuiComponents/Navigation';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { LinkSmallFont } from '../../../OuiComponents/Theme';
import Title from '../../Title/Title';
import { SIZE_WEB_URL } from '../../../../enviroment/enviroment';
import EndorsementTab from './EndorsementTab';
import { useParams } from 'react-router-dom';

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

function BondEndorsementTabs(props: any) {
    const [tabIndex, setTabIndex] = React.useState(0)
    const { bondFolio, bondEndorsementFolio } = useParams<string>();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <Box paddingBottom={2} paddingTop={2}>
                <Title
                    title={"Registro de endoso"}
                    url={(window.location.href).slice(SIZE_WEB_URL)}
                />
                <Paper square={false} elevation={8} sx={{ p: 4, borderRadius: 4 }}>
                    <EndorsementTab bondFolio={bondFolio} bondEndorsementFolio={bondEndorsementFolio} />
                </Paper>
            </Box>
        </>
    )
}

export default BondEndorsementTabs