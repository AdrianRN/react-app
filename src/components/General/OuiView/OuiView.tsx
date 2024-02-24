import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  Select as MuiSelect,
  Switch as MuiSwitch,
} from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import Format from "../../../utils/Formats.Data";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import {
  AddFavorite,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Attached,
  Beneficiary,
  Calculator,
  Calendar,
  Cancel,
  CarIcon,
  Chat,
  Complete,
  DamageIcon,
  Delete,
  Document,
  DocumentComplete,
  DocumentFind,
  Download,
  Edit,
  FemaleIcon,
  Filter,
  FinanceIcon,
  Fire,
  GmIcon,
  History,
  Home,
  InsertPhotoIcon,
  LifeIcon,
  MaleIcon,
  Notification,
  Paste,
  Plus,
  Print,
  Refresh,
  Save,
  SavingIcon,
  Search,
  Share,
  Sort,
  Star,
  Upload,
  View,
} from "../../OuiComponents/Icons";

import {
  Badge,
  Health,
  HealthChip,
  Typography,
} from "../../OuiComponents/DataDisplay";
import { Alert, Snackbar } from "../../OuiComponents/Feedback";
import {
  Autocomplete,
  Button,
  Checkbox,
  DatePicker,
  FormControl,
  InputSearch,
  Markdown,
  Select,
  Switch,
  TextField,
} from "../../OuiComponents/Inputs";

import { Tab, Tabs } from "../../OuiComponents/Navigation";

import { MarkdownViewer } from "../../OuiComponents/Inputs/Markdown";
import { Box, Stack } from "../../OuiComponents/Layout";
import { MenuItem } from "../../OuiComponents/Navigation";
import { Card } from "../../OuiComponents/Surfaces";
import {
  BreadcrumbBoldFont,
  BreadcrumbFont,
  ColorBlue,
  ColorGrayLight,
  ColorGreen,
  ColorOrange,
  ColorPink,
  ColorPureWhite,
  ColorSuccess,
  ColorSuccessLight,
  ColorYellow,
  DisplayMediumBoldFont,
  DisplaySmallBoldFont,
  LinkLargeFont,
  LinkMediumFont,
  LinkSmallFont,
  SideBarItemFont,
  SideBarSelectedItemFont,
  TextMediumFont,
  TextSmallFont,
  TextXSmallBoldFont,
  TextXSmallFont,
} from "../../OuiComponents/Theme";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DataGrid from "../../OuiComponents/DataGrid/DataGrid";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../context/alert-context";
import Email from "../../OuiComponents/Icons/Email";
import CreditCard from "../../OuiComponents/Icons/CreditCard";
import Cloud from "../../OuiComponents/Icons/Cloud";
import PaperClip from "../../OuiComponents/Icons/PaperClip";
import SaveIcon from "../../OuiComponents/Icons/SaveIcon";
import { showToast } from "../../OuiComponents/Feedback/CustomToast";
import { toast } from "react-toastify";
import CheckCircleIconSuccess from "../../Template/Icons/CheckCircleIconSuccess";

export default function OuiView() {
  return (
    <>
      <Box className="w-full h-full p-5" sx={{ backgroundColor: "lightgray" }}>
        <Typography textAlign="center" className="w-full" variant="h1">
          Onesta UI - oui 🥐
        </Typography>

        {/* Health Chip */}
        <HealthChipDemo />
        {/* Health */}
        <HealthDemo />
        {/* Button */}
        <ButtonDemo />

        {/* Switch */}
        <SwitchDemo />

        {/* Checkbox */}
        <CheckboxDemo />

        {/* Text Editor */}
        <TextEditorDemo />

        {/* DataGrid */}
        <DataGridDemo />

        {/* Input */}
        <TextFieldDemo />
        {/* Input  Search*/}
        <InputSearchDemo />

        {/*Select*/}
        <SelectDemo />

        {/*DatePicker*/}
        <DatePickerDemo />
        {/** */}
        <TabsDemo />

        {/* Alert */}
        <AlertDemo />

        {/* Typographies */}
        <TypographyDemo />

        {/* Badges */}
        <BadgeDemo />

        {/* Icons */}
        <IconsDemo />
      </Box>
    </>
  );
}

function TextFieldDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Input - WIP
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <Typography sx={{ ...TextSmallFont, marginLeft: "2px" }}>
            Input Label
          </Typography>
          <TextField defaultValue="Some value" helperText="Some helper text" />
          <Typography sx={TextXSmallFont}>
            ⚠️ Prop Label should be managed on another component
          </Typography>
        </Stack>
      </Card>
    </>
  );
}

function InputSearchDemo() {
  /**Acciones de Search */
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [styleSearch, setStyleSearch] = useState({});

  const handleInputChange = (event: any) => {
    const newText = event.target.value;
    setSearchText(newText);
    setShowClearIcon(newText.length > 0);
  };

  const handleShowClearIcon = () => {
    setSearchText("");
    setShowClearIcon(false);
    setStyleSearch({});
  };

  const handleSearchClick = () => {
    // Aquí puedes realizar la acción de búsqueda utilizando el valor en searchText
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filteredData.length > 0) {
      if (
        filteredData[0].name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        /**Estilo que se debe aplicar cuando exista un success */
        setStyleSearch({
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "2px solid " + ColorSuccess,
            },
            backgroundColor: ColorSuccessLight,
            borderRadius: "16px",
            "& .MuiSvgIcon-root": {
              // Cambia el color del icono aquí
              color: ColorSuccess,
            },
          },
        });
        alert("Encontrado");
      } else {
        setStyleSearch({});
      }
    }
  };

  const data = [
    { id: 1, name: "Carlos" },
    { id: 2, name: "Michael" },
    { id: 3, name: "Quirino" },
    { id: 4, name: "Liz" },
    { id: 5, name: "Marlene" },
  ];

  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Input Search
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          {/* MUI */}
          <Stack spacing={10} direction="row">
            <InputSearch
              value={searchText}
              onChange={handleInputChange}
              showClearIcon={showClearIcon}
              handleCancelClick={handleShowClearIcon}
              handleSearchClick={handleSearchClick}
              placeholder={"Buscar"}
              sx={styleSearch}
            />
            <InputSearch
              disabled={true}
              showClearIcon={false}
              handleCancelClick={() => {}}
              handleSearchClick={() => {}}
              placeholder={"Buscar"}
            />
            <Autocomplete
              disabled={true}
              showClearIcon={false}
              handleCancelClick={() => {}}
              handleSearchClick={() => {}}
              placeholder={"Buscar"}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function DatePickerDemo() {
  /**Acciones de Search */
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ DatePicker
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          {/* MUI */}
          <Stack spacing={10} direction="row">
            <DemoContainer components={["DatePicker"]}>
              <DatePicker />
            </DemoContainer>
            <DatePicker disabled />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function TabsDemo() {
  /**Acciones de Tabs */
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
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Tabs
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          {/* MUI */}
          <Stack spacing={10} direction="row">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} disabled />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function ButtonDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Button
      </Typography>

      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          {/* MUI */}
          <Stack spacing={1} direction="row">
            <MuiButton variant="contained"> Mui Contained</MuiButton>
            <MuiButton variant="contained" disabled>
              Mui Contained Disabled
            </MuiButton>
            <MuiButton variant="outlined"> Mui Outlined</MuiButton>
            <MuiButton variant="outlined" disabled>
              Mui Outlined Disabled
            </MuiButton>
            <MuiButton variant="text"> Mui Text</MuiButton>
            <MuiButton variant="text" disabled>
              Mui Text Disabled
            </MuiButton>
          </Stack>
          {/* OUI */}
          <Stack spacing={1} direction="row">
            <Button variant="contained">Contained</Button>

            <Button variant="contained" disabled>
              Contained Disabled
            </Button>
            <Button variant="outlined"> Outlined</Button>
            <Button variant="outlined" disabled>
              Outlined Disabled
            </Button>
            <Button variant="text">Text</Button>
            <Button variant="text" disabled>
              Text Disabled
            </Button>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function SwitchDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Switch
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <Stack spacing={1} direction="row">
            <MuiSwitch />
            <MuiSwitch />
            <MuiSwitch disabled />
          </Stack>
          <Stack spacing={1} direction="row">
            <Switch />
            <Switch />
            <Switch disabled />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function CheckboxDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Checkbox
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <Stack spacing={1} direction="row">
            <MuiCheckbox></MuiCheckbox>
            <MuiCheckbox></MuiCheckbox>
            <MuiCheckbox disabled></MuiCheckbox>
          </Stack>
          <Stack spacing={1} direction="row">
            <Checkbox></Checkbox>
            <Checkbox></Checkbox>
            <Checkbox disabled></Checkbox>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function SelectDemo() {
  const age = 20;

  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Select
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          {/* MUI */}
          <Stack spacing={10} direction="row">
            <FormControl fullWidth sx={{ width: "120px" }}>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={age}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth sx={{ width: "120px" }}>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={age}
                disabled
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={age}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={age}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </MuiSelect>
            </FormControl>
          </Stack>
          {/* Axen */}
          <Stack spacing={40} direction="row">
            <FormControl fullWidth sx={{ width: "120px" }}>
              <Select value={age} sx={{ width: "325px" }}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                <MenuItem value={40}>forthy</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ width: "120px" }}>
              <Select value={age}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                <MenuItem value={40}>forthy</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function AlertDemo() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  
  const handleSuccess = () => {
    setDataAlert(
      true,
      "success success success success success success success success success success",
      "success",
      autoHideDuration
    );        
  };

  const handleSuccessToast = () => {
    toast.success("success success success success success success success success success success", {
      icon() {
          return <CheckCircleIcon className="successIcon" fontSize="inherit" />
      },
    })
  }

  const handleWarning = () => {
    setDataAlert(true, "mensaje warning", "warning", autoHideDuration);
  };

  const handleWarningToast = () => {    
    toast.warning("mensaje warning", {
      icon() {
        return <ErrorIcon className="warningIcon" fontSize="inherit" />
    },
    })
  };

  const handleError = () => {
    setDataAlert(true, "mensaje error", "error", autoHideDuration);
  };

  const handleErrorToast = () => {
    toast.error("ejemplo toast", {
      icon() {
        return <CancelIcon className="errorIcon" fontSize="inherit" />
      }
    })
  };
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Alert
      </Typography>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={2}>
          <Stack spacing={20} direction="row">
            <Button variant="contained" onClick={handleSuccess}>
              Success
            </Button>
            <Button variant="contained" onClick={handleSuccessToast}>
              Success Toast
            </Button>
            <Button variant="outlined" onClick={handleWarning}>
              Warning
            </Button>
            <Button variant="outlined" onClick={handleWarningToast}>
              Warning Toast
            </Button>
            <Button variant="contained" onClick={handleError}>
              Error
            </Button>
            <Button variant="contained" onClick={handleErrorToast}>
              Error Toast
            </Button>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

function TypographyDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Typography
      </Typography>

      <Card raised className="w-full p-2 mb-3">
        <Stack>
          <Typography sx={DisplaySmallBoldFont}>Display Medium Bold</Typography>
          <Typography sx={{ ...DisplayMediumBoldFont }}>
            Display Medium Bold
          </Typography>

          <Typography sx={LinkSmallFont}>Link Small</Typography>
          <Typography sx={LinkMediumFont}>Link Medium</Typography>
          <Typography sx={LinkLargeFont}>Link Large</Typography>
          <Typography sx={TextXSmallFont}>Text X Small</Typography>
          <Typography sx={TextXSmallBoldFont}>Text X Small Bold</Typography>
          <Typography sx={TextSmallFont}>Text Small</Typography>
          <Typography sx={TextMediumFont}>Text Medium</Typography>
          <Typography
            sx={{
              ...SideBarItemFont,
              backgroundColor: ColorGrayLight,
            }}
          >
            Nav Bar Item
          </Typography>
          <Typography sx={SideBarSelectedItemFont}>
            NavBar Selected Item
          </Typography>
          <Typography sx={BreadcrumbFont}>Breadcrumb</Typography>
          <Typography sx={BreadcrumbBoldFont}>Breadcrumb Bold</Typography>
        </Stack>
      </Card>
    </>
  );
}

function BadgeDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Badge
      </Typography>

      <Card raised className="w-full p-2 mb-3">
        <Stack className="p-2">
          <Badge badgeContent={99}>
            <Notification />
          </Badge>
          <Typography sx={TextXSmallFont}>
            Default limited to 9 Notifications
          </Typography>
        </Stack>
      </Card>
    </>
  );
}

function IconsDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Icons
      </Typography>
      <Card raised className="w-full p-2 mb-3 flex">
        <ArrowDown />
        <View />
        <Sort />
        <Share />
        <Search />
        <Save />
        <Refresh />
        <Print />
        <Plus />
        <Paste />
        <Notification />
        <Home />
        <History />
        <Fire />
        <Filter />
        <Edit />
        <Download />
        <DocumentFind />
        <DocumentComplete />
        <Document />
        <Delete />
        <Complete />
        <Chat />
        <Cancel />
        <Calculator />
        <Attached />
        <ArrowUp />
        <ArrowRight />
        <Calendar />
        <Upload />
        <AddFavorite />
        <Star />
        <FinanceIcon />
        <CarIcon />
        <LifeIcon />
        <GmIcon />
        <DamageIcon />
        <SavingIcon />
        <InsertPhotoIcon />
        <MaleIcon />
        <FemaleIcon />
        <Beneficiary />
        <Email />
        <CreditCard />
        <Cloud />
        <PaperClip />
        <SaveIcon />
      </Card>
    </>
  );
}

function TextEditorDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        👨🏻‍💻 Text Editor
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <Markdown sx={{ width: "500px" }} />
          <MarkdownViewer source="**This is an example of only displaying a message**" />
        </Stack>
      </Card>
    </>
  );
}

function DataGridDemo() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
    },
    {
      field: "age",
      headerName: "Age",
      width: 150,
    },
    {
      field: "fullName",
      headerName: "Full name",
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "country",
      headerName: "Country",
      width: 200,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35, country: "Mexico" },
    {
      id: 2,
      lastName: "Lannister",
      firstName: "Cersei",
      age: 42,
      country: "Mexico",
    },
    {
      id: 3,
      lastName: "Lannister",
      firstName: "Jaime",
      age: 45,
      country: "Mexico",
    },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16, country: "Mexico" },
    {
      id: 5,
      lastName: "Targaryen",
      firstName: "Daenerys",
      age: null,
      country: "Mexico",
    },
  ];

  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        👨🏻‍💻 DataGrid
      </Typography>
      <Card raised className=" p-2 mb-3">
        <Box sx={{ p: 5, mr: 10, ml: 10 }}>
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
        </Box>
      </Card>
    </>
  );
}

function HealthChipDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Health Chip
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <HealthChip color={ColorGreen} label="1" />
          <HealthChip color={ColorOrange} label="1" />
          <HealthChip color={ColorBlue} label="1" />
        </Stack>
      </Card>
    </>
  );
}

function HealthDemo() {
  return (
    <>
      <Typography textAlign="left" variant="h2" className="w-full">
        ✅ Health
      </Typography>
      <Card raised className="w-full p-2 mb-3">
        <Stack spacing={1}>
          <Health
            bgColor={ColorBlue}
            circleColor={ColorPureWhite}
            circleNumber="10"
          />
          <Health
            bgColor={ColorBlue}
            circleColor={ColorPureWhite}
            circleNumber="9"
          />
          <Health
            bgColor={ColorGreen}
            circleColor={ColorPureWhite}
            circleNumber="8"
          />
          <Health
            bgColor={ColorGreen}
            circleColor={ColorPureWhite}
            circleNumber="7"
          />
          <Health
            bgColor={ColorYellow}
            circleColor={ColorPureWhite}
            circleNumber="6"
          />
          <Health
            bgColor={ColorYellow}
            circleColor={ColorPureWhite}
            circleNumber="5"
          />
          <Health
            bgColor={ColorOrange}
            circleColor={ColorPureWhite}
            circleNumber="4"
          />
          <Health
            bgColor={ColorOrange}
            circleColor={ColorPureWhite}
            circleNumber="3"
          />
          <Health
            bgColor={ColorPink}
            circleColor={ColorPureWhite}
            circleNumber="2"
          />
          <Health
            bgColor={ColorPink}
            circleColor={ColorPureWhite}
            circleNumber="1"
          />
        </Stack>
      </Card>
    </>
  );
}
