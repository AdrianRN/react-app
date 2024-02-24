import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from "@mui/x-date-pickers";
import { TextField, styled, IconButton } from "@mui/material";
import React from "react";
import {
  ColorGray,
  ColorGrayDisabled,
  ColorPink,
  ColorPureBlack,
  ColorPureWhite,
  ColorPinkLight,
  ColorGrayLight,
  FontBase,
} from "../../OuiComponents/Theme";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Calendar from "../../OuiComponents/Icons/Calendar";
import { fontFamily, fontStyle } from "@mui/system";
import { normalize } from "node:path/win32";

const BASE_PROPS = {
  width: "360px",
  height: "56px",
  borderRadius: "16px",
  background: ColorPureWhite,
  display: "inline-flex",
  paddingLeft: "0px",
  justifyContent: "flex-end",
  gap: "181px",
};

const CustomContainedDatePicker = styled((props: MuiDatePickerProps<Date>) => (
  <MuiDatePicker
    {...props}
    format="DD/MM/YYYY"
    slots={{
      openPickerIcon: (props) => (
        <IconButton disableRipple>
          <Calendar color={ColorGrayDisabled} />
        </IconButton>
      ),
    }}
    views={["day", "month"]}
    slotProps={{
      textField: {},
      day: {
        sx: {
          "&.MuiPickersDay-root.Mui-selected": {
            backgroundColor: ColorPink,
          },
          ['&[data-mui-date="true"] .Mui-selected']: {
            // Reset the background color of the selected date
            backgroundColor: ColorPink,
          },
          ":not(.Mui-selected)": {
            backgroundColor: "#fff",
            borderColor: ColorPink,
          },
          "&.Mui-selected": {
            color: "#fff",
            backgroundColor: ColorPink,
            borderColor: ColorPink,
            ":hover": {
              color: "#fff",
              backgroundColor: ColorPinkLight,
              borderColor: ColorPinkLight,
            },
          },
          ":hover": {
            color: ColorPureWhite,
            backgroundColor: ColorPinkLight,
            borderColor: ColorPinkLight,
            fontFamily: FontBase,
          },
        },
      },
      popper: {
        sx: {
          "& .MuiPickersMonth-root": {
            "& .MuiPickersMonth-monthButton": {
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: ColorPink,
                borderColor: ColorPink,
                ":hover": {
                  color: "#fff",
                  backgroundColor: ColorPinkLight,
                  borderColor: ColorPinkLight,
                },
              },
              ":hover": {
                color: ColorPureWhite,
                backgroundColor: ColorPinkLight,
                borderColor: ColorPinkLight,
                fontFamily: FontBase,
              },
            },
          },
        },
      },
    }}
  />
))(({ theme }) => ({
  "& .MuiInputBase-root": {
    ...BASE_PROPS,

    "& .MuiOutlinedInput-input": {
      color: ColorGrayDisabled,
      fontSize: "15px",
      fontFeatureSettings: `'clip' off, 'liga' off`,
      fontFamily: FontBase,
      fontWeight: "400",
      lineHeight: "24px",
      letterSpacing: "0.75px",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: ColorGray,
      borderStyle: "solid",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      border: ColorPureBlack,
      borderStyle: "solid",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      border: ColorPureBlack,
      borderStyle: "solid",
      borderWidth: "2px",
    },
    "&.Mui-disabled": {
      opacity: "0.8",
      background: ColorGrayLight,

      "&:hover fieldset": {
        border: "transparent",
      },
      "&.Mui-focused fieldset": {
        border: "transparent",
      },
    },
  },
}));

export default function DatePicker(muiProps: MuiDatePickerProps<Date>) {
  return (
    <>
      <CustomContainedDatePicker {...muiProps} />
    </>
  );
}
