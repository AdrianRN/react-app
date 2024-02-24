import Constants from '../utils/Constants';
import VehiclePolicy from '../insuranceServices/vehiclepolicy.service';
import DamagePoliciesService from '../insuranceServices/damagePolicies.service';

const getPolicyDone = async (policy: any): Promise<{ message: string, done: boolean } | null> => {
    let result = { message: '', done: false }

    switch (policy.branchId) {
        case (Constants.folioCarBranch):
            const carPolicyResponse = await VehiclePolicy.getVehiclePolicy(policy.folio)

            result = {
                message: Object(carPolicyResponse.data ?? []).length > 0 ?
                    Object(carPolicyResponse.data ?? []).some((vehicle: any) => vehicle.beneficiaryFolio) ?
                        "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                        "Falta asignar beneficiario a vehículo(s)." :
                    "La póliza no tiene vehiculos registrados.",
                done: Object(carPolicyResponse.data ?? []).length > 0 ?
                    Object(carPolicyResponse.data ?? []).some((vehicle: any) => vehicle.beneficiaryFolio) ?
                        true : false : false
            }

            break;
        case (Constants.folioFleetsBranch):
            const fleetPolicyResponse = await VehiclePolicy.getVehiclePolicy(policy.folio)

            result = {
                message: Object(fleetPolicyResponse.data ?? []).length > 0 ?
                    Object(fleetPolicyResponse.data ?? []).some((vehicle: any) => vehicle.beneficiaryFolio) ?
                        "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                        "Falta asignar beneficiario a vehículo(s)." :
                    "La póliza no tiene vehiculos registrados.",
                done: Object(fleetPolicyResponse.data ?? []).length > 0 ?
                    Object(fleetPolicyResponse.data ?? []).some((vehicle: any) => vehicle.beneficiaryFolio) ?
                        true : false : false
            }

            break;
        case (Constants.folioIndividualLifeBranch):
            result = {
                message: Object(policy.personPolicie ?? []).length > 0 ?
                    "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                    "Debe asignar una persona como beneficiario de la póliza para emitir.",
                done: Object(policy.personPolicie ?? []).length > 0 ?
                    true : false
            }

            break;
        case (Constants.folioGroupLifeBranch):
            result = {
                message: Object(policy.personPolicie ?? []).length > 0 ?
                    "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                    "Debe asignar al menos una persona como beneficiario de para emitir.",
                done: Object(policy.personPolicie ?? []).length > 0 ?
                    true : false
            }

            break;
        case (Constants.folioIndividualHealthBranch):
            result = {
                message: Object(policy.personPolicie ?? []).length > 0 ?
                    "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                    "Debe asignar una persona como beneficiario de la póliza para emitir.",
                done: Object(policy.personPolicie ?? []).length > 0 ?
                    true : false
            }

            break;
        case (Constants.folioGroupHealthBranch):
            result = {
                message: Object(policy.personPolicie ?? []).length > 0 ?
                    "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                    "Debe asignar al menos una persona como beneficiario de la póliza para emitir.",
                done: Object(policy.personPolicie ?? []).length > 0 ?
                    true : false
            }

            break;
        case (Constants.folioPersonalAccidentsBranch):
            result = {
                message: Object(policy.personPolicie ?? []).length > 0 ?
                    "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                    "Debe asignar una persona como beneficiario de la póliza para emitir.",
                done: Object(policy.personPolicie ?? []).length > 0 ?
                    true : false
            }

            break;
        case (Constants.folioDiverseBranch):
            const damagePoliciesResponse = await DamagePoliciesService.getDamagePoliciesByPolicy(policy.folio)

            result = {
                message: Object(damagePoliciesResponse?.data ?? []).length > 0 ?
                    policy.coveragePackageFolio ?
                        "¿Los datos requeridos están completos, desea poner el estado de la Póliza a Vigente?" :
                        "La póliza no tiene asignado Paquete a contratar." :
                    "Debe asignar un bien a la póliza para emitir.",
                done: Object(damagePoliciesResponse?.data ?? []).length > 0 ?
                    policy.coveragePackageFolio ?
                        true : false : false
            }

            break;
        default:
            break;
    }

    return result
}

const policyHooks = {
    getPolicyDone
}

export default policyHooks