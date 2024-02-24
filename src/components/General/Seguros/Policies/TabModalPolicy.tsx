import React from 'react';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { Box } from '../../../OuiComponents/Layout';
import { Tab, Tabs } from '../../../OuiComponents/Navigation';
import { Paper } from '../../../OuiComponents/Surfaces';
import { LinkSmallFont } from '../../../OuiComponents/Theme';
import TabPlanCoverage from './TabPlanCoverage';
import TabReceipts from './TabReceipts';
import TabVehicle from './TabVehicle';
import GeneralDataTab from './GeneralDataTab';
import PolicyService from "../../../../insuranceServices/policies.service";
import Constants from '../../../../utils/Constants';
import FormatData from '../../../../utils/Formats.Data';
import { useFormik } from 'formik';


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

function TabModalPolicy(props: any) {
    const [tabIndex, setTabIndex] = React.useState(0)
    const [policyData, setPolicyData] = React.useState<any>(undefined)
    const [policyFolio, setPolicyFolio] = React.useState<string | undefined>(undefined)
    //console.log(props.modifyble);

    let disabled: boolean = props.modifyValueDisabled;
    React.useEffect(() => {
        if (props.dataPolicy) {
            fetchPolicy(props.dataPolicy)
        }

        var indexChange = localStorage.getItem("indexReceipt")

        setPolicyFolio(props.dataPolicy ?? undefined)

        if (indexChange) {
            setTabIndex(Number(indexChange))
            localStorage.removeItem("indexReceipt");
        }


    }, [])

    const fetchPolicy = async (folio: any) => {
        const responsePolicy = await PolicyService.getPoliciesByFolio(folio)
        setPolicyData(responsePolicy.data)
    }

    const handleSavePolicy = (folio: any) => {
        setPolicyFolio(folio)
        fetchPolicy(folio)
    }

    const isDisabled = () => {
        if (policyFolio) {
            return false
        } else {
            return true
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (tabIndex === 0 && policyFolio) {
            if (values.policyStatusFolio === Constants.statusPendingFolio) {
                submitForm()
            }
        }

        setTabIndex(newValue);
    };

    const handleUpdatePolicy = (field: string, value: any) => {
        setFieldValue(field, value)
    }

    const onSubmit = () => {
        PolicyService.put(values.folio, values)
            .then((response: any) => {
            })
            .catch((e: Error) => {
                console.log(e.message)
            });
    };

    const initialValues = {
        folio: policyData ? policyData.folio : props.dataPolicy ?? policyFolio,
        insuranceId: props.data.folio ?? "",
        insuranceCompany: props.data.corporateName ?? "",
        branchId: props.folioBranch ?? "",
        subBranchId: policyData ? policyData.subBranchId : "",
        noPolicy: policyData ? policyData.noPolicy : "",
        endorsement: policyData ? policyData.endorsement : 0,
        agentNumber: policyData ? policyData.agentNumber : "",
        renewablePolicy: policyData ? policyData.renewablePolicy : true,
        issuanceDate: FormatData.stringDateFormat(policyData ? policyData.issuanceDate : new Date().toString()),
        startValidity: FormatData.stringDateFormat(policyData ? policyData.startValidity : new Date().toString()),
        endValidity: FormatData.stringDateFormat(
            policyData ? policyData.endValidity :
                new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString()
        ),
        currency: policyData ? policyData.currency : "",
        paymentFrequency: policyData ? policyData.paymentFrequency : "",
        paymentMethod: policyData ? policyData.paymentethod : "",
        collectionMethod: policyData ? policyData.collectionMethod : "",
        clientId: policyData ? policyData.clientId : "",
        clientName: policyData ? policyData.clientName : "",
        rfc: policyData ? policyData.rfc : "",
        street: policyData ? policyData.street : "",
        neighborhood: policyData ? policyData.neighborhood : "",
        state: policyData ? policyData.state : 0,
        municipality: policyData ? policyData.municipality : 0,
        locality: policyData ? policyData.locality : 0,
        zip: policyData ? policyData.zip : "",
        country: policyData ? policyData.country : "",
        salesPerson: policyData ? policyData.salesPerson : "",
        coveragePackageFolio: policyData ? policyData.coveragePackageFolio : "",
        groups: policyData ? policyData.groups : "",
        comments: policyData ? policyData.policyData : "",
        netPremium: policyData ? policyData.netPremium : 0,
        settingOne: policyData ? policyData.settingOne : 0,
        settingTwo: policyData ? policyData.settingTwo : 0,
        rights: policyData ? policyData.rights : 0,
        financing: policyData ? policyData.financing : 0,
        iva: policyData ? policyData.iva : 0,
        totalPremium: policyData ? policyData.totalPremium : 0,
        additionalCharge: policyData ? policyData.additionalCharge : 0,
        subtotal: policyData ? policyData.subtotal : 0,
        receipts: policyData ? policyData.receipts : 0,
        commissionPercentage: policyData ? policyData.comssionPercentage : 0,
        policyStatusFolio: policyData ? policyData.policyStatusFolio : Constants.statusPendingFolio,
        policyStatusDescription: policyData ? policyData.policyStatusDescription : Constants.statusPending,
        objectStatusId: policyData ? policyData.objectStatusId : 1,
        concept: policyData ? policyData.concept : "",
        health: policyData ? policyData.health : 0,
        personPolicie: null,
    };

    const {
        values,
        setFieldValue,
        submitForm
    } = useFormik({
        initialValues,
        onSubmit,
        enableReinitialize: true
    });

    return (
        <>
            <Box paddingBottom={2}>
                <Paper square={false} elevation={8} sx={{ p: 2, borderRadius: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleChange}>
                            <Tab label={<Typography sx={LinkSmallFont}>Datos de la póliza</Typography>} {...a11yProps(0)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Datos del auto(s)</Typography>} {...a11yProps(1)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Plan y cobertura</Typography>} {...a11yProps(2)} />
                            <Tab disabled={isDisabled()} label={<Typography sx={LinkSmallFont}>Recibos</Typography>} {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <Box>
                        <CustomTabPanel value={tabIndex} index={0}>
                            <GeneralDataTab data={props} policy={policyFolio} onDataChange={handleSavePolicy} onValueChange={handleUpdatePolicy} onPostPolicy={handleChange} modifyValueDisabled={disabled} />
                        </CustomTabPanel >
                        <CustomTabPanel value={tabIndex} index={1}>
                            <TabVehicle data={policyFolio} modifyValueDisabled={disabled} onDataChange={handleSavePolicy} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={2}>
                            <TabPlanCoverage data={policyFolio} insuranceId={props.data.folio} modifyValueDisabled={disabled} onDataChange={handleSavePolicy} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabIndex} index={3}>
                            <TabReceipts data={policyFolio} modifyValueDisabled={disabled}></TabReceipts>
                        </CustomTabPanel>

                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default TabModalPolicy