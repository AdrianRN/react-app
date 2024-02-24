export const PlatformBackgroundColor: string = "#f7f7fc";

// Pallete colors
export const ColorPinkDark: string = "#840A36";
export const ColorGrayDark: string = "#A0A3BD";
export const ColorGrayDark2: string = "#5D6A72";

export const ColorPink: string = "#E5105D";
export const ColorGray: string = "#B7BBBC";
export const ColorOrange: string = "#FF8F15";
export const ColorYellow: string = "#FFCB15";
export const ColorGreen: string = "#37B134";
export const ColorBlue: string = "#3D85C3";
export const ColorGray2: string = "#ECECEC";

export const ColorPinkLight: string = "#FACFDF";
export const ColorGrayLight: string = "#D9DBE9";

export const ColorPinkDisabled: string = "#ED91AB";
export const ColorGrayDisabled: string = "#6E7191";

export const ColorPureWhite: string = "#FFF";
export const ColorWhite: string = "#F9F9FA";
export const ColorPureBlack: string = "#000";

// Feedback colors
export const ColorError: string = "#E40173";
export const ColorErrorLight: string = "#FFE5F2";
export const ColorWarning: string = "#DCC80F";
export const ColorWarningLight: string = "#FEFEE5";
export const ColorInfo: string = "#1976d2";
export const ColorInfoLight: string = "#C7E9FF";
export const ColorSuccess: string = "#00CC67";
export const ColorSuccessLight: string = "#E5FFF2";

export const FontBase: string = "Titillium Web";

// Typography Styles
interface IFont {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  fontStyle: string;
  color: string;
  fontFamily: string;
}

export const DisplaySmallBoldFont: IFont = {
  fontSize: "33px",
  fontWeight: 700,
  lineHeight: "40px" /* 121.212% */,
  letterSpacing: "1px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const DisplayMediumBoldFont: IFont = {
  fontSize: "40px",
  fontWeight: 700,
  lineHeight: "56px" /* 121.212% */,
  letterSpacing: "1px",
  fontStyle: "normal",
  color: ColorOrange,
  fontFamily: FontBase,
};

export const LinkSmallFont: IFont = {
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: "24px" /* 160% */,
  letterSpacing: "0.75px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const LinkXLFont: IFont = {
  fontSize: "30px",
  fontWeight: 700,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorPink,
  fontFamily: FontBase,
};

export const LinkMediumFont: IFont = {
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorPink,
  fontFamily: FontBase,
};

export const LinkLargeFont: IFont = {
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "30px",
  letterSpacing: "0.75px",
  fontStyle: "normal",
  color: ColorOrange,
  fontFamily: FontBase,
};

export const TextXSmallFont: IFont = {
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "0.25px",
  fontStyle: "normal",
  color: ColorGrayDisabled,
  fontFamily: FontBase,
};

export const TextXSmallBoldFont: IFont = {
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "22px",
  letterSpacing: "0.25px",
  fontStyle: "normal",
  color: ColorGrayDisabled,
  fontFamily: FontBase,
};

export const TextSmallFont: IFont = {
  fontSize: "15px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "0.25px",
  fontStyle: "normal",
  color: ColorGrayDisabled,
  fontFamily: FontBase,
};

export const TextSmallBlackFont: IFont = {
  fontSize: "15px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "0.25px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const LinkMediumBoldFont: IFont = {
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const TextMediumBoldWhiteFont: IFont = {
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorWhite,
  fontFamily: FontBase,
};

export const TextMediumPlusFont: IFont = {
  fontSize: "24px",
  fontWeight: 400,
  lineHeight: "28px",
  letterSpacing: "0.75px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const TextMediumFont: IFont = {
  fontSize: "17px",
  fontWeight: 400,
  lineHeight: "28px",
  letterSpacing: "0.75px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const TextMediumBoldFont: IFont = {
  fontSize: "17px",
  fontWeight: 700,
  lineHeight: "28px",
  letterSpacing: "0.75px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

////////////////////////////////////
// Proposals
////////////////////////////////////
export const SideBarItemFont: IFont = {
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorWhite,
  fontFamily: FontBase,
};
export const NavBarItemFont: IFont = {
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "16px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorWhite,
  fontFamily: FontBase,
};

export const SideBarSelectedItemFont: IFont = {
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "22px",
  letterSpacing: "0.25",
  fontStyle: "normal",
  color: ColorGrayDark2,
  fontFamily: FontBase,
};

export const BreadcrumbFont: IFont = {
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "40px",
  letterSpacing: "1px",
  fontStyle: "normal",
  color: ColorPureBlack,
  fontFamily: FontBase,
};

export const BreadcrumbBoldFont: IFont = {
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "40px",
  letterSpacing: "1",
  fontStyle: "normal",
  color: ColorPink,
  fontFamily: FontBase,
};
