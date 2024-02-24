import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import { getCatalogValueById } from "../../../../services/catalog.service";
import Constants from "../../../../utils/Constants";
/**
 * Función asíncrona para obtener los métodos de pago y el gasto de expedición
 * según el branch seleccionado.
 * @param {Object} data - Datos de la poliza para obtener los métodos de pago y gasto de expedición.
 * @returns {Promise<Object>} - Datos de métodos de pago y gasto de expedición.
 */
export default async function fetchBranchPaymentData(dataParams: any): Promise<Object> {
  // Obtener los ramos existentes de la compañía seleccionada COMP-
  const valuesData = await CompaniesBranchesService.getBranchesByCompanyFolio(dataParams.data.folio);
  
  // Indexar el resultado valuesData por branchId para acceder directamente a los branches
  const valuesDataIndex = valuesData.data.reduce((acc: any, el: any) => {
    acc[el.branchId] = el;
    return acc;
  }, {});

  // Obtener el branch correspondiente usando el índice CAVA-
  const branch = valuesDataIndex?.[dataParams.folioBranch]?.branch;

  // Indexar los métodos de pago del branch
  const branchPayment = branch.paymentMethods.reduce((acc: any, el: any) => {
    acc[el.paymentMethod] = el;
    return acc;
  }, {});

  // Obtener el catálogo de todos los métodos de pago existentes CATA-56
  const catalogValues = await getCatalogValueById(Constants.paymentFrequencyCatalogFolio);

  // Indexar los catalogos por folio para acceder directamente a cada uno
  const currentCatalogValues = catalogValues.data.values.reduce((acc: any, el: any) => {
    acc[el.folio] = el;
    return acc;
  }, {});

  // Obtener solo los catálogos que existan en los métodos de pago del branch
  const catalogsBranch = branch.paymentMethods.map((row: any) => {
    const catalog = currentCatalogValues[row.paymentMethod];
    const paymentMethod = branchPayment[row.paymentMethod];

    return {
      folio: catalog.folio,
      description: catalog.description,
      surcharge: paymentMethod.surcharge,
    };
  });

  // Retornar los métodos de pago y el gasto de expedición
  return {
    issuingCost: branch.issuingCost,
    commissionPercentage: branch.commissionPercentage,
    data: catalogsBranch,
  };
}