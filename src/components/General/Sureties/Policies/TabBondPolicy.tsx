import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
  Autocomplete,
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  IconButton,
  LinearProgressProps,
  styled,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
//import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as Yup from "yup";
import { useAlertContext } from "../../../../context/alert-context";
import ModelBonds from "../../../../models/Bonds";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import CatalogValue from "../../../../models/CatalogValue";
import ModalCompany from "../../../../models/Company";
import ModelPeople from "../../../../models/People";
import ResultObject from "../../../../models/ResultObject";
import SubBranch from "../../../../models/SubBranch";
import SuretyAddDto from "../../../../models/SuretyAddDto";
import bondService from "../../../../services/bonds.service";
import CacheService from "../../../../services/cache.service";
import catalogValueService from "../../../../services/catalogvalue.service";
import CompaniesService from "../../../../services/companies.service";
import fileStorageService from "../../../../services/fileStorageController.service";
import PeopleService from "../../../../services/people.service";
import { uploadSuretyXmlService } from "../../../../services/policyload.service";
import SubBranchesService from "../../../../services/subbranches.service";
import Constants from "../../../../utils/Constants";
import FormatData from "../../../../utils/Formats.Data";
import {
  Avatar,
  Chip,
  Tooltip,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import { CircularProgress, Dialog, LinearProgress } from "../../../OuiComponents/Feedback";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Complete, Delete, Download } from "../../../OuiComponents/Icons";
