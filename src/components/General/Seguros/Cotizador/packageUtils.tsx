import { Packet } from './MultiCotizador';

export function createPackageKey(packageItem: Packet) {
  return `${packageItem.CotizacionId ?? ''}-${packageItem.VersionId ?? ''}-${packageItem.Type}-${packageItem.Insurer}`;
}

export const formatMoney = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount)
    ? (amount !== 'NaN' && amount !== 'No aplica' ? amount : "0.00") // Replace with a default value or keep the original
    : parsedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
};

export const formatDeductible = (deductible: string) => {
  return deductible.includes('%')
    ? deductible.match(/(\d+)%/)?.[0] ?? "0%" // Extracts the percentage value
    : "No aplica";
};
