import React from 'react';
import Button from '../../../OuiComponents/Inputs/Button';
import { CarIcon, CheckedIcon, DamageIcon, FemaleIcon, GmIcon, LifeIcon, MaleIcon, SavingIcon } from '../../../OuiComponents/Icons';
import { Typography } from '../../../OuiComponents/DataDisplay';
import { ColorWhite, DisplaySmallBoldFont } from '../../../OuiComponents/Theme';

interface SelectedOptionSeguroProps {
  selectedOption: 'Auto' | 'Vida' | 'GM' | 'Danos' | 'Ahorro';
  gender: string;
  isGenderVisible: true | false;
}

const iconMap: Record<SelectedOptionSeguroProps['selectedOption'], React.ReactNode> = {
  'Auto': <CarIcon color={ColorWhite} />,
  'Vida': <LifeIcon color={ColorWhite} />,
  'GM': <GmIcon color={ColorWhite} />,
  'Danos': <DamageIcon color={ColorWhite} />,
  'Ahorro': <SavingIcon color={ColorWhite} />,
};

const genderOptions = [
  { folio: 'CAVA-59', label: 'Masculino', icon: <MaleIcon color={ColorWhite}/> },
  { folio: 'CAVA-60', label: 'Femenino', icon: <FemaleIcon color={ColorWhite}/> },
];

const SelectedOptionSeguro: React.FC<SelectedOptionSeguroProps> = ({ selectedOption, gender, isGenderVisible }) => {
  let selectedGender;
  if(gender !== undefined && isGenderVisible)
  {
    selectedGender = genderOptions.find((option) => option.folio === gender);
  }

  return (
    <>
      <Typography sx={DisplaySmallBoldFont} className="d-flex justify-content-between" style={{ marginBottom: '40px' }}>
        Multicotizador
        <div className="d-flex justify-content-between">
          {selectedOption && (
            <div>
              <Button startIcon={iconMap[selectedOption]} endIcon={<CheckedIcon />} unselectable={'on'}>
                {selectedOption}
              </Button>
            </div>
          )}
          {gender !== undefined && isGenderVisible && selectedGender && (
            <div style={{ marginLeft: '10px' }}>
              <Button startIcon={selectedGender.icon} endIcon={<CheckedIcon />} unselectable={'on'}>
              </Button>
            </div>
          )}
        </div>
      </Typography>
    </>
  );
};

export default SelectedOptionSeguro;

