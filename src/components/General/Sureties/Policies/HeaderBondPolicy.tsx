import React from 'react'
import { useParams } from 'react-router'
import Title from '../../Title/Title'
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import { Paper } from '../../../OuiComponents/Surfaces'
import { Stack } from '../../../OuiComponents/Layout'
import TabModalBondPolicy from './TabModalBondPolicy'

function HeaderBondPolicy() {
    const { personId, policyId, modifyble } = useParams();
    return (
        <>
            <Title title={"Emisión de fianza"} url={(window.location.href).slice(SIZE_WEB_URL)} />
            <Paper sx={{ p: '24px', borderRadius: 16 }}>
                <Stack direction='column' spacing={1} margin={5}>
                    {policyId ?
                        <TabModalBondPolicy data={{personId,policyId,modifyble}}/>:
                        <TabModalBondPolicy data={personId}/>}
                </Stack>
            </Paper>
        </>
    )
}

export default HeaderBondPolicy