import receiptsGenerator from "../../Seguros/Policies/ReceiptsGenerator";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import {
  Button,
  InputAdornment,
  Select,
  TextField,
} from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import {
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
  TextXSmallBoldFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import policySuymary from "../../../../models/PolicySumary";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import { reject, trimEnd } from "lodash";
import { resolve } from "path";

let response: SuretyAddDto;
let responseCatalogCurrency: ResultObject;
let responseCatalogBranches: ResultObject;
let responseCatalogSubBranches: ResultObject;
let responseCatalogGroup: ResultObject;
let responseSuretiesBranch: ResultObject;
let responseBeneficiaryGroup: ResultObject;
let responseSubBranchI: ResultObject;
let responseCatalogTasaIVA: ResultObject;
let responseSuretyCompany: ResultObject;
let responseMaquilaPercentages: ResultObject;
let UUID: any;
let Serie: any;
let Folio: any;
let insuranceCompany: string;

interface HeaderBondPoliciesData {
  suretyCompany: ModalCompany[];
  currencyCatalog: CacheCatalogValue;
  tasaIVACatalog: CacheCatalogValue;
  branchesCatalog: CacheCatalogValue;
  subBranchesCatalog: SubBranch;
  groupsCatalog: CacheCatalogValue;
  projectCatalog: CacheCatalogValue;
  sourceDocumentCatalog: CacheCatalogValue;
  maturityTypeCatalog: CacheCatalogValue;
  statusCatalog: CacheCatalogValue;
  bondData: ModelBonds;
  suretiesBranch: CacheCatalogValue;
  beneficiaryGroup: CacheCatalogValue;
  subBranchI: CacheCatalogValue;
  maquilaPercentages: CacheCatalogValue;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

//Estructura de los archivos POST
type rowsDocumentSourceFile = {
  externalFolio: string; //Nota: Este campo se llamara externalFolio una vez tengamos la poliza
  fileName: string;
  description: string;
  fileExtension: string;
  fileBytes: string;
  containerName: string;
  objectStatusId: number;
};

//Estructura de los archivos GET
type getFilesSourceFile = {
  folio: string;
  externalFolio: string; //Nota: Este campo se llamara externalFolio una vez tengamos la poliza
  fileName: string;
  description: string;
  fileExtension: string;
  fileUrl: string;
  containerName: string;
  objectStatusId: number;
};

function TabBondPolicy(props: any) {
  const bondIDProp = props.data.data ? props.data.data.policyId : undefined; //Obtener el BOND
  const modifyble = props.data.data ? props.data.data.modifyble : undefined;
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [loading, setLoading] = React.useState(false);
  const [waiting, setWaiting] = React.useState(true);
  const [message, setMessage] = React.useState<any>({ edo: '', message: '' });
  const [loadingXml, setLoadingXml] = React.useState(false);
  const [folioBond, setFolioBond] = React.useState<string | null>(
    bondIDProp ?? null
  );
  const [disabledfile, setDisabledFile] = React.useState(true);
  const [confirmContent, setConfirmContent] = React.useState("");
  const [valuesData, setValuesData] = React.useState<HeaderBondPoliciesData>();
  const [suretyCompany, setSuretyCompany] = React.useState<ModalCompany>();
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [valueDebtor, setValueDebtor] = React.useState<any | null>(null);
  const [optionsDebtor, setOptionsDebtor] = React.useState<ModelPeople[]>([]);
  const [loadingDebtor, setLoadingDebtor] = React.useState(false);
  const [subBranch, setSubBranch] = React.useState<CatalogValue[]>([]);
  const [openDebtor, setOpenDebtor] = React.useState(false);
  const [valueBeneficiary, setValuesBeneficiary] = React.useState<any | null>(
    null
  );
  const [optionsBeneficiary, setOptionsBeneficiary] = React.useState<
    ModelPeople[]
  >([]);
  const [loadingBeneficiary, setLoadingBeneficiary] = React.useState(false);
  const [openBeneficiary, setOpenBeneficiary] = React.useState(false);
  const [valueSalesPerson, setValuesSalesPerson] = React.useState<any | null>(
    null
  );
  const [optionsSalesPerson, setOptionsSalesPerson] = React.useState<
    ModelPeople[]
  >([]);
  const [loadingSalesPerson, setLoadingSalesPerson] = React.useState(false);
  const [openSalesPerson, setOpenSalesPerson] = React.useState(false);
  const [iva, setIva] = React.useState<CatalogValue>();
  ///Hook para almacenar los archivos
  const [sourceDocumentFile, setSourceDocumentFile] = React.useState<
    getFilesSourceFile[]
  >([]);
  const [sourceDocumentFileTitle, setSourceDocumentFileTitle] =
    React.useState("");
  const [sourceDocumentFileEnable, setSourceDocumentFileEnable] =
    React.useState(true);
  //Hok para archivos PDFMovimiento, PDFRecibo y Factura Poliza
  const [pdfMovement, setPdfMovement] = React.useState<getFilesSourceFile>();
  const [pdfReceipt, setPdfReceipt] = React.useState<getFilesSourceFile>();
  const [policyInvoice, setPolicyInvoice] = React.useState<getFilesSourceFile>();
  const [open, setOpen] = React.useState(false);
  const [openRegisterPerson, setOpenRegisterPerson] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [disabledXmlData, setDisabledXmlData] = React.useState(false);
  const [disabledDebtor, setDisabledDebtor] = React.useState(false);
  const [folioOTHook, setFolioOTHook] = React.useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress color='inherit' sx={{ color: ColorPink }} variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRegisterPerson = () => {
    setOpenRegisterPerson(false);
  };

  const RegisterPerson = (person: any, data: string, typePersonInd: string) => {
    const currentUrl = window.location.origin;
    let newUrl = `${currentUrl}/index/administracion/personas?openCreatePersonModal=true&beneficiary=${person}`;
    if (data !== '' && typePersonInd !== '') {
      newUrl =
        `${currentUrl}/index/administracion/personas?openEditPersonModal=true&folio=${data}&typePersonId=${typePersonInd}`;
    }
    setPersonFolio('');
    setPersonTypePersonId('');
    window.open(newUrl, "_blank");

    handleCloseRegisterPerson();
  };

  const handleInputPeopleChange = async (name: any, value: any) => {
    setTimeout(async () => {
      if (value) {
        let response = null;

        if (name === "debtor" && !valueDebtor) {
          setOpenDebtor(true);
          setLoadingDebtor(true);
          response = await PeopleService.getDebtorFilterHealt(
            value,
            Constants.amountScoreDebtor
          );
        } else if (name === "beneficiary" && !valueBeneficiary) {
          setOpenBeneficiary(true);
          setLoadingBeneficiary(true);
          response = await PeopleService.getAllByName(value);
        } else {
          if (name === "salesperson" && !valueSalesPerson) {
            setOpenSalesPerson(true);
            setLoadingSalesPerson(true);
            response = await PeopleService.getSellers(value);
          }
        }

        if (response == null) {
          if (name === "debtor") {
            setOptionsDebtor([]);
            setLoadingDebtor(false);
          } else if (name === "beneficiary") {
            setOptionsBeneficiary([]);
            setLoadingBeneficiary(false);
          } else {
            setOptionsSalesPerson([]);
            setLoadingSalesPerson(false);
          }

          return;
        }

        const list = response.data;
        if (list?.length === 0) {
          setDataAlert(
            true,
            "No se encontraron coincidencias, por favor, capture nuevamente.",
            "warning",
            autoHideDuration
          );
        }
        (list?.length > 0 ? list : []).map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const fullName = `${row[column]} `.trim();
              row["name"] = fullName;
              return { field: "name", headerName: "Name" };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });

        //Comentado para resolver muestra de personas morales en aucomplete beneficiario
        //Si el listado es de otro tipo y no cuenta con la propiedad 'name'
        // list.map((row: { [key: string]: any }) => {
        //   if (!row["lastName"]) {
        //     Object.keys(row).map((column) => {
        //       if (
        //         column
        //           .toLowerCase()
        //           .includes((props.name ? props.name : "name").toLowerCase())
        //       ) {
        //         row["name"] = row[column];
        //       }
        //     });
        //   } else {
        //     return;
        //   }
        // });

        if (name === "debtor") {
          setOptionsDebtor(list);
          setLoadingDebtor(false);
        } else if (name === "beneficiary") {
          setOptionsBeneficiary(list);
          setLoadingBeneficiary(false);
        } else {
          setOptionsSalesPerson(list);
          setLoadingSalesPerson(false);
        }
      } else if (name === "salesperson") {
        setOpenSalesPerson(true);
        setLoadingSalesPerson(true);
        const response = await PeopleService.getSellers("");
        let list = response.data;
        if (list?.length === 0) {
          setDataAlert(
            true,
            "No se encontraron coincidencias, por favor, capture nuevamente.",
            "warning",
            autoHideDuration
          );
        }
        (list?.length > 0 ? list : []).map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const fullName = `${row[column]} `.trim();
              row["name"] = fullName;
              return { field: "name", headerName: "Name" };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });
        setOptionsSalesPerson(list);
        setLoadingSalesPerson(false);
      } else {
        if (name === "debtor") {
          setOptionsDebtor([]);
          setLoadingDebtor(false);
        } else if (name === "beneficiary") {
          setOptionsBeneficiary([]);
          setLoadingBeneficiary(false);
        } else {
          setOptionsSalesPerson([]);
          setLoadingSalesPerson(false);
        }
      }
    }, 500);
  };

  const handleIvaChange = (value: any) => {
    setIva(
      Object(valuesData?.tasaIVACatalog.values).find(
        (x: any) => x.folio === value.target.value
      )
    );
    setFieldValue("rateIva", value.target.value);
  };

  React.useEffect(() => {
    fetchData();
  }, [loading]);

  const fetchData = async () => {
    responseSuretyCompany = await CompaniesService.getByCompanyType(
      Constants.folioSuretyCompany
    );
    responseCatalogCurrency = await CacheService.getByFolioCatalog(
      Constants.currencyCatalogFolio
    );
    responseCatalogTasaIVA = await CacheService.getByFolioCatalog(
      Constants.tasaIVACatalogFolio
    );
    responseCatalogBranches = await CacheService.getByFolioCatalog(
      Constants.branchesCatalogFolio
    );
    responseCatalogSubBranches = await SubBranchesService.getByBranch(
      Constants.folioBondBranch
    );
    responseSuretiesBranch = await CacheService.getByFolioCatalog(
      Constants.suretiesCatalogFolio
    );
    responseSubBranchI = await CacheService.getByFolioCatalog(
      Constants.subBranchI
    );
    responseCatalogGroup = await CacheService.getByFolioCatalog(
      Constants.groupsCatalogFolio
    );
    responseBeneficiaryGroup = await CacheService.getByFolioCatalog(
      Constants.beneficiaryGroupFolio
    );
    responseMaquilaPercentages = await CacheService.getByFolioCatalog(
      Constants.maquilaPercentagesCatalogFolio
    );
    const responseCatalogProject = await CacheService.getByFolioCatalog(
      Constants.projectCatalogFolio
    );
    const responseCatalogSourceDocument = await CacheService.getByFolioCatalog(
      Constants.sourceDocumentCatalogFolio
    );
    const responseCatalogMaturityType = await CacheService.getByFolioCatalog(
      Constants.maturityTypeCatalogFolio
    );
    const responseCatalogStatus = await CacheService.getByFolioCatalog(
      Constants.statusCatalogFolio
    );

    const responseSubBranch = await CacheService.getByFolioCatalog(
      Constants.subBranchI
    );

    setSubBranch(responseSubBranch.data.values);


    const responseBond = folioBond //Si existe folio de fianza
      ? await bondService.getByFolio(folioBond) //regresar la fianza.
      : undefined;

    if (responseBond) {
      const debtor = await PeopleService.getById(responseBond.data.debtor);
      setValueDebtor(debtor.data);
      if (responseBond.data.beneficiary) {
        const beneficiary = await PeopleService.getById(
          responseBond.data.beneficiary
        );
        setValuesBeneficiary(beneficiary.data);
      }
      if (responseBond.data.salesperson) {
        const salesPerson = await PeopleService.getById(
          responseBond.data.salesperson
        );
        setValuesSalesPerson(salesPerson.data);
      }
    } else if (props.debtor) {
      const debtor = await PeopleService.getById(props.debtor);
      setValueDebtor(debtor.data);
      setDisabledDebtor(true);
    }

    if (responseBond) {
      //Si existe una fianza
      Object(responseCatalogStatus.data.values) //Buscamos dentro del catalogo de status
        .filter((s: CatalogValue) => s.description === Constants.statusActive)
        .map((status: any) => {
          if (status.folio === responseBond.data.bondStatusFolio) {
            setDisabled(true);
          } else if (modifyble === "0") {
            setDisabled(true);
          }
        });
    }
    //valuesData?.bondData.folioOT
    setValuesData({
      beneficiaryGroup: responseBeneficiaryGroup.data,
      suretiesBranch: responseSuretiesBranch.data,
      subBranchI: responseSubBranchI.data,
      suretyCompany: Object(responseSuretyCompany.data ?? []).filter(
        (s: any) => s.objectStatusId === 1
      ),
      currencyCatalog: responseCatalogCurrency.data,
      tasaIVACatalog: responseCatalogTasaIVA.data,
      branchesCatalog: responseCatalogBranches.data,
      subBranchesCatalog: responseCatalogSubBranches.data,
      groupsCatalog: responseCatalogGroup.data,
      projectCatalog: responseCatalogProject.data,
      sourceDocumentCatalog: responseCatalogSourceDocument.data,
      maturityTypeCatalog: responseCatalogMaturityType.data,
      statusCatalog: responseCatalogStatus.data,
      bondData: responseBond ? responseBond.data : responseBond,
      maquilaPercentages: responseMaquilaPercentages.data
    });
    const bondData = responseBond ? responseBond.data : responseBond;
    if (bondData)
      onHandleChangeCompany(bondData?.suretyCompany ?? '');

    setDisabledFile(folioBond ? false : true);
    setExpanded("DG");
    setLoading(false);
    setWaiting(false);
    if (message.edo !== null && message.message !== null) {
      setDataAlert(
        true,
        message.message,
        message.edo,
        autoHideDuration
      );
      setMessage({ edo: '', message: '' });
    }
    setFolioOTHook(responseBond?.data.folioOT + "");
    createGridFiles(responseBond?.data.folioOT + "");
  };

  const onHandleChangeCompany = async (company: string) => {
    if (company && company !== '') {
      let comission: number = 0;
      const branchData = await CompaniesBranchesService.getBranchesByCompanyFolio(company);
      const indexedBranchData = Object(branchData.data).reduce((acc: any, el: any) => {
        acc[el.branch.folio] = el
        return acc
      }, {});
      if (indexedBranchData) {
        if (indexedBranchData[Constants.folioBondBranch]?.branch?.commissionPercentage) {
          comission = Number(indexedBranchData[Constants.folioBondBranch].branch.commissionPercentage);
        } else if (indexedBranchData[Constants.folioBranchFianza]?.branch?.commissionPercentage) {
          comission = Number(indexedBranchData[Constants.folioBranchFianza].branch.commissionPercentage);
        }
      } else {
        //Compania sin ramos :(
      }
      setFieldValue('commissionPercentage', comission);
    }
  };

  // const handleMovement = async (folio: string) => {
  //   if (folio === "CAVA-306") {
  //     const response = await CacheService.getByFolioCatalog(
  //       Constants.subBranchFidelityBondCatalogFolio
  //     );
  //     setSubBranch(response.data.values);
  //   }
  //   if (folio === "CAVA-309") {
  //     const response = await CacheService.getByFolioCatalog(
  //       Constants.subBranchFidelityBondCatalogFolio
  //     );
  //     setSubBranch(response.data.values);
  //   }
  //   if (folio === "CAVA-312") {
  //     const response = await CacheService.getByFolioCatalog(
  //       Constants.subBranchI
  //     );
  //     setSubBranch(response.data.values);
  //   }
  //   if (folio === "CAVA-315") {
  //     const response = await CacheService.getByFolioCatalog(
  //       Constants.subBranchCreditBondCatalogFolio
  //     );
  //     setSubBranch(response.data.values);
  //   }
  //   if (folio === "CAVA-318") {
  //     const response = await CacheService.getByFolioCatalog(
  //       Constants.subBranchTrustBondCatalogFolio
  //     );
  //     setSubBranch(response.data.values);
  //   }
  // };

  const postProject = (projects: any) => {
    projects.split(",").forEach((value: any) => {
      if (
        !Object(valuesData?.projectCatalog.values ?? []).find(
          (p: CatalogValue) => p.description === value
        )
      ) {
        const project = {
          description: value,
          catalogId: Constants.projectCatalogFolio,
          subcatalog: "",
          objectStatusId: 1,
        };

        catalogValueService.post(project);
      }
    });
  };

  const handleChangeSurety = (folio: any) => {
    setSuretyCompany(valuesData?.suretyCompany.find((s) => s.folio === folio));
    setFieldValue("suretyCompany", folio);
    onHandleChangeCompany(folio ?? '');
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const columns: GridColDef[] = [
    {
      field: "folio",
      headerName: "id",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <Typography sx={TextSmallFont}>{params.row.Id}</Typography>;
      },
    },
    {
      field: "description",
      headerName: "Titulo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.description}</Typography>
        );
      },
    },
    {
      field: "fileName",
      headerName: "Nombre del documento",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>{params.row.fileName}</Typography>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Eliminar
              </Typography>
            }
          >
            <>
              <span>
                <IconButton
                  onClick={() => {
                    fileStorageService
                      .deleteFileStoragebyFolio(params.row.folio)
                      .then(() => {
                        setDataAlert(true, "El documento se ha eliminado con éxito", "success", autoHideDuration);
                        createGridFiles(folioOTHook);
                      });
                  }}
                  disabled={disabled}
                >
                  <Delete color={ColorPink} />
                </IconButton>
              </span>
            </>
          </Tooltip>
          <Tooltip
            title={
              <Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>
                Descargar
              </Typography>
            }
          >
            <span>
              <IconButton onClick={() => handleDownloadFileClick(params)}>
                <Download color={ColorPink} />
              </IconButton>
            </span>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleDownloadFileClick = (params: any) => {
    window.open(params.row.fileUrl, "_blank");
  };

  const createReceipts = async (data: any) => {
    const branch = responseSuretiesBranch.data.values.find(
      (item: { folio: string; description: string }) =>
        item.folio.toLowerCase().includes(data.branch.toLowerCase())
    );
    const group = responseBeneficiaryGroup.data.values.find(
      (item: { folio: string; description: string }) =>
        item.folio.includes(data.group)
    );
    const iva = responseCatalogTasaIVA.data.values.find(
      (item: { folio: string; description: string }) =>
        item.folio.includes(data.rateIva)
    );
    //Aqui obtenemos la compania.
    const company = await CompaniesService.getByFolio(data.suretyCompany);


    const sumary: policySuymary = {
      policyFolio: data.folio,
      createdAt: new Date(data.startCoverage), //Emisión
      startValidity: new Date(data.endExecutionPeriod), //Vigencia De
      endValidity: new Date(data.endCoverage), //Vigencia Hasta
      paymentMethod: "CAVA-234", //data.paymentFrequency, //Pago Anual CATALOG
      netPremium: data.netPremium, //Prima Neta
      additionalCharge: 0, //policy.additionalCharge, //Recargo Monto
      surcharge: 0, //policy.financing,//surcharge, //Recargo %
      iva: Number(iva?.description), //Iva Monto
      rights: data.fees, //Derecho Monto/GastoExpedicion
      settingOne: 0, //policy.settingOne ?? 0,
      settingTwo: 0, //policy.settingTwo ?? 0,
      //compania
      insuranceId: data.suretyCompany,
      insuranceCompany: company?.data?.corporateName ?? '',
      //grupo
      groups: group?.folio, //policyDataHook?.groups,
      groupsDescription: group?.description,
      //cliente
      clientId: data.debtor,
      clientName: data.beneficiaryName,
      //ramo
      branchId: branch?.folio,
      branch: branch?.description, //'',
      totalPremium: data.totalAmount, //Prima Total
      payReceipt: "",
      currency: data.currency,
      policyType: "Fianzas",
      sellerFolio: data.salesperson,

      commissions: data.commissionAmount,//(data.netPremium*(commissionsONESTA??0/100),
      manufacturingFee: data.maquila,
    };
    //console.log('sumary: ',sumary);
    receiptsGenerator(sumary);
  };

  const onSubmit = async (data: ModelBonds) => {
    setWaiting(true);
    data.xmlUrl = response?.xmlUrl;
    data.number = data.number.toString();
    data.iva = Number(data.iva);
    data.beneficiaryName = trimEnd(data.beneficiaryName);
    //console.log(data.beneficiaryName)
    if (folioBond) {
      //si ya existe una fianza y no se esta emitiendo una nueva
      data.uuid = UUID;
      await bondService
        .put(folioBond, data)
        .then(async (response: ResultObject) => {
          if (response.status === 409) {
            setWaiting(false);
            const message =
              "Ya se ha creado una factura con el folio: " + Serie + Folio;
            setDataAlert(true, message, "error", autoHideDuration);
          } else {
            // setDataAlert(
            //   true,
            //   "La fianza se ha actualizado.",
            //   "success",
            //   autoHideDuration
            // );
            setMessage({ edo: "success", message: "La fianza se ha actualizado." })
            postProject(data.project);
            setLoading(true);
            //createReceipts(data);
            //console.log('response.data: ', response.data)
            if (response.data.bondStatusFolio === Constants.statusActiveFolio) {
              createReceipts(response.data);
            }
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    } else {
      await bondService
        .post(data)
        .then((response: ResultObject) => {
          if (response.status === 409) {
          setWaiting(false);
            setDataAlert(
              true,
              response.message ?? "",
              "error",
              autoHideDuration
            );
          } else {
            // setDataAlert(
            //   true,
            //   "La fianza se ha generado.",
            //   "success",
            //   autoHideDuration
            // );
            setMessage({ edo: "success", message: "La fianza se ha generado." })
            postProject(data.project);
            setFolioBond(response.data.folio);
            setLoading(true);
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
        });
    }
    setOpen(false);
    createGridFiles(folioOTHook);
  };

  const handleOpenDialogRegisterBeneficiary = (message: string) => {
    setConfirmContent(message);
    setOpenRegisterPerson(true);
  };

  const handleOpenDialogConfirm = async () => {
    try {
      let fullBeneficiaryName;
      if (valueBeneficiary?.name) {
        fullBeneficiaryName = `${valueBeneficiary.name} ${valueBeneficiary?.lastName} ${valueBeneficiary?.maternalLastName}`;
        setFieldValue("beneficiaryName", fullBeneficiaryName);
      }
      if (folioBond) {
        setConfirmContent(
          policyInvoice && sourceDocumentFile
            ? "Los datos requeridos están completos, ¿Desea poner el estatus de la Póliza a Vigente?"
            : "Tiene archivos pendientes por subir, ¿Desea actualizar la póliza con la información en pantalla?"
        );
        //Validamos sise registraron documentos en la poliza
        //        FACTURA DE LA POLIZA && FACTURA DE RECIBO && DOCUMENTOS FUENTE
        if (policyInvoice && sourceDocumentFile) {
          setFieldValue(
            "bondStatusFolio",
            Object(valuesData?.statusCatalog.values).find(
              (status: any) => status.description === Constants.statusActive
            ).folio
          ); //Pasamos bondStatusFolio a status VIGENTE
        }
        setOpen(true);
      } else {
        submitForm();
      }
    } catch (exception) {
      setDataAlert(
        true,
        "Por favor, complete los campos requeridos.",
        "warning",
        autoHideDuration
      );
    }
  };

  const initialValues: ModelBonds = {
    folio: "",
    folioOT: valuesData?.bondData ? valuesData?.bondData.folioOT : "",
    noPolicy: valuesData?.bondData ? valuesData.bondData.noPolicy : "",
    suretyCompany: valuesData?.bondData
      ? valuesData?.bondData.suretyCompany
      : "",
    debtor: valuesData?.bondData
      ? valuesData?.bondData.debtor
      : props.debtor ?? "",
    beneficiaryName: valuesData?.bondData
      ? valuesData?.bondData.beneficiaryName
      : props.beneficiaryName ?? "",
    currency: valuesData?.bondData ? valuesData?.bondData.currency : "",
    exchangeRate: valuesData?.bondData
      ? valuesData?.bondData.exchangeRate
      : "0",
    branch: valuesData?.bondData ? valuesData?.bondData.branch : "",
    subBranch: valuesData?.bondData ? valuesData?.bondData.subBranch : "",
    salesperson: valuesData?.bondData ? valuesData?.bondData.salesperson : "",
    beneficiary: valuesData?.bondData ? valuesData?.bondData.beneficiary : "",
    rateIva: valuesData?.bondData ? valuesData?.bondData.rateIva : "0",
    relatedTo: valuesData?.bondData ? valuesData?.bondData.relatedTo : "",
    group: valuesData?.bondData ? valuesData?.bondData.group : "",
    project: valuesData?.bondData ? valuesData?.bondData.project : "",
    transactionAmount: valuesData?.bondData
      ? valuesData?.bondData.transactionAmount
      : 0,
    issuanceExpensesBonds: valuesData?.bondData
      ? valuesData?.bondData.issuanceExpensesBonds
      : 0,
    issuanceExpensesReceipt: valuesData?.bondData
      ? valuesData?.bondData.issuanceExpensesReceipt
      : 0,
    investigationExpenses: valuesData?.bondData
      ? valuesData?.bondData.investigationExpenses
      : 0,
    netPremium: valuesData?.bondData ? valuesData?.bondData.netPremium : 0,
    fees: valuesData?.bondData ? valuesData?.bondData.fees : 0,
    commissionPercentage: valuesData?.bondData
      ? valuesData?.bondData.commissionPercentage
      : 0,
    bonus: valuesData?.bondData ? valuesData?.bondData.bonus : 0,
    maquilaPercentage: valuesData?.bondData
      ? Number(valuesData?.bondData.maquilaPercentage)
      : 0,
    tariff: valuesData?.bondData ? valuesData?.bondData.tariff : 0.02,
    bureauExpenses: valuesData?.bondData
      ? valuesData?.bondData.bureauExpenses
      : 0,
    rppExpenses: valuesData?.bondData ? valuesData?.bondData.rppExpenses : 0,
    subtotal: valuesData?.bondData ? valuesData?.bondData.subtotal : 0,
    iva: valuesData?.bondData ? valuesData?.bondData.iva : 0,
    totalAmount: valuesData?.bondData ? valuesData?.bondData.totalAmount : 0,
    commissionAmount: valuesData?.bondData
      ? valuesData?.bondData.commissionAmount
      : 0,
    maquila: valuesData?.bondData ? valuesData?.bondData.maquila : 0,
    startCoverage: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.startCoverage)
      : FormatData.stringDateFormat(new Date().toString()),
    endExecutionPeriod: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.endExecutionPeriod)
      : FormatData.stringDateFormat(new Date().toString()),
    maximumClaim: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.maximumClaim)
      : FormatData.stringDateFormat(
        new Date(new Date().setDate(new Date().getDate() + 180)).toString()
      ),
    applicationDate: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.applicationDate)
      : FormatData.stringDateFormat(new Date().toString()),
    authorizationDate: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.authorizationDate)
      : FormatData.stringDateFormat(new Date().toString()),
    sourceDocument: valuesData?.bondData
      ? valuesData?.bondData.sourceDocument
      : "",
    sourceDocumentType: valuesData?.bondData
      ? valuesData?.bondData.sourceDocumentType
      : "",
    sourceDocumentAmount: valuesData?.bondData
      ? valuesData?.bondData.sourceDocumentAmount
      : 0,
    maturityType: valuesData?.bondData ? valuesData?.bondData.maturityType : "",
    endCoverage: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.endCoverage)
      : FormatData.stringDateFormat(
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toString()
      ),
    issuanceDate: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.issuanceDate)
      : FormatData.stringDateFormat(new Date().toString()),
    statuteLimitationsDate: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.statuteLimitationsDate)
      : FormatData.stringDateFormat(
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 3)
        ).toString()
      ),
    number: valuesData?.bondData ? valuesData?.bondData.number : "",
    sourceDocumentDate: valuesData?.bondData
      ? FormatData.stringDateFormat(valuesData?.bondData.sourceDocumentDate)
      : FormatData.stringDateFormat(new Date().toString()),
    titleSourceDocument: valuesData?.bondData
      ? valuesData?.bondData.titleSourceDocument
      : "",
    bondStatusFolio: valuesData?.statusCatalog
      ? Object(valuesData?.statusCatalog.values).find(
        (status: any) => status.description === Constants.statusPending
      ).folio
      : "",
    objectStatusId: valuesData?.bondData
      ? valuesData?.bondData.objectStatusId
      : 1,
    xmlUrl: valuesData?.bondData ? valuesData?.bondData.xmlUrl : "",
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    submitForm,
    validateForm,
  } = useFormik({
    initialValues,
    validationSchema: folioBond ? (Yup.object({
      suretyCompany: Yup.string().required("Este campo es requerido."),
      debtor: Yup.string().required("Este campo es requerido."),
      beneficiary: Yup.string().required("Este campo es requerido."),
      currency: Yup.string().required("Este campo es requerido."),
      rateIva: Yup.string().required("Este campo es requerido."),
      branch: Yup.string().required("Este campo es requerido."),
      subBranch: Yup.string().required("Este campo es requerido."),
      salesperson: Yup.string().required("Este campo es requerido."),
      relatedTo: Yup.string().required("Este campo es requerido."),
      // group: Yup.string().required("Este campo es requerido."),
      tariff: Yup.number()
        .required("Este campo es requerido")
        .min(0.02, "Debe ser un valor mínimo de .02")
        .max(80, "Debe ser un valor máximo de 80"),
      netPremium: Yup.number().required("Este campo es requerido.").min(.01, "Este campo no puede ir en 0."),
      iva: Yup.number().required("Este campo es requerido.").min(.01, "Este campo no puede ir en 0."),
      totalAmount: Yup.number().required("Este campo es requerido.").min(.01, "Este campo no puede ir en 0."),
    })) : (Yup.object({
      suretyCompany: Yup.string().required("Este campo es requerido."),
      debtor: Yup.string().required("Este campo es requerido."),
      branch: Yup.string().required("Este campo es requerido."),
    })),
    onSubmit,
    enableReinitialize: true,
  });

  function createGridFiles(folioOTArg: string) {
    //Esta funcion se encarga de cargar los archivos a la tabla
    //setSourceDocumentFile( (prevRows) => [...prevRows, file]); folioOTHook
    if (folioBond && folioOTArg) {
      fileStorageService
        .getFileStorageByExternalFolio(folioBond)
        .then((response) => {
          const arrayRowTyped: getFilesSourceFile[] = JSON.parse(
            JSON.stringify(response)
          );
          const arrayValidation = arrayRowTyped.length;

          folioOTArg = "OT-" + folioOTArg;
          const nameFileBond: string = folioOTArg + "-" + "FACTURA_POLIZA";
          const nameFileMovement: string = folioOTArg + "-" + "PDF_MOVIMIENTO";
          const nameFileReceipt: string = folioOTArg + "-" + "PDF_RECIBO";

          if (arrayValidation > 0) {
            //Validando si existe documento de factura de poliza
            try {
              //Obteniendo archivo Factura poliza
              const v_policyInvoice: getFilesSourceFile = JSON.parse(
                JSON.stringify(
                  arrayRowTyped.filter((register) =>
                    register.fileName.startsWith(nameFileBond)
                  )
                ).replace(/\[|\]/g, "")
              );
              if (v_policyInvoice) setPolicyInvoice(v_policyInvoice);
            } catch (ecveption) { }
            try {
              //Obteniendo archivo PDF Movimiento
              const v_policyMovement: getFilesSourceFile = JSON.parse(
                JSON.stringify(
                  arrayRowTyped.filter((register) =>
                    register.fileName.startsWith(nameFileMovement)
                  )
                ).replace(/\[|\]/g, "")
              );
              if (v_policyMovement) setPdfMovement(v_policyMovement);
            } catch (ecveption) { }
            try {
              //Validando si existe PDF Recibo
              const v_policyReceipt: getFilesSourceFile = JSON.parse(
                JSON.stringify(
                  arrayRowTyped.filter((register) =>
                    register.fileName.startsWith(nameFileReceipt)
                  )
                ).replace(/\[|\]/g, "")
              );
              if (v_policyReceipt) setPdfReceipt(v_policyReceipt);
            } catch (exception) {
              console.error(exception);
            }
            try {
              //Guardando documentos ajenos a factura y recibo
              const arrayRowsSourceDocument = arrayRowTyped.filter(
                (register) => {
                  return (
                    !register.fileName.startsWith(nameFileBond) &&
                    !register.fileName.startsWith(nameFileMovement) &&
                    !register.fileName.startsWith(nameFileReceipt)
                  );
                }
              );
              setSourceDocumentFile(arrayRowsSourceDocument);
            } catch (exception) { }
          }
        })
        .catch((exception) => {
          console.error(exception);
        });
    }
  }

  const [response, setResponse] = useState<SuretyAddDto | undefined>(undefined);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoadingXml(true);
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      setUploadedFileName(selectedFile.name);
      try {
        const { name, content } = await getContentInBytes(selectedFile);
        //console.log(insuranceCompany);
        const responseApi = await uploadSuretyXmlService(
          insuranceCompany,
          content
        );
        setTimeout(() => {
          setResponse(responseApi);
          setLoadingXml(false);
        }, 1000);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    }
  };
  useEffect(() => {
    const fetchSalesPersonData = async () => {
      setOpenSalesPerson(true);
      setLoadingSalesPerson(true);
      const response = await PeopleService.getSellers("");
      let list = response.data;
      if (list?.length === 0) {
        setDataAlert(
          true,
          "No se encontraron coincidencias, por favor, capture nuevamente.",
          "warning",
          autoHideDuration
        );
      }
      (list?.length > 0 ? list : []).map((row: { [key: string]: any }) => {
        const columns = Object.keys(row).map((column) => {
          if (column === "name") {
            const fullName = `${row[column]} `.trim();
            row["name"] = fullName;
            return { field: "name", headerName: "Name" };
          }
          return { field: column, headerName: column };
        });
        return columns;
      });
      setOptionsSalesPerson(list);
      setLoadingSalesPerson(false);
    };
    fetchSalesPersonData(); //Esta funcion llena de inicio a los vendedores
  }, []);

  const [personToAdd, setPersonToAdd] = React.useState('');
  //Este hook sirve para abrir el modal de personas
  //const [showFormPersons, setFormPersons] = React.useState(false);
  const [personFolio, setPersonFolio] = React.useState<string>('');
  const [personTypePersonId, setPersonTypePersonId] = React.useState<string>('');
  //const [beneficiary, setBeneficiary] = React.useState<String | null>();


  useEffect(() => {
    if (response) {
      validatePeople();
    } else {
      validateForm();
    }
  }, [response]);

  useEffect(() => {
    validateForm();
    setFieldValue("debtor", valueDebtor?.folio ?? "");
  }, [valueDebtor]);

  const validatePeople = () => {

    //console.log(response)
    if (response?.numeroCompaniaAfianzadora !== undefined) {

      //console.log('responseHook',response)
      //Si las personas estan registradas:
      if (response?.fiadoPerson?.folio) {
        if (Number(response?.fiadoScore ?? 0) >= 8) {
          setValueDebtor(response?.fiadoPerson);
        }
        //Si el fiado esta registrado pero no cumple con el score mayor o igual a 80
        else if (response?.fiadoRegistrado === true && Number(response?.fiadoScore ?? 0) < 80) {
          setDataAlert(
            true,
            "El fiado no cuenta con el expediente completo para emitir una fianza. ¿Desea editar la persona?",
            "warning",
            autoHideDuration
          );
          // setFormPersons(true);
          setValueDebtor(response?.fiadoPerson);
          setPersonToAdd(response?.fiado ?? '');
          setPersonFolio(response?.fiadoPerson?.folio ?? '');
          setPersonTypePersonId(response?.fiadoPerson?.typePersonId ?? '');
          handleOpenDialogRegisterBeneficiary('El fiado no cuenta con el expediente completo para emitir una fianza. ¿Desea editar la persona?');
          // setBeneficiary(null);
        }
      }
      if (response?.beneficiarioPerson?.folio) {
        setValuesBeneficiary(response?.beneficiarioPerson);
        setFieldValue("beneficiary", response?.beneficiarioPerson?.folio)
      }

      //Si las personas no estan registradas
      if (response?.beneficiarioRegistrado === false) {
        setDataAlert(
          true,
          "El beneficiario no se encuentra registrado",
          "warning",
          autoHideDuration
        );
        setPersonToAdd(response?.beneficiario ?? '');
        handleOpenDialogRegisterBeneficiary('¿Desea registrar al beneficiario?');
      }

      if (response?.fiadoRegistrado === false) {
        setDataAlert(
          true,
          "El fiado no se encuentra registrado",
          "warning",
          autoHideDuration
        );
        setPersonToAdd(response?.fiado ?? '');
        handleOpenDialogRegisterBeneficiary('¿Desea registrar al fiado?');
      }

      manageXMLData();
    }
    else {
      setDataAlert(
        true,
        "Formato de archivo incorrecto.",
        "error",
        autoHideDuration
      );
    }
  };


  const manageXMLData = async () => {
    setFieldValue("suretyCompany", 0)
    const insuranceCompanies = responseSuretyCompany?.data;
    if (response?.numeroCompaniaAfianzadora) {
      let found = false;
      Object(insuranceCompanies ?? []).map((company: any) => {
        if (company.companyNumber) {
          if (response?.numeroCompaniaAfianzadora?.toUpperCase() === company.companyNumber.toUpperCase()) {
            setFieldValue("suretyCompany", company.folio)
            found = true;
          }
          else if (found === false) {
            setFieldValue("suretyCompany", null)
          }
        }
      });
    }

    setFieldValue("noPolicy", response?.noPoliza != null ? response?.noPoliza : null);

    if (response?.moneda !== undefined) {
      const currency = response.moneda;

      const currencyValue = responseCatalogCurrency.data.values.find(
        (item: { folio: string; description: string }) =>
          item.description.toLowerCase() === currency.toLowerCase()
      );

      if (!currencyValue) {
        setFieldValue("currency", null);
      }
      else {
        const folio = currencyValue.folio;
        setFieldValue("currency", folio);
      }
    }

    if (response?.ramo !== undefined) {
      const ramo = response.ramo;
      const item = responseSuretiesBranch.data.values.find(
        (item: { folio: string; description: string }) =>
          item.description.toLowerCase().includes(ramo.toLowerCase())
      );
      if (item !== undefined) {
        setFieldValue("branch", item.folio);
        //handleMovement(item.folio);
      }
    }

    // if (response?.grupo !== undefined) {
    //   const grupo = response.grupo;
    //   const item = responseCatalogGroup.data.values.find(
    //     (item: { folio: string; description: string }) =>
    //       item.description.toLowerCase() === grupo.toLowerCase()
    //   );
    //   if (item !== undefined) {
    //     setFieldValue("group", item.folio);
    //   }
    //   else {
    //     setFieldValue("group", null);
    //   }
    // }
    // else {
    //   setFieldValue("group", null);
    // }

    if (response?.subRamo !== undefined) {

      responseSubBranchI = await CacheService.getByFolioCatalog(
        Constants.subBranchI
      );

      setSubBranch(responseSubBranchI.data.values)

      const subramo = response.subRamo;
      const item = responseSubBranchI.data.values.find(
        (item: { folio: string; description: string }) =>
          item.description.toLowerCase().includes(subramo.toLowerCase())
      );
      if (item !== undefined) {
        setFieldValue("subBranch", item.folio);
      }
    }

    setFieldValue("transactionAmount", response?.montoMovimiento ?? 0.0);
    setFieldValue("tariff", response?.tarifa ?? 0.0);
    //setFieldValue("issuanceExpensesBonds", response?.gastosExpedicion ?? 0.0);
    setFieldValue("bureauExpenses", response?.gastosBuro ?? 0.0);
    setFieldValue(
      "investigationExpenses",
      response?.gastosInvestigacion ?? 0.0
    );
    setFieldValue("rppExpenses", response?.gastosRPP ?? 0.0);
    setFieldValue("netPremium", response?.primaNeta ?? 0.0);
    setFieldValue("subtotal", response?.subtotal ?? 0.0);
    setFieldValue("fees", response?.derechos ?? 0.0);
    setFieldValue("issuanceExpensesReceipt", response?.gastosExpedicion ?? 0.0);
    setFieldValue("commissionPercentage", response?.comision ?? 0.0);
    setFieldValue("commissionAmount", response?.importeComision ?? 0.0);
    setFieldValue("bonus", response?.bono ?? 0.0);
    //setFieldValue("maquilaPercentage", response?.maquila ?? 0.0);
    //setFieldValue("maquilaAmount", response?.importeMaquila ?? 0.0);

    if (
      response &&
      response.iva &&
      response.subtotal != null &&
      response &&
      response.iva &&
      response.subtotal !== undefined
    ) {
      let iva = Math.ceil((response.iva / response.subtotal) * 100);

      const item = responseCatalogTasaIVA.data.values.find(
        (item: { folio: string; description: string }) =>
          item.description.toLowerCase() === iva.toString()
      );

      if (item !== undefined) {
        setFieldValue("rateIva", item.folio);
        setFieldValue("iva", response.iva);
      }
    }
    if (
      response &&
      response.inicioVigencia !== undefined &&
      response.inicioVigencia.toString() !== "0001-01-01T00:00:00"
    ) {
      const inicioVigencia = format(
        new Date(response.inicioVigencia),
        "yyyy-MM-dd"
      );
      setFieldValue("startCoverage", inicioVigencia);
    }

    if (
      response &&
      response.finVigencia !== undefined &&
      response.finVigencia.toString() !== "0001-01-01T00:00:00"
    ) {
      const finVigencia = format(new Date(response.finVigencia), "yyyy-MM-dd");
      setFieldValue("endCoverage", finVigencia);
    }
    if (
      response &&
      response.fechaFinPlazoEjecucion !== undefined &&
      response.fechaFinPlazoEjecucion.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaFinPlazoEjecucion),
        "yyyy-MM-dd"
      );
      setFieldValue("endExecutionPeriod", formattedDate);
    }

    if (
      response &&
      response.fechaEmision !== undefined &&
      response.fechaEmision.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaEmision),
        "yyyy-MM-dd"
      );
      setFieldValue("issuanceDate", formattedDate);
    }

    if (
      response &&
      response.fechaSolicitud !== undefined &&
      response.fechaSolicitud.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaSolicitud),
        "yyyy-MM-dd"
      );
      setFieldValue("applicationDate", formattedDate);
    }

    if (
      response &&
      response.fechaAutorizacion !== undefined &&
      response.fechaAutorizacion.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaAutorizacion),
        "yyyy-MM-dd"
      );
      setFieldValue("authorizationDate", formattedDate);
    }

    if (
      response &&
      response.fechaMaxReclamacion !== undefined &&
      response.fechaMaxReclamacion.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaMaxReclamacion),
        "yyyy-MM-dd"
      );
      setFieldValue("maximumClaim", formattedDate);
    }

    if (
      response &&
      response.fechaInscripcion !== undefined &&
      response.fechaInscripcion.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaInscripcion),
        "yyyy-MM-dd"
      );
      setFieldValue("statuteLimitationsDate", formattedDate);
    }

    setFieldValue("number", response?.numero ?? 0);
    setFieldValue(
      "sourceDocumentAmount",
      response?.montoDocumentoFuente ?? 0.0
    );

    if (
      response &&
      response.fechaDocumentoFuente !== undefined &&
      response.fechaDocumentoFuente.toString() !== "0001-01-01T00:00:00"
    ) {
      const formattedDate = format(
        new Date(response.fechaDocumentoFuente),
        "yyyy-MM-dd"
      );
      setFieldValue("sourceDocumentDate", formattedDate);
    }

    setDisabledXmlData(true);

  };
  // // Referencia a un timeout
  // const debounceTimeoutRef =  useRef<NodeJS.Timeout | undefined>();

  // // Función debounced para gestionar el tiempo de espera
  // const debounce = (func: () => void, delay: number) => {
  //   clearTimeout(debounceTimeoutRef.current);
  //   debounceTimeoutRef.current = setTimeout(func, delay);
  // };
  // // Función manejadora de cambios con debouncing
  // const handleInputChangeMaximumClaim = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   // Llamar a manageMaximumClaim con debouncing
  //   debounce(() => manageMaximumClaim(e), 1000);
  // };
  //Este metodo se asegura de que la fecha maxima de reclamacion no sea mayor a 180 dias
  const manageMaximumClaim = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const maximumClaim = new Date(e.target.value);
    const endExecutionPeriod = new Date(values.endExecutionPeriod);

    const timeDifferenceInMilliseconds =
      maximumClaim.getTime() - endExecutionPeriod.getTime();
    const daysDifference = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (daysDifference > 180) {
      //console.log('Hay más de 180 días de diferencia entre las fechas.',daysDifference);
      setDataAlert(
        true,
        "Hay más de 180 días de diferencia entre las fechas.",
        "error",
        autoHideDuration
      );
    } else if (daysDifference < 1) {
      //console.log('La fecha máxima de reclamación no debe ser anterior a la fecha de finalización del plazo de ejecución.',daysDifference);
      setDataAlert(
        true,
        "La fecha máxima de reclamación no debe ser anterior a la fecha de finalización del plazo de ejecución.",
        "error",
        autoHideDuration
      );
    } else {
      //console.log('Hay menos de 180 días de diferencia entre las fechas.',daysDifference);
      //setDataAlert(true, 'Hay menos de 180 días de diferencia entre las fechas.', "success", autoHideDuration);
      handleChange(e);
    }
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={3}>
          <Box>
            <Accordion
              expanded={expanded === "DG"}
              onChange={handleAccordionChange("DG")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>
                  DATOS GENERALES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  {modifyble !== '0' && disabled !== true ? (<>
                    <Box
                      width={"100%"}
                      display="flex"
                      flexDirection="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      paddingTop={{ xs: "30px" }}
                      paddingLeft={{ xs: "8px", sm: "16px" }}
                      paddingBottom={{ sm: "10px", md: "0px" }}
                    >
                      <Grid item xs={12} sm={6} md={2} alignSelf="center">
                        <Typography sx={{ ...TextSmallFont }}>
                          CARGAR XML
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} alignSelf="center">
                        <Box
                          flexGrow={1}
                          flexBasis={0}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            border="2px dashed #1475cf"
                            height="100%"
                            width="100%"
                            borderRadius={3}
                            sx={{
                              cursor: "pointer",
                              position: "relative", // Ensure relative positioning for absolute children
                            }}
                            onClick={() => inputRef.current?.click()}
                          >
                            <input
                              type="file"
                              accept=".xml"
                              hidden
                              ref={inputRef}
                              onChange={handleFileChange}
                              disabled={modifyble === '0' ? true : false}
                            />
                            {loadingXml && (
                              <CircularProgress
                                sx={{
                                  position: "absolute",
                                  top: "0%",
                                  left: "110%",
                                  transform: "translate(-50%, -50%)",
                                }}
                                size={20}
                              />
                            )}
                            <>
                              {/* Your other UI components */}
                              <Typography>
                                {uploadedFileName
                                  ? `Archivo: ${uploadedFileName}`
                                  : "Selecciona el archivo Xml"}
                              </Typography>
                            </>
                          </Box>
                        </Box>
                      </Grid>
                    </Box></>) : (<></>)}
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      AFIANZADORA
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Select
                      disabled={disabled || (disabledXmlData && values.suretyCompany !== null)}
                      sx={{ width: "100%" }}
                      onChange={(e) => handleChangeSurety(e.target.value)}
                      defaultValue={0}
                      value={values.suretyCompany ? values.suretyCompany : 0}
                      error={!!errors.suretyCompany}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.suretyCompany ?? []).map(
                        (data: any) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.corporateName}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.suretyCompany}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                  >
                    <Box width="70%" height="70%" marginBottom={{ sm: "25px", md: "50px" }}>
                      <Avatar
                        src={
                          values.suretyCompany
                            ? FormatData.getUriLogoCompany(
                              Object(valuesData?.suretyCompany ?? []).find(
                                (x: ModalCompany) =>
                                  x.folio === values.suretyCompany
                              )?.logo
                            )
                            : suretyCompany
                              ? FormatData.getUriLogoCompany(suretyCompany?.logo)
                              : ""
                        }
                        variant="rounded"
                        alt={suretyCompany?.logo}
                        style={{ width: "auto", height: "auto" }}
                        imgProps={{
                          sx: {
                            objectFit: "contain",
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>FOLIO OT</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <TextField
                      fullWidth
                      disabled
                      name="folioOT"
                      placeholder="Folio OT"
                      value={values.folioOT}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      NO. PÓLIZA
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && values.noPolicy !== null)}
                      name="noPolicy"
                      placeholder="No. Póliza"
                      value={values.noPolicy}
                      error={!!errors.noPolicy}
                      helperText={errors.noPolicy}
                      onChange={handleChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>FIADO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Autocomplete
                      disabled={(disabled || disabledDebtor) || (disabledXmlData && response?.fiadoRegistrado !== false)}
                      loadingText="Buscando..."
                      options={optionsDebtor ?? []}
                      loading={loadingDebtor}
                      noOptionsText="No se encontraron coincidencias"
                      isOptionEqualToValue={(option, value) =>
                        option.folio === value.folio
                      }
                      getOptionLabel={(option: ModelPeople) => {
                        return (
                          option.name +
                          " " +
                          option.lastName +
                          " " +
                          option.maternalLastName
                        );
                      }}
                      value={valueDebtor}
                      onInputChange={(e, value) => {
                        handleInputPeopleChange("debtor", value);
                      }}
                      onChange={(e, value) => {
                        setLoadingDebtor(false);
                        setFieldValue(
                          "debtor",
                          value ? value?.folio : values.debtor
                        );
                        setValueDebtor(value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Buscar"
                          error={!!errors.debtor}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingDebtor ? (
                                  <CircularProgress
                                    sx={{ color: "#E5105D" }}
                                    size={20}
                                  />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          helperText={errors.debtor}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.folio}>
                          {option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName}
                        </li>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      BENEFICIARIO
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Autocomplete
                      disabled={disabled || (disabledXmlData && response?.beneficiarioRegistrado !== false)}
                      noOptionsText="No se encontraron coincidencias"
                      loadingText="Buscando..."
                      options={optionsBeneficiary ?? []}
                      loading={loadingBeneficiary}
                      isOptionEqualToValue={(option, value) =>
                        option.folio === value.folio
                      }
                      getOptionLabel={(option: ModelPeople) => {
                        return (
                          option.name +
                          " " +
                          option.lastName +
                          " " +
                          option.maternalLastName
                        );
                      }}
                      onInputChange={(e, value) => {
                        handleInputPeopleChange("beneficiary", value);
                      }}
                      onChange={(e, value) => {
                        setLoadingBeneficiary(false);
                        setFieldValue(
                          "beneficiary",
                          value ? value?.folio : null//values.beneficiary
                        );
                        setValuesBeneficiary(value);
                      }}
                      value={valueBeneficiary}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Buscar"
                          error={!!errors.beneficiary}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingBeneficiary ? (
                                  <CircularProgress
                                    sx={{ color: "#E5105D" }}
                                    size={20}
                                  />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          helperText={errors.beneficiary}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.folio}>
                          {option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName}
                        </li>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>MONEDA</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2} alignSelf="center">
                    <Select
                      disabled={disabled || (disabledXmlData && values.currency !== null)}
                      sx={{ width: "100%" }}
                      name="currency"
                      defaultValue={0}
                      value={values.currency ? values.currency : 0}
                      error={!!errors.currency}
                      onChange={handleChange}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.currencyCatalog.values ?? []).map(
                        (data: CatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.currency}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2} alignSelf="center">
                    {values.currency &&
                      values.currency !== Constants.folioCurrencyMXN ? (
                      <TextField
                        name="exchangeRate"
                        InputProps={{
                          readOnly: disabled,
                          placeholder: "Tipo de cambio",
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">MXN</InputAdornment>
                          ),
                        }}
                        value={values.exchangeRate ? values.exchangeRate : "0"}
                        onChange={handleChange}
                      />
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>TASA IVA</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Select
                      disabled={disabled || (disabledXmlData && values.rateIva !== null)}
                      sx={{ width: "100%" }}
                      name="rateIva"
                      defaultValue={0}
                      value={values.rateIva ? values.rateIva : 0}
                      error={!!errors.rateIva}
                      onChange={handleIvaChange}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.tasaIVACatalog.values ?? []).map(
                        (data: CatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.description} %
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.rateIva}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>RAMO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Select
                      disabled={disabled || (disabledXmlData && values.branch !== null)}
                      sx={{ width: "100%" }}
                      name="branch"
                      defaultValue={0}
                      value={values.branch ? values.branch : 0}
                      error={!!errors.branch}
                      onChange={handleChange}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.suretiesBranch.values ?? [])
                        // .filter(
                        //   (b: CatalogValue) =>
                        //     b.folio === Constants.suretiesCatalogFolio
                        // )
                        .map((data: CatalogValue) => (
                          <MenuItem
                            // onClick={() => {
                            //   handleMovement(data.folio);
                            // }}
                            key={data.folio}
                            value={data.folio}
                          >
                            {data?.description}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.branch}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>SUBRAMO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Select
                      disabled={disabled || (disabledXmlData && values.subBranch !== null)}
                      sx={{ width: "100%" }}
                      name="subBranch"
                      defaultValue={0}
                      value={values.subBranch ? values.subBranch : 0}
                      error={!!errors.subBranch}
                      onChange={handleChange}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(
                        subBranch.map((data: CatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.description}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.subBranch}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>VENDEDOR</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Autocomplete
                      disabled={disabled}
                      noOptionsText="No se encontraron coincidencias"
                      loadingText="Buscando..."
                      options={optionsSalesPerson ?? []}
                      loading={loadingSalesPerson}
                      isOptionEqualToValue={(option, value) =>
                        option.folio === value.folio
                      }
                      getOptionLabel={(option: ModelPeople) => {
                        return (
                          option.name +
                          " " +
                          option.lastName +
                          " " +
                          option.maternalLastName
                        );
                      }}
                      onInputChange={(e, value) => {
                        handleInputPeopleChange("salesperson", value);
                      }}
                      onChange={(e, value) => {
                        setLoadingSalesPerson(false);
                        setFieldValue(
                          "salesperson",
                          value ? value?.folio : values.salesperson
                        );
                        setValuesSalesPerson(value);
                      }}
                      value={valueSalesPerson}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Buscar"
                          error={!!errors.salesperson}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingSalesPerson ? (
                                  <CircularProgress
                                    sx={{ color: "#E5105D" }}
                                    size={20}
                                  />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          helperText={errors.salesperson}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.folio}>
                          {option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName}
                        </li>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      RELATIVO A
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <TextField
                      fullWidth
                      disabled={disabled}
                      name="relatedTo"
                      value={values.relatedTo}
                      error={!!errors.relatedTo}
                      onChange={handleChange}
                      helperText={errors.relatedTo}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      GRUPO BENEFICIARIO
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Select
                      sx={{ width: "100%" }}
                      disabled={disabled}
                      name="group"
                      defaultValue={0}
                      value={values.group ? values.group : 0}
                      error={!!errors.group}
                      onChange={handleChange}
                    >
                      <MenuItem key={0} value={0}>
                        Selecciona
                      </MenuItem>
                      {Object(valuesData?.beneficiaryGroup.values ?? []).map(
                        (data: CatalogValue) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.description}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.rateIva}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>PROYECTO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} alignSelf="center">
                    <Autocomplete
                      disabled={disabled}
                      multiple
                      options={Object(
                        valuesData?.projectCatalog.values != undefined
                          ? valuesData?.projectCatalog.values
                          : []
                      ).map((option: CatalogValue) => option.description)}
                      freeSolo
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          <Chip
                            variant="outlined"
                            label={option != null ? option : ""}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      value={values.project ? values.project.split(",") : []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="project"
                          placeholder="Proyecto"
                        />
                      )}
                      onChange={(event, value) => {
                        if (value) {
                          setFieldValue("project", value.toString());
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>AGREGAR PDF MOVIMIENTO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Tooltip
                      title={
                        disabledfile ? (
                          <Typography>
                            Generar folio de fianza para adjuntar archivo
                          </Typography>
                        ) : (
                          ""
                        )
                      }
                    >
                      <span>
                        <IconButton sx={{ width: "100%" }}>
                          <TextField
                            fullWidth
                            type="file"
                            disabled={
                              disabledfile
                                ? disabledfile
                                : disabled
                                  ? disabled
                                  : false
                            }
                            helperText={
                              pdfMovement?.fileName
                                ? pdfMovement?.fileName
                                : "Seleccione un archivo"
                            }
                            onChange={(value) => {
                              try {
                                //Checar
                                postFile(
                                  value.target as HTMLInputElement,
                                  "PDF_MOVIMIENTO",
                                  folioBond + "",
                                  folioOTHook + ""
                                ).then((newRow) => {
                                  //rowsDocumentSourceFile
                                  const newRowTyped: rowsDocumentSourceFile =
                                    JSON.parse(JSON.stringify(newRow));
                                  //Colocar el Documento en el hook correspondiente: ////////////////////////
                                  if (pdfMovement?.folio !== undefined)
                                    fileStorageService
                                      .putFileStoragebyFolio(
                                        pdfMovement?.folio + "",
                                        newRowTyped
                                      )
                                      .then((response) => {
                                        setDataAlert(true, "Se subio el pdf del movimiento con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      })
                                      .catch((err) => {
                                        console.error(
                                          "Error en el put",
                                          err
                                        );
                                      });
                                  else
                                    fileStorageService
                                      .postFileStorage(newRowTyped)
                                      .then(() => {
                                        setDataAlert(true, "Se subio el pdf del movimiento con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      })
                                      .catch((err) => {
                                        console.error(
                                          "Error en el post",
                                          err
                                        );
                                      });
                                  ///////////////////////////////////////////////////////////////////////////
                                });
                              } catch (exception) {
                                console.error(exception);
                              }
                            }}
                            inputProps={{
                              title: "",
                              accept:
                                ".pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>AGREGAR PDF RECIBO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Tooltip
                      title={
                        disabledfile ? (
                          <Typography>
                            Generar folio de fianza para adjuntar archivo
                          </Typography>
                        ) : (
                          ""
                        )
                      }
                    >
                      <span>
                        <IconButton sx={{ width: "100%" }}>
                          <TextField
                            fullWidth
                            type="file"
                            disabled={
                              disabledfile
                                ? disabledfile
                                : disabled
                                  ? disabled
                                  : false
                            }
                            helperText={
                              pdfReceipt?.fileName
                                ? pdfReceipt?.fileName
                                : "Seleccione un archivo"
                            }
                            onChange={(value) => {
                              try {
                                //Checar postFile
                                postFile(
                                  value.target as HTMLInputElement,
                                  "PDF_RECIBO",
                                  folioBond + "",
                                  folioOTHook + ""
                                ).then((newRow) => {
                                  //rowsDocumentSourceFile
                                  const newRowTyped: rowsDocumentSourceFile =
                                    JSON.parse(JSON.stringify(newRow));
                                  //Colocar el Documento en el hook correspondiente: ////////////////////////
                                  if (pdfReceipt?.folio !== undefined)
                                    fileStorageService
                                      .putFileStoragebyFolio(
                                        pdfReceipt?.folio + "",
                                        newRowTyped
                                      )
                                      .then(() => {
                                        setDataAlert(true, "Se subio el pdf del recibo con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      });
                                  else
                                    fileStorageService
                                      .postFileStorage(newRowTyped)
                                      .then(() => {
                                        setDataAlert(true, "Se subio el pdf del recibo con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      });
                                  ///////////////////////////////////////////////////////////////////////////
                                });
                              } catch (exception) {
                                console.error(exception);
                              }
                            }}
                            inputProps={{
                              title: "Selecciona el archivo",
                              accept:
                                ".pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>AGREGAR FACTURA PÓLIZA</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Tooltip
                      title={
                        disabledfile ? (
                          <Typography>
                            Generar folio de fianza para adjuntar archivo
                          </Typography>
                        ) : (
                          ""
                        )
                      }
                    >
                      <span>
                        <IconButton sx={{ width: "100%" }}>
                          <TextField
                            fullWidth
                            type="file"
                            disabled={
                              disabledfile
                                ? disabledfile
                                : disabled
                                  ? disabled
                                  : false
                            }
                            helperText={
                              policyInvoice?.fileName
                                ? policyInvoice?.fileName
                                : "Seleccione un archivo"
                            }
                            onChange={(value) => {
                              try {
                                //Checar
                                postFile(
                                  value.target as HTMLInputElement,
                                  "FACTURA_POLIZA",
                                  folioBond + "",
                                  folioOTHook + ""
                                ).then((newRow) => {
                                  //rowsDocumentSourceFile
                                  const newRowTyped: rowsDocumentSourceFile =
                                    JSON.parse(JSON.stringify(newRow));
                                  //Colocar el Documento en el hook correspondiente: ////////////////////////
                                  if (policyInvoice?.folio !== undefined)
                                    fileStorageService
                                      .putFileStoragebyFolio(
                                        policyInvoice?.folio + "",
                                        newRowTyped
                                      )
                                      .then((response) => {
                                        setDataAlert(true, "Se subio la factura con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      })
                                      .catch((err) => {
                                        console.error(
                                          "Error en el put",
                                          err
                                        );
                                      });
                                  else
                                    fileStorageService
                                      .postFileStorage(newRowTyped)
                                      .then(() => {
                                        setDataAlert(true, "Se subio la factura con éxito.", "success", autoHideDuration);
                                        createGridFiles(folioOTHook);
                                      })
                                      .catch((err) => {
                                        console.error(
                                          "Error en el post",
                                          err
                                        );
                                      });
                                  ///////////////////////////////////////////////////////////////////////////
                                });
                              } catch (exception) {
                                console.error(exception);
                              }
                            }}
                            inputProps={{
                              title: "",
                              accept:
                                ".xml",
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "IMP"}
              onChange={handleAccordionChange("IMP")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>FACTURA</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box component="fieldset" padding={2}>
                  <legend>
                    <Typography
                      sx={{ ...TextXSmallBoldFont, color: ColorPink }}
                    >
                      MONTO FIANZA
                    </Typography>
                  </legend>
                  <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2 }}
                  >
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        MONTO MOVIMIENTO
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.montoMovimiento != null && response?.montoMovimiento != 0.0)}
                        name="transactionAmount"
                        value={
                          (values.transactionAmount = Number(
                            values.transactionAmount
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.transactionAmount *
                            Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>TARIFA</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.tarifa != null && response?.tarifa !== 0.0)}
                        name="tariff"
                        value={values.tariff ? Number(values.tariff) : ""}
                        error={!!errors.tariff}
                        helperText={errors.tariff}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={values.tariff * Number(values.exchangeRate)}
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        PRIMA NETA
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.primaNeta != null && response?.primaNeta !== 0.0)}
                        name="netPremium"
                        value={(values.netPremium = Number(values.netPremium))}
                        error={!!errors.netPremium}
                        helperText={errors.netPremium}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.netPremium * Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        DERECHOS
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.derechos != null && response?.derechos !== 0.0)}
                        name="fees"
                        value={(values.fees = Number(values.fees))}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={values.fees * Number(values.exchangeRate)}
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        GASTOS DE EXPEDICIÓN
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.gastosExpedicion != null && response?.gastosExpedicion !== 0.0)}
                        name="issuanceExpensesReceipt"
                        value={
                          (values.issuanceExpensesReceipt = Number(
                            values.issuanceExpensesReceipt
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.issuanceExpensesReceipt *
                            Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        GASTOS BURO
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.gastosBuro != null && response?.gastosBuro !== 0.0)}
                        name="bureauExpenses"
                        value={
                          (values.bureauExpenses = Number(
                            values.bureauExpenses
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.bureauExpenses * Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        SUBTOTAL
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.subtotal != null && response?.subtotal !== 0.0)}
                        name="subtotal"
                        value={
                          (values.subtotal =
                            Number(values.netPremium) +
                            Number(values.fees) +
                            Number(values.issuanceExpensesReceipt))
                        }
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={values.subtotal * Number(values.exchangeRate)}
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>IVA</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.iva !== null && response?.iva !== 0.0 && response?.iva != undefined)}
                        name="iva"
                        value={
                          (values.iva =
                            valuesData?.bondData || values.iva
                              ? values.iva
                              : iva
                                ? Number(Math.abs(values.subtotal)) *
                                Number(Number(iva?.description) / 100)
                                : 0)
                        }
                        error={!!errors.iva}
                        helperText={errors.iva}
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={values.iva * Number(values.exchangeRate)}
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        MONTO TOTAL
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.montoTotaL != null && response?.montoTotaL !== 0.0)}
                        name="totalAmount"
                        value={
                          (values.totalAmount =
                            Number(values.subtotal ?? 0) +
                            Number(values.iva ?? 0))
                        }
                        error={!!errors.totalAmount}
                        helperText={errors.totalAmount}
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.totalAmount * Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    {/* <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        GASTOS RPP
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="rppExpenses"
                        value={
                          (values.rppExpenses = Number(values.rppExpenses))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.rppExpenses * Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid> */}
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        GASTOS INVESTIGACIÓN
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled || (disabledXmlData && response?.gastosInvestigacion != null && response?.gastosInvestigacion !== 0.0)}
                        name="investigationExpenses"
                        value={
                          (values.investigationExpenses = Number(
                            values.investigationExpenses
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end">
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.investigationExpenses *
                            Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                    {/* Se oculta gastos de expedición de fianza para evitar quitar desde bd, 
                     se queda pendiente que realizar con el campo, si quitar o volver a pintar en front y capturar valor*/}
                    {/* <Grid item xs={12} md={4} lg={2} alignSelf="center" display='none'>
                      <Typography sx={{ ...TextSmallFont }}>
                        GASTOS DE EXP.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center" display='none'>
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="issuanceExpensesBonds"
                        value={
                          (values.issuanceExpensesBonds = Number(
                            values.issuanceExpensesBonds
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end" display='none'>
                      {values.currency &&
                        values.currency !== Constants.folioCurrencyMXN ? (
                        <TextField
                          fullWidth
                          value={
                            values.issuanceExpensesBonds *
                            Number(values.exchangeRate)
                          }
                          InputProps={{
                            readOnly: true,
                            inputComponent: NumericFormatCustom as any,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                MXN
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid> */}
                  </Grid>
                </Box>
                <Box component="fieldset" padding={2}>
                  <legend>
                    <Typography
                      sx={{ ...TextXSmallBoldFont, color: ColorPink }}
                    >
                      COMISIONES
                    </Typography>
                  </legend>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2 }}
                  >
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        COMISIÓN ( % )
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="commissionPercentage"
                        value={
                          (values.commissionPercentage = Number(
                            values.commissionPercentage
                          ))
                        }
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end" />
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        IMPORTE DE COMISIÓN
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="commissionAmount"
                        value={
                          (values.commissionAmount =
                            Number(values.netPremium) *
                            Number(values.commissionPercentage / 100))
                        }
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end" />
                    {/* <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>BONO</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="bonus"
                        value={(values.bonus = Number(values.bonus))}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid> */}
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        MAQUILA ( % )
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Select
                        disabled={disabled}
                        sx={{ width: "100%" }}
                        name="maquilaPercentage"
                        defaultValue={0}
                        value={values.maquilaPercentage ? values.maquilaPercentage : 0}
                        error={!!errors.maquilaPercentage}
                      // onChange={handleChange}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(valuesData?.maquilaPercentages.values ?? [])
                          // .filter(
                          //   (b: CatalogValue) =>
                          //     b.folio === Constants.suretiesCatalogFolio
                          // )
                          .map((data: CatalogValue) => (
                            <MenuItem
                              // onClick={() => {
                              //   handleMovement(data.folio);
                              // }}
                              key={Number(data.description)}
                              value={data.description}
                              onClick={(e) => {
                                const maquila =
                                  Number(values.issuanceExpensesReceipt) *
                                  Number(Number(data.description) / 100)
                                setFieldValue("maquila", maquila);
                                setFieldValue("maquilaPercentage", Number(data.description));
                              }}
                            >
                              {Number(data?.description)}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.maquilaPercentage}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end" />
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        IMPORTE DE MAQUILA
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="maquila"
                        value={values.maquila}
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2} alignSelf="end" />
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "VIG"}
              onChange={handleAccordionChange("VIG")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>VIGENCIA</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      INICIO DE VIGENCIA
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.inicioVigencia.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="startCoverage"
                      value={values.startCoverage}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FIN DE VIGENCIA
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.finVigencia.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="endCoverage"
                      value={values.endCoverage}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA FIN DE CUMPLIMIENTO
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.fechaFinPlazoEjecucion.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="endExecutionPeriod"
                      value={values.endExecutionPeriod == null
                        ? format(new Date(), "yyyy-MM-dd")
                        : values.endExecutionPeriod}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA DE EMISIÓN
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.fechaEmision.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="issuanceDate"
                      value={values.issuanceDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA DE SOLICITUD
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.fechaSolicitud.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="applicationDate"
                      value={values.applicationDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA DE AUTORIZACIÓN
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled || (disabledXmlData && response?.fechaAutorizacion.toString() !== "0001-01-01T00:00:00")}
                      type="date"
                      name="authorizationDate"
                      value={values.authorizationDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA DE PREESCRIPCIÓN
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled}
                      type="date"
                      name="statuteLimitationsDate"
                      value={values.statuteLimitationsDate}
                      onChange={handleChange}
                    />
                  </Grid> */}
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      FECHA DE CADUCIDAD (PARA SEMÁFORO)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      fullWidth
                      disabled={disabled}
                      type="date"
                      name="maximumClaim"
                      value={values.maximumClaim}
                      onChange={(e) => {
                        manageMaximumClaim(e);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Typography sx={{ ...TextSmallFont }}>
                      TIPO DE VENCIMIENTO
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3} alignSelf="center">
                    <Select
                      sx={{ width: "100%" }}
                      disabled={disabled}
                      defaultValue={0}
                      name="maturityType"
                      value={values.maturityType ? values.maturityType : 0}
                      error={!!errors.maturityType}
                      onChange={handleChange}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {Object(
                        valuesData?.maturityTypeCatalog.values ?? []
                      ).map((data: any) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data?.description}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: "#d22e2e" }}>
                      {errors.maturityType}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "DOC"}
              onChange={handleAccordionChange("DOC")}
            >
              <AccordionSummary>
                <Typography sx={{ ...LinkLargeFont }}>DOC. FUENTE</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="column" spacing={2} padding={2}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2 }}
                  >
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        TIPO DE DOC. FUENTE
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <Select
                        sx={{ width: "100%" }}
                        disabled={disabled}
                        defaultValue={0}
                        name="sourceDocumentType"
                        value={
                          values.sourceDocumentType
                            ? values.sourceDocumentType
                            : 0
                        }
                        error={!!errors.sourceDocumentType}
                        onChange={handleChange}
                      >
                        <MenuItem key={0} value={0} disabled>
                          Selecciona
                        </MenuItem>
                        {Object(
                          valuesData?.sourceDocumentCatalog.values ?? []
                        ).map((data: any) => (
                          <MenuItem key={data.folio} value={data.folio}>
                            {data?.description}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d22e2e" }}>
                        {errors.sourceDocumentType}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>NUMERO</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="number"
                        value={values.number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        MONTO DOC. FUENTE
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        name="sourceDocumentAmount"
                        value={
                          (values.sourceDocumentAmount = Number(
                            values.sourceDocumentAmount
                          ))
                        }
                        error={!!errors.sourceDocumentAmount}
                        helperText={errors.sourceDocumentAmount}
                        InputProps={{
                          inputComponent: NumericFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <Typography sx={{ ...TextSmallFont }}>
                        FECHA DOC. FUENTE
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled={disabled}
                        type="date"
                        name="sourceDocumentDate"
                        value={values.sourceDocumentDate}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} alignSelf="center">
                      <TextField
                        fullWidth
                        label="Titulo de Archivo Doc. Fuente"
                        disabled={disabled}
                        value={sourceDocumentFileTitle}
                        onChange={(value) => {
                          setSourceDocumentFileTitle(value.target.value);
                          if (value.target.value !== "")
                            setSourceDocumentFileEnable(false);
                          else setSourceDocumentFileEnable(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <Tooltip
                        title={
                          disabledfile ? (
                            <Typography>
                              Generar folio de fianza para adjuntar archivo
                            </Typography>
                          ) : (
                            ""
                          )
                        }
                      >
                        <span>
                          <IconButton>
                            <TextField
                              fullWidth
                              type="file"
                              disabled={
                                disabledfile ? true : sourceDocumentFileEnable
                              }
                              onChange={(value) => {
                                const timer = setInterval(() => {
                                  setProgress((prevProgress) => (prevProgress >= 95 ? prevProgress + 0 : prevProgress + 5));
                                }, 1800);

                                try {
                                  //Checar       
                                  postFile(
                                    value.target as HTMLInputElement,
                                    sourceDocumentFileTitle,
                                    folioBond + "",
                                    folioOTHook + ""
                                  ).then((newRow) => {
                                    setProgress(20);
                                    //rowsDocumentSourceFile
                                    const newRowTyped: rowsDocumentSourceFile = JSON.parse(JSON.stringify(newRow));
                                    //Insertamos el documento en la base y el storage
                                    fileStorageService
                                      .postFileStorage(newRowTyped)
                                      .then((x) => {
                                        setProgress(100);
                                        createGridFiles(folioOTHook);
                                        setDataAlert(true, "Se subio el documento con éxito.", "success", autoHideDuration);
                                        setTimeout(() => {
                                          setProgress(0);
                                          clearInterval(timer)
                                        }, 2000);
                                      })
                                    ///////////////////////////////////////////////////////////////////////////
                                  });
                                } catch (exception) {
                                  setProgress(0);
                                  clearInterval(timer)
                                  console.error(exception);
                                }
                                //Limpo el titulo del Archivo:
                                setSourceDocumentFileTitle("");
                                //Desactivo el cargador de archivos y lo limpio
                                setSourceDocumentFileEnable(true);
                                //Limpiando Textfile File
                                (value.target as HTMLInputElement).value = "";
                              }}
                              //Aqui limito el tipo de archivos que acepta el input a pdf, word y excel
                              // .txt, text/plain,
                              inputProps={{
                                title: "",
                                accept:
                                  ".pdf, application/pdf, .doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  {progress > 0 && progress < 101 ? <LinearProgressWithLabel value={progress} /> : <></>}
                  <Box>
                    {" "}
                    {/*height='25vh' >*/}
                    <DataGrid
                      rows={sourceDocumentFile ?? []}
                      columns={columns.filter((col) => col.field !== "folio")}
                      //getRowId={(row) => row.Id + ''}
                      //columns={columns}
                      getRowId={(row) => row?.folio + ""}
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box textAlign="right">
            <span>
              <Button
                disabled={disabled}
                endIcon={<Complete color={ColorPureWhite} />}
                onClick={handleOpenDialogConfirm}
              >
                {folioBond ? "Actualizar" : "Guardar"}
              </Button>
            </span>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogContent>
              <DialogContentText>{confirmContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <span>
                <Button size="small" variant="text" onClick={handleClose}>
                  No
                </Button>
              </span>
              <span>
                <Button size="small" variant="text" onClick={submitForm}>
                  Si
                </Button>
              </span>
            </DialogActions>
          </Dialog>
          <Dialog open={openRegisterPerson} onClose={handleClose}>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogContent>
              <DialogContentText>{confirmContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <span>
                <Button size="small" variant="text" onClick={() => {
                  if (personFolio !== '' && personTypePersonId !== '') {
                    RegisterPerson(personToAdd, personFolio, personTypePersonId);
                  } else {
                    RegisterPerson(personToAdd, '', '');
                  }
                }}>
                  Si
                </Button>
              </span>
              <span>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleCloseRegisterPerson}
                >
                  No
                </Button>
              </span>
            </DialogActions>
          </Dialog>
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
      {waiting !== false ? <LoadingScreen message="Cargando" /> : <></>}
    </>
  );
}

export default TabBondPolicy;

async function getContentInBytes(
  file: File
): Promise<{ name: string; content: string }> {
  const nameFile: string = file.name;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (!file) {
      reject("File does not exist");
      return;
    }

    if (file.type.split("/")[1] === "xml") {
      reader.onload = () => {
        const dataUrl: string | null = reader.result?.toString() || null;

        if (dataUrl && dataUrl.includes(",")) {
          const [, base64Content] = dataUrl.split(",");
          if (base64Content.includes("/") && !base64Content.startsWith("PD94")) {
            const extractedContent =
              base64Content.substring(base64Content.indexOf("/") + 1) || null;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(
              atob(extractedContent || ""),
              "application/xml"
            );

            const emisorNode = xmlDoc.querySelector("Emisor");

            if (emisorNode != null) {
              const emisorName =
                emisorNode?.getAttribute("nombre") || " no definido";
              insuranceCompany = emisorName;
            }

            resolve({ name: nameFile, content: extractedContent || "" });

          } else {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(
              atob(base64Content || ""),
              "application/xml"
            );

            if (xmlDoc != undefined && !null) {
              const emisorNode = xmlDoc.querySelector("Emisor");
              const emisorName =
                emisorNode?.getAttribute("nombre") || " no definido";
              insuranceCompany = emisorName;
            }

            resolve({ name: nameFile, content: base64Content || "" });
          }
        } else {
          reject("Invalid dataUrl format");
        }
      };

    } else {
      resolve({ name: "", content: "" })
    }

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

async function postFile(
  register: any,
  fileTitle: string,
  folioBond: string,
  folioOT: string
) {
  folioOT = "OT-" + folioOT;
  //Guardando parametros en variables
  const nameFile = "" + register?.files?.[0].name;

  //Aqui comienzo a extraer los bytes
  const selectedFile = register?.files?.[0];

  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent: string | ArrayBuffer | null | undefined =
        event.target?.result;

      if (typeof fileContent === "string") {

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(fileContent, "application/xml");

        if (xmlDoc != undefined && !null) {

          const comprobanteNode =
            xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];

          if (comprobanteNode != undefined) {

            const serie = comprobanteNode.getAttribute("Serie");
            const folio = comprobanteNode.getAttribute("Folio");
            Folio = folio;
            Serie = serie;
            const uuidElement = xmlDoc
              .evaluate("//tfd:TimbreFiscalDigital/@UUID", xmlDoc, (namespace) => {
                return "http://www.sat.gob.mx/TimbreFiscalDigital";
              })
              .iterateNext();

            UUID = uuidElement ? uuidElement.textContent : null;
          }

        }
      }
    };

    reader.readAsText(selectedFile);
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedFile);
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      var readerSplit: string = reader.result?.toString() ?? "";
      const currentExtensionFile: string = nameFile.substring(
        nameFile.lastIndexOf("."),
        nameFile.length
      );

      if (readerSplit.lastIndexOf(",") > 0)
        readerSplit = readerSplit.substring(
          readerSplit.lastIndexOf(",") + 1,
          readerSplit.length
        );

      const { name, content } = await getContentInBytes(selectedFile);
      const nameFileBond: string = folioOT + "__" + "FACTURA_POLIZA";
      const nameFileMovement: string = folioOT + "__" + "PDF_MOVIMIENTO";
      const nameFileReceipt: string = folioOT + "__" + "PDF_RECIBO";
      //Creando objeto pare renderizar el Datagrid por medio del hook  "sourceDocumentFile"
      var newRow: rowsDocumentSourceFile;
      if (fileTitle === nameFileBond) {
        newRow = {
          externalFolio: folioBond, //"BOND-01",
          fileName: nameFileBond + currentExtensionFile,
          description: nameFileBond,
          fileExtension: currentExtensionFile,
          fileBytes: content,
          containerName: "boundsourcedocument", //"personproceedings",//Nombre del BlockStorage
          objectStatusId: 1,
        };
      } else if (fileTitle === nameFileMovement) {
        newRow = {
          externalFolio: folioBond, //"BOND-01",
          fileName: nameFileMovement + currentExtensionFile,
          description: nameFileMovement,
          fileExtension: currentExtensionFile,
          fileBytes: readerSplit,
          containerName: "boundsourcedocument", //"personproceedings",//Nombre del BlockStorage
          objectStatusId: 1,
        };
      } else if (fileTitle === nameFileReceipt) {
        newRow = {
          externalFolio: folioBond, //"BOND-01",
          fileName: nameFileReceipt + currentExtensionFile,
          description: nameFileReceipt,
          fileExtension: currentExtensionFile,
          fileBytes: readerSplit,
          containerName: "boundsourcedocument", //"personproceedings",//Nombre del BlockStorage
          objectStatusId: 1,
        };
      } else {
        newRow = {
          externalFolio: folioBond, //"BOND-01",
          fileName:
            (folioOT + "-" + fileTitle).replaceAll(" ", "_") +
            currentExtensionFile, //nameFile,
          description: fileTitle,
          fileExtension: currentExtensionFile, //(nameFile.substring(nameFile.lastIndexOf("."), nameFile.length)),
          fileBytes: readerSplit,
          containerName: "boundsourcedocument", //"personproceedings",//Nombre del BlockStorage
          objectStatusId: 1,
        };
      }
      resolve(newRow);
    };
  });
}
