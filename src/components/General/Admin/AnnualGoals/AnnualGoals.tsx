import { Collapse, DialogContent, IconButton, InputAdornment } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnualGoal from "../../../../models/AnnualGoal";
import BranchesAnnualGoal from "../../../../models/BranchAnnualGoal";
import {
  Partial_GetBranchesProfileAllByYearResponse_Companies_Branch,
  Partial_GetBranchesProfileAllByYearResponse_Company,
} from "../../../../services/annualgoals.response";
import AnnualGoalService, {
  putBranchesAnnualGoalFolioPayload, putBranchesAnnualGoalFolioPayloadList,
} from "../../../../services/annualgoals.service";
import { GetCompaniesBranchesCompanyIdResponse } from "../../../../services/companiesbranch.response";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import DateUtils from "../../../../utils/dateUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import TableContainer from "../../../OuiComponents/DataDisplay/TableContainer";
import { Alert, Dialog, Skeleton, Snackbar } from "../../../OuiComponents/Feedback";
import {
  Cancel,
  Complete,
  Delete,
  Edit,
  Plus,
  Search,
  View
} from "../../../OuiComponents/Icons";
import { Button, Select, TextField } from "../../../OuiComponents/Inputs";
import { Box } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { Card, Paper } from "../../../OuiComponents/Surfaces";
import {
  ColorGrayDark2,
  ColorGrayDisabled,
  ColorPink,
  ColorPureBlack,
  ColorPureWhite,
  DisplaySmallBoldFont,
  LinkLargeFont,
  LinkSmallFont,
  PlatformBackgroundColor,
  TextSmallFont,
  TextXSmallBoldFont,
  TextXSmallFont,
} from "../../../OuiComponents/Theme";
import { Modal } from "../../../OuiComponents/Utils";
import Eraser from "../../../OuiComponents/Icons/Eraser";
import Title from "../../Title/Title";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import { Check } from "@mui/icons-material";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import Constants from "../../../../utils/Constants";
import LoadDataGrid from "../../PolicyLoad/LoadDataGrid/LoadDataGrid";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "../../../OuiComponents/DataGrid";

export default function AnnualGoals() {
  const [isAnnualGoalReadOnly, setIsAnnualGoalReadOnly] = useState(false);
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  useEffect(() => {
    loadYearsCatalog();
  }, []);

  const [yearsCatalog, setYearsCatalog] = useState<number[]>([]);
  const loadYearsCatalog = () => {
    const TODAY_YEAR = new Date().getFullYear();
    const INITIAL_YEAR = 2018;

    let years = [];
    for (var year = INITIAL_YEAR; year <= TODAY_YEAR; year++) years.push(year);

    setYearsCatalog(years.reverse());
  };

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [loadingScreen, setLoadingScreen] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") ?? "");

  useEffect(() => {
    try {
      setLoadingScreen(true);
      handleQueryYear();
      setLoadingScreen(false);
    } catch (error) {
      console.log('Error:', error)
    }
  }, [])

  const handleChangeSelectedYear = (year: number) => {
    setSelectedYear(year);
    // Reset data
    setAnnualGoalData(undefined);
    setAnnualGoalCompaniesData([]);
    //contraer contenido
    setOculto(false);
    setTablaVisibleState(false);
  };

  useEffect(() => {
    setTimeout(() => {
      handleQueryYear()
    }, 500);
  }, [selectedYear])


  const handleQueryYear = () => {
    if (selectedYear) {
      getCompanyCatalog();
      getAnnualGoalData();
      getAnnualGoalCompaniesData();

      //Validando que exita contenido de select name="company_catalog_selector"
      if (selectedYear === new Date().getFullYear()) {
        setOculto(true);
      }
    }
  };

  const [companyCatalogData, setCompanyCatalogData] = useState([]);
  const getCompanyCatalog = () => {
    AnnualGoalService.getCompanyWithBranchAndNotAnnualGoal(selectedYear)
      .then((response) => response.data)
      .then((json) => {
        if (json && json.length > 0) setCompanyCatalogData(json);
        else {
          setDataAlert(true, "No hay más compañías disponibles.", "info", autoHideDuration);
          setCompanyCatalogData(json);
        }
      })
      .catch((error) => {
        console.error(
          "CompaniesService.getCompanyWithBranchAndNotAnnualGoal()",
          error
        );
        setDataAlert(true, "Error al obtener lista de companias.", "error", autoHideDuration);
      });
  };

  const [annualGoalData, setAnnualGoalData] = useState<AnnualGoal>();
  const getAnnualGoalData = () => {
    AnnualGoalService.GetAnnualGoalsByYear(selectedYear)
      .then((response) => response.data)
      .then((json) => {
        setAnnualGoalData({
          annualGoalId: json[0]["annualGoalId"],
          folio: json[0]["folio"],
          year: json[0]["year"],
          dateGoals: json[0]["dateGoals"],
          editingReason: json[0]["editingReason"],
          approvingReason: json[0]["approvingReason"],
          statusAnnualGoalId: json[0]["statusAnnualGoalId"],
          statusAnnualGoal: json[0]["statusAnnualGoal"],
        });
      })
      .catch((getError) => {
        const PLANNING_STATUS_CATALOG_FOLIO = Constants.annualGoalPlanning;

        const payload: AnnualGoal = {
          year: selectedYear.toString(),
          dateGoals: DateUtils.getActualLocalDate().toISOString(),

          // No deberíamos mandar estos atributos cuando recién creamos el registro. 🤔
          statusAnnualGoalId: PLANNING_STATUS_CATALOG_FOLIO,
          editingReason: [{ reason: "", updatedAt: DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }],
          approvingReason: [{ reason: "", updatedAt: DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }],
          objectStatusId: 1,
        };

        AnnualGoalService.postAnnualGoal(payload)
          .then((response) => {
            if (response.message === "OK") {
              setAnnualGoalData(response.data);
              setDataAlert(true, `Se creó el registro faltante para la Meta Anual del año ${selectedYear}`, "success", autoHideDuration);
            } else {
              setAnnualGoalData(undefined);
              console.error("AnnualGoalService.postAnnualGoal()", selectedYear);
              setDataAlert(true, `No se pudo crear el registro faltante para la Meta Anual del año ${selectedYear}.`, "error", autoHideDuration);
            }
          })
          .catch((postError) => {
            setAnnualGoalData(undefined);

            console.error(
              "AnnualGoalService.postAnnualGoal()",
              selectedYear,
              postError
            );
            setDataAlert(true, `No se pudo crear el registro faltante para la meta anual del año ${selectedYear}.`, "error", autoHideDuration);
          });
      });
  };

  useEffect(() => {
    if (selectedYear === new Date().getFullYear()) {
      setIsAnnualGoalReadOnly(annualGoalData?.statusAnnualGoal?.description === Constants.annualGoalApproved || annualGoalData?.statusAnnualGoalId === Constants.annualGoalApproved);
    } else {
      setIsAnnualGoalReadOnly(selectedYear !== new Date().getFullYear());
    }
  }, [annualGoalData])

  const [annualGoalCompaniesData, setAnnualGoalCompaniesData] = useState<
    Partial_GetBranchesProfileAllByYearResponse_Company[]
  >([]);
  const getAnnualGoalCompaniesData = () => {

    AnnualGoalService.GetBranchesProfileAllByYear(selectedYear)
      .then((response) => response.data)
      .then((json) => {
        if (json[0]["companies"].length > 0) {
          setAnnualGoalCompaniesData(json[0]["companies"]);
          setTablaVisibleState(true);
        }
        else {
          setAnnualGoalCompaniesData([]);
          setTablaVisibleState(false);
          setDataAlert(true, `No hay compañías para la meta anual del año ${selectedYear}.`, "info", autoHideDuration);
        }
      })
      .catch((error) => {
        setAnnualGoalCompaniesData([]);

        console.error(
          "AnnualGoalService.GetBranchesProfileAllByYear()",
          selectedYear,
          error
        );
        setDataAlert(true, `Error al cargar las compañías de meta anual ${selectedYear}.`, "error", autoHideDuration);
      });
  };

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const approveDate = new Date();
  const [approvalReason, setApprovalReason] = useState({
    reason: "",
    updatedAt: "",
    updatedBy: userEmail ?? ""
  });
  const [editingReason, setEditingReason] = useState({
    reason: "",
    updatedAt: "",
    updatedBy: userEmail ?? ""
  });

  const handleOpenApproveGoalModal = () => {
    setIsApproveModalOpen(true);
  };

  const handleOpenEditGoalModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setIsApproveModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSaveApproveModal = () => {
    const APPROVED_CATALOG_FOLIO = Constants.annualGoalApproved;
    if (annualGoalData) {
      const payload: AnnualGoal = {
        annualGoalId: annualGoalData.annualGoalId,
        year: selectedYear.toString(),
        dateGoals: annualGoalData.dateGoals,
        approvingReason:
          annualGoalData.approvingReason != null &&
            annualGoalData.approvingReason.length > 0
            ?
            [...annualGoalData.approvingReason, { reason: approvalReason.reason, updatedAt: approvalReason.updatedAt ?? DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }]
            :
            [{ reason: approvalReason.reason, updatedAt: approvalReason.updatedAt ?? DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }],
        editingReason:
          annualGoalData.editingReason != null &&
            annualGoalData.editingReason.length > 0
            ?
            [...annualGoalData.editingReason]
            :
            [],
        statusAnnualGoalId: APPROVED_CATALOG_FOLIO,
        objectStatusId: 1,
      };

      AnnualGoalService.putAnnualGoal(payload)
        .then((response) => {
          if (response.message === "OK") {
            setDataAlert(true, `Se aprobó la meta anual del año ${selectedYear}`, "success", autoHideDuration);
            handleQueryYear();
            //setAnnualGoalData(payload);
            handleCloseApproveModal();
          } else {
            setDataAlert(true, `No se pudo aprobar la meta anual del año ${selectedYear}.`, "error", autoHideDuration);
          }
        })
        .catch((error) => {
          console.error("AnnualGoalService.putAnnualGoal", payload, error);
          setDataAlert(true, `No se pudo aprobar la meta anual del año ${selectedYear}.`, "error", autoHideDuration);
        });
    }

    //setApprovalReason("");
    handleCloseApproveModal();
  };

  const handleSaveEditedModal = () => {
    const PLANNING_STATUS_CATALOG_FOLIO = Constants.annualGoalPlanning;
    if (annualGoalData) {
      const payload: AnnualGoal = {
        annualGoalId: annualGoalData.annualGoalId,
        year: selectedYear.toString(),
        dateGoals: annualGoalData.dateGoals,
        approvingReason:
          annualGoalData.approvingReason != null &&
            annualGoalData.approvingReason.length > 0
            ?
            [...annualGoalData.approvingReason]
            :
            [],
        editingReason:
          annualGoalData.editingReason != null &&
            annualGoalData.editingReason.length > 0
            ?
            [...annualGoalData.editingReason, { reason: editingReason.reason, updatedAt: editingReason.updatedAt ?? DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }]
            :
            [{ reason: editingReason.reason, updatedAt: editingReason.updatedAt ?? DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" }],
        statusAnnualGoalId: PLANNING_STATUS_CATALOG_FOLIO,
        objectStatusId: 1,
      };

      AnnualGoalService.putAnnualGoal(payload)
        .then((response) => {
          if (response.message === "OK") {
            setDataAlert(true, `Se aprobó la edición para la meta anual del año ${selectedYear}`, "success", autoHideDuration);
            handleQueryYear();
            //setAnnualGoalData(payload);
            handleCloseApproveModal();
          } else {
            setDataAlert(true, `No se pudo aprobar la edición para la meta anual del año ${selectedYear}.`, "error", autoHideDuration);
          }
        })
        .catch((error) => {
          console.error("AnnualGoalService.putAnnualGoal", payload, error);
          setDataAlert(true, `No se pudo aprobar la edición para la meta anual del año ${selectedYear}.`, "error", autoHideDuration);
        });
    }

    //setApprovalReason("");
    handleCloseApproveModal();
  };

  const approveAnnualGoalModal = (
    <Dialog
      open={isApproveModalOpen}

      fullWidth
      maxWidth='sm'
      PaperProps={{ sx: { borderRadius: "20px" } }}
    >
      <IconButton
        onClick={handleCloseApproveModal}
        sx={{
          position: 'absolute',
          right: 20,
          top: 8
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Typography variant='h5' sx={{ ...LinkLargeFont }}>
            <strong>Motivo de aprobación</strong>
          </Typography>

          <Box sx={{ display: "flex", marginY: "8px" }}>
            <Typography
              sx={{
                ...TextXSmallFont,
                color: ColorGrayDisabled,
                marginY: "auto",
                marginRight: "8px",
              }}
            >
              Fecha de aprobación:
            </Typography>
            <Typography
              sx={{
                ...TextXSmallFont,
                color: ColorGrayDisabled,
                backgroundColor: PlatformBackgroundColor,
                marginY: "auto",
                borderRadius: "8px",
                padding: "5px 8px",
              }}
            >
              {approveDate.toLocaleDateString()}
            </Typography>
          </Box>

          <TextField
            defaultValue={""}
            multiline
            rows={5}
            fullWidth
            onChange={(event) => setApprovalReason({ reason: event.target.value, updatedAt: DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" })}
          />

          <Box sx={{ display: "flex", mt: 2 }}>
            <Button
              sx={{ marginRight: "auto" }}
              variant="outlined"
              onClick={handleCloseApproveModal}
            >
              Cerrar
            </Button>
            <Button
              startIcon={<Check />} sx={{ backgroundColor: '#e5105d' }}
              onClick={handleSaveApproveModal}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const editAnnualGoalModal = (
    <Dialog
      open={isEditModalOpen}

      fullWidth
      maxWidth='sm'
      PaperProps={{ sx: { borderRadius: "20px" } }}
    >
      <IconButton
        onClick={handleCloseApproveModal}
        sx={{
          position: 'absolute',
          right: 20,
          top: 8
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Typography variant='h5' sx={{ ...LinkLargeFont }}>
            <strong>Motivo de edición</strong>
          </Typography>

          <Box sx={{ display: "flex", marginY: "8px" }}>
            <Typography
              sx={{
                ...TextXSmallFont,
                color: ColorGrayDisabled,
                marginY: "auto",
                marginRight: "8px",
              }}
            >
              Fecha de edición:
            </Typography>
            <Typography
              sx={{
                ...TextXSmallFont,
                color: ColorGrayDisabled,
                backgroundColor: PlatformBackgroundColor,
                marginY: "auto",
                borderRadius: "8px",
                padding: "5px 8px",
              }}
            >
              {approveDate.toLocaleDateString()}
            </Typography>
          </Box>

          <TextField
            defaultValue={""}
            multiline
            rows={5}
            fullWidth
            onChange={(event) => setEditingReason({ reason: event.target.value, updatedAt: DateUtils.getActualLocalDate().toISOString(), updatedBy: userEmail ?? "" })}
          />

          <Box sx={{ display: "flex", mt: 2 }}>
            <Button
              sx={{ marginRight: "auto" }}
              variant="outlined"
              onClick={handleCloseApproveModal}
            >
              Cerrar
            </Button>
            <Button
              startIcon={<Check />} sx={{ backgroundColor: '#e5105d' }}
              onClick={handleSaveEditedModal}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const [companyFolioToAdd, setCompanyFolioToAdd] = useState("");
  const [branchesFromCompanyToAdd, setBranchesFromCompanyToAdd] = useState<
    GetCompaniesBranchesCompanyIdResponse[]
  >([]);
  const handleChangeSelectedCompanyToAdd = (companyFolio: string) => {
    setCompanyFolioToAdd(companyFolio);

    // Pre-load Branches
    CompaniesBranchesService.getBranchesByCompanyFolio(companyFolio)
      .then((response) => response.data)
      .then((json: GetCompaniesBranchesCompanyIdResponse[]) => {
        if (json && json.length <= 0)
          setDataAlert(true, `Esta compañía no tiene ramos asociados. Imposible configurar metas anuales.`, "info", autoHideDuration);
        else setBranchesFromCompanyToAdd(json);
      })
      .catch((error) => {
        console.error(
          "CompaniesBranchesService.getBranchesByCompanyFolio",
          error
        );
        setDataAlert(true, `Esta compañía no tiene ramos asociados. Imposible configurar metas anuales.`, "info", autoHideDuration);
      });
  };

  const handleAddCompany = () => {
    let BranchesAnnualGoal_s: BranchesAnnualGoal[] = [];
    branchesFromCompanyToAdd.forEach((branchToAdd) => {
      if (branchToAdd.branch) {
        BranchesAnnualGoal_s.push({
          companyId: companyFolioToAdd,
          branchId: branchToAdd.branch.folio,
          folio: branchToAdd.branch.description,
          amount: 0,
          annualGoalId: annualGoalData?.folio ?? "",
          superGoal: 0,
          objectStatusId: 1, // No deberíamos mandar este id en un POST
        });

      }
    });

    AnnualGoalService.postBranchesAnnualGoal(BranchesAnnualGoal_s)
      .then((response: any) => {
        if (response.message === "OK") {
          getCompanyCatalog();
          /*displayAlert(
            "success",
            `Ramo ${branchToAdd.branch.description} dado de alta con éxito.`
          );*/

          getAnnualGoalCompaniesData();
        } else {
          /*displayAlert(
            "error",
            `Error al crear el Ramo ${branchToAdd.branch.description}.`
          );*/
          console.error(
            "AnnualGoalService.postBranchesAnnualGoal",
            BranchesAnnualGoal_s,
            response.message
          );
        }
      })
      .catch((e: Error) => {
        setDataAlert(true, `Error al Branch anual Goal`, "error", autoHideDuration);
        console.error(e);
      });

    setCompanyFolioToAdd("");
    setBranchesFromCompanyToAdd([]);
  };

  const handleDeleteCompanyGoal = (
    company: Partial_GetBranchesProfileAllByYearResponse_Company
  ) => {
    if (company && company.branches) {
      company.branches.forEach((branch) => {
        if (branch.branchAnnualGoalId) {
          AnnualGoalService.deleteBranchesAnnualGoal(branch.branchAnnualGoalId)
            .then((response) => {
              if (response.message === "OK") {
                getAnnualGoalCompaniesData();
                getCompanyCatalog();
              }
            })
            .catch((error) => {
              console.error(
                "AnnualGoalService.deleteBranchesAnnualGoal",
                `Error al eliminar la meta para ${company?.company?.corporateName}}.`,
                error
              );
              setDataAlert(true, `Error al eliminar la meta para ${company?.company?.corporateName}}.`, "error", autoHideDuration);
            });
        }
      });
    }
    setDataAlert(true, `${company?.company?.corporateName} eliminada de las metas con éxito.`, "success", autoHideDuration);
  };

  const annualGoalCompaniesSkeleton = (
    <>
      {/* Draw three Skeletons to bring feedback */}
      {[1, 2].map((n) => {
        return (
          <TableRow key={n.toString()}>
            <TableCell>
              <Skeleton />
            </TableCell>

            <TableCell
              sx={{
                textAlign: "center",
              }}
            >
              <IconButton disabled>
                <Edit color={ColorGrayDisabled} />
              </IconButton>
              <IconButton disabled>
                <Delete color={ColorGrayDisabled} />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );

  const annualGoalCompaniesTable = (
    <>
      {annualGoalCompaniesData.map((company) => {
        //console.log('company', company)
        return (
          <TableRow key={company.companyId}>
            <TableCell sx={{ ...TextSmallFont, color: ColorPureBlack }}>
              {company?.company?.corporateName}
            </TableCell>

            <TableCell
              sx={{
                textAlign: "center",
              }}
            >
              <IconButton
                onClick={() => handleOpenCompanyGoalModal(company, false)}
              >
                {!isAnnualGoalReadOnly ? (<><Edit color={ColorPink} /></>) : (<><View color={ColorPink} /></>)}
              </IconButton>
              <IconButton
                onClick={() => handleDeleteCompanyGoal(company)}
                disabled={isAnnualGoalReadOnly}
              >
                <Delete
                  color={isAnnualGoalReadOnly ? ColorGrayDisabled : ColorPink}
                />
              </IconButton>

            </TableCell>
          </TableRow>
        );
      })}
    </>
  );

  const [editingCompany, setEditingCompany] =
    useState<Partial_GetBranchesProfileAllByYearResponse_Company>();
  const [isCompanyGoalEditModalOpen, setIsCompanyGoalEditModalOpen] =
    useState(false);

  interface BranchAmountData {
    branchAnnualGoalId: string;
    branchId: string;
    amount: number;
    superGoal: number;
  }
  const [branchAmountCollection, setBranchAmountCollection] = useState<
    BranchAmountData[]
  >([]);

  interface BranchSuperGoaltData {
    branchAnnualGoalId: string;
    branchId: string;
    amount: number;
    superGoal: number;
  }
  const [branchSuperGoalCollection, setBranchSuperGoalCollection] = useState<
    BranchSuperGoaltData[]
  >([]);

  const handleOpenCompanyGoalModal = (
    company: Partial_GetBranchesProfileAllByYearResponse_Company,
    isReadOnly: boolean
  ) => {

    if (isReadOnly) {
      setIsAnnualGoalReadOnly(true);
    }

    setIsCompanyGoalEditModalOpen(true);
    setEditingCompany(company);

    let collection: BranchAmountData[] = [];
    company.branches.forEach((branch) => {
      if (branch && branch.branchAnnualGoalId) {
        collection.push({
          branchAnnualGoalId: branch.branchAnnualGoalId,
          amount: branch.amount,
          branchId: branch.branchId,
          superGoal: branch.superGoal,
        });
      }
    });
    setBranchAmountCollection(collection);
  };

  const handleResetBranchGoal = (
    branch: Partial_GetBranchesProfileAllByYearResponse_Companies_Branch,
    companyId: string,
    index: number
  ) => {
    if (branch && branch.branchAnnualGoalId) {
      const ZERO_AMOUNT = 0;
      let payload: putBranchesAnnualGoalFolioPayload = {
        companyId: companyId,
        branchId: branch.branchId,
        amount: ZERO_AMOUNT,
        annualGoalId: annualGoalData?.folio ?? "",
        superGoal: branch.superGoal,
        objectStatusId: 1,

      };

      handleBranchGoalAmountChange(ZERO_AMOUNT, branch.branchAnnualGoalId ?? "", index);

      AnnualGoalService.putBranchesAnnualGoalFolio(
        branch.branchAnnualGoalId,
        payload
      )
        .then((response) => {
          if (response.message === "OK") {
            setDataAlert(true, `Monto de la meta reestablecido con éxito.`, "success", autoHideDuration);
            //handleCloseCompanyGoalEditionModal()
            getAnnualGoalCompaniesData();
          }
        })
        .catch((error) =>
          console.error(
            "AnnualGoalService.putBranchesAnnualGoal",
            `Error al reestablecer el ramo ${branch.branch.description}`,
            error
          )
        );
    }
  };

  const handleResetBranchSuperGoal = (
    branch: Partial_GetBranchesProfileAllByYearResponse_Companies_Branch,
    companyId: string,
    index: number
  ) => {
    if (branch && branch.branchAnnualGoalId) {
      const ZERO_SUPERGOAL = 0;
      let payload: putBranchesAnnualGoalFolioPayload = {
        companyId: companyId,
        branchId: branch.branchId,
        amount: branch.amount,
        annualGoalId: annualGoalData?.folio ?? "",
        superGoal: ZERO_SUPERGOAL,
        objectStatusId: 1,
      };

      handleBranchGoalSuperGoalChange(ZERO_SUPERGOAL, branch.branchAnnualGoalId ?? "", index);

      AnnualGoalService.putBranchesAnnualGoalFolio(
        branch.branchAnnualGoalId,
        payload
      )
        .then((response) => {
          if (response.message === "OK") {
            setDataAlert(true, `Monto de la Super meta reestablecido con éxito.`, "success", autoHideDuration);
            //handleCloseCompanyGoalEditionModal()
            getAnnualGoalCompaniesData();
          }
        })
        .catch((error) =>
          console.error(
            "AnnualGoalService.putBranchesAnnualGoal",
            `Error al reestablecer el Ramo ${branch.branch.description}`,
            error
          )
        );
    }
  };

  const handleCloseCompanyGoalEditionModal = () => {
    setIsCompanyGoalEditModalOpen(false);
    setEditingCompany(undefined);
  };

  const handleSaveCompanyGoalEdit = () => {
    var tuplaBranchesCompany: putBranchesAnnualGoalFolioPayloadList[] = []//[string, v_branch];// = {};
    branchAmountCollection.forEach((bagItem) => {
      tuplaBranchesCompany.push({
        folio: bagItem.branchAnnualGoalId,
        companyId: editingCompany?.companyId ?? "",
        branchId: bagItem.branchId,
        amount: bagItem.amount,
        annualGoalId: annualGoalData?.folio ?? "",
        superGoal: bagItem.superGoal,
        objectStatusId: 1,
      });

    });
    //Enviando datos a metodo putBranchesAnnualGoalFolioList
    AnnualGoalService.putBranchesAnnualGoalFolioList(tuplaBranchesCompany)
      .then((response) => {
        if (response.message === "OK") {
          setDataAlert(true, `Montos actualizado con éxito.`, "success", autoHideDuration);
          getAnnualGoalCompaniesData();
          handleCloseCompanyGoalEditionModal();
        }
      })
      .catch((error) => {
        setDataAlert(true, "Error al actualizar los montos.", "error", autoHideDuration);
        console.error(
          "AnnualGoalService.putBranchesAnnualGoal",
          `Error al actualizar el Ramo`,
          error
        );
      });
  };

  const handleBranchGoalAmountChange = (
    amount: number,
    branchAnnualGoalId: string,
    index: number
  ) => {
    let result = branchAmountCollection.map((ba) =>
      ba.branchAnnualGoalId === branchAnnualGoalId
        ? { ...ba, amount: amount }
        : ba
    );

    setEditingCompany((prevEditingCompany) => {
      if (!prevEditingCompany || !prevEditingCompany.branches) {
        return prevEditingCompany;
      }
      const updatedCompany = { ...prevEditingCompany };
      if (index >= 0 && index < updatedCompany.branches.length) {
        updatedCompany.branches[index].amount = amount;
      }
      setEditingCompany(updatedCompany);
      return updatedCompany;
    });

    setBranchAmountCollection(result);
  };

  const handleBranchGoalSuperGoalChange = (
    superGoal: number,
    branchAnnualGoalId: string,
    index: number
  ) => {

    let result = branchAmountCollection.map((ba) =>
      ba.branchAnnualGoalId === branchAnnualGoalId
        ? { ...ba, superGoal: superGoal }
        : ba
    );


    setEditingCompany((prevEditingCompany) => {
      if (!prevEditingCompany || !prevEditingCompany.branches) {
        return prevEditingCompany;
      }
      const updatedCompany = { ...prevEditingCompany };
      if (index >= 0 && index < updatedCompany.branches.length) {
        updatedCompany.branches[index].superGoal = superGoal;
      }
      setEditingCompany(updatedCompany);
      return updatedCompany;
    });
    setBranchAmountCollection(result);
  };


  const companyGoalEditModal = (
    <Dialog
      open={isCompanyGoalEditModalOpen}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
    >
      <IconButton
        onClick={handleCloseCompanyGoalEditionModal}
        sx={{
          position: 'absolute',
          right: 25,
          top: 8
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>

        <Typography sx={{ ...LinkLargeFont }}>
          <strong>Captura de metas por ramo</strong>
        </Typography>

        <Typography sx={{ ...LinkSmallFont, marginY: "16px" }}>
          {editingCompany?.company.corporateName || "..."}
        </Typography>

        <Box
          sx={{
            maxHeight: "500px",
            overflow: "auto",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: ColorGrayDark2,
                  }}
                >
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,
                      borderRadius: "14px 0 0 0",
                      textAlign: "center",
                    }}
                  >
                    Ramos asignados
                  </TableCell>
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,
                      textAlign: "center",
                    }}
                  >
                    Meta anual
                  </TableCell>
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,

                      textAlign: "center",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,

                      textAlign: "center",
                    }}
                  >
                    Super meta
                  </TableCell>
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,

                      textAlign: "center",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      ...LinkSmallFont,
                      color: ColorPureWhite,
                      borderRadius: "0 14px 0 0",
                      textAlign: "center",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editingCompany?.branches.map((branch, index) => {
                  if(branch.branch != null)
                  return (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ ...TextSmallFont, color: ColorPureBlack }}
                      >
                        {branch?.branch?.description || "..."}
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <Typography
                          sx={{
                            ...TextSmallFont,

                            marginY: "auto",
                            marginRight: "8px",
                          }}
                        >
                        </Typography>
                        <TextField
                          value={branch.amount}
                          type="number"
                          onChange={(event) =>
                            handleBranchGoalAmountChange(
                              parseInt(event.target.value),
                              branch.branchAnnualGoalId ?? "",
                              index
                            )
                          }
                          disabled={isAnnualGoalReadOnly}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }} />

                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          paddingTop: "2px"
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            handleResetBranchGoal(
                              branch,
                              editingCompany.companyId,
                              index
                            );
                          }
                          }
                          disabled={isAnnualGoalReadOnly}
                        >
                          <Eraser
                            color={
                              isAnnualGoalReadOnly
                                ? ColorGrayDisabled
                                : ColorPink
                            }
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <Typography
                          sx={{
                            ...TextSmallFont,
                            color: ColorPureBlack,
                            marginY: "auto",
                            marginRight: "8px",
                          }}
                        >
                        </Typography>
                        <TextField
                          value={branch.superGoal}
                          type="number"
                          onChange={(event) =>
                            handleBranchGoalSuperGoalChange(
                              parseInt(event.target.value),
                              branch.branchAnnualGoalId ?? "",
                              index
                            )
                          }
                          disabled={isAnnualGoalReadOnly}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}>

                        </TextField>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            handleResetBranchSuperGoal(
                              branch,
                              editingCompany.companyId,
                              index
                            );
                          }
                          }
                          disabled={isAnnualGoalReadOnly}
                        >
                          <Eraser
                            color={
                              isAnnualGoalReadOnly
                                ? ColorGrayDisabled
                                : ColorPink
                            }
                          />
                        </IconButton>

                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 2, display: "flex" }}>
          <Button
            sx={{ marginRight: "auto" }}
            variant="outlined"
            onClick={handleCloseCompanyGoalEditionModal}
          >
            Cerrar
          </Button>
          <Button onClick={handleSaveCompanyGoalEdit} startIcon={<Check />} sx={{ backgroundColor: '#e5105d' }} disabled={isAnnualGoalReadOnly}>Guardar</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  /*const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "info" | "success" | "warning"
  >("info");
  const [alertMessage, setAlertMessage] = useState("");

  const displayAlert = (
    severity: "error" | "info" | "success" | "warning",
    message: string
  ) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setIsAlertOpen(true);
  };*/

  const alert = (
    <MessageBar
      open={isSnackbarOpen}
      severity={severity}
      message={messageAlert}
      close={handleSnackbarClose}
      autoHideDuration={autoHideDuration}
    />
  );

  const annualGoalStatusSkeleton = (
    <Skeleton
      sx={{
        height: "48px",
        width: "56px",
        marginY: "auto",
        marginRight: "32px",
      }}
    />
  );

  const annualGoalStatusChip = (
    <Typography
      sx={{
        ...TextXSmallBoldFont,
        color: ColorGrayDisabled,
        backgroundColor: PlatformBackgroundColor,
        marginY: "auto",
        marginRight: "32px",
        borderRadius: "8px",
        padding: "5px 8px",
      }}
    >
      <strong>{annualGoalData?.statusAnnualGoal?.description || annualGoalData?.statusAnnualGoalId || "..."}</strong>
    </Typography>
  );

  //
  const [oculto, setOculto] = useState(false);
  const [tablaVisibleState, setTablaVisibleState] = useState(false);

  const estatusBOX = (
    <Box
      sx={{
        display: "flex",
        marginBottom: "32px",
      }}
    >
      <Typography
        sx={{
          ...TextSmallFont,
          color: ColorPureBlack,
          marginY: "auto",
          width: "77px",
          marginRight: "8px",
        }}
      >
        Estatus:
      </Typography>

      {!annualGoalData ? annualGoalStatusSkeleton : annualGoalStatusChip}

      {!isAnnualGoalReadOnly ? (<>
        <Button
          startIcon={<Complete color={ColorPureWhite} />}
          sx={{ height: "40px" }}
          onClick={handleOpenApproveGoalModal}
        >
          Aprobar metas
        </Button>
      </>) : (<> <Button
          startIcon={<Edit color={ColorPureWhite} />}
        sx={{ height: "40px" }}
        onClick={handleOpenEditGoalModal}
      >
        Editar metas
      </Button></>)}
    </Box>
  );
  const companiaBOX = (
    <Box
      sx={{
        display: "flex",
        marginBottom: "32px",
      }}
    >
      <Typography
        sx={{
          ...TextSmallFont,
          color: ColorPureBlack,
          marginY: "auto",
        }}
      >
        Compañía:
      </Typography>

      <Select
        name="company_catalog_selector"
        value={companyFolioToAdd}
        onChange={(event: any) => {
          handleChangeSelectedCompanyToAdd(event.target.value);
        }}
        sx={{
          ...TextSmallFont,
          color: ColorPureBlack,
          marginY: "auto",
          marginX: "20px",
        }}
        disabled={!annualGoalData || isAnnualGoalReadOnly}
      >
        {companyCatalogData.map((comp: any, index: number) => {
          //console.log('comp', comp)
          return (
          <MenuItem key={index} value={comp["folio"]}>
            {comp["corporateName"]}
          </MenuItem>
        )})}
      </Select>

      <Button
        startIcon={<Plus color={ColorPureWhite} />}
        disabled={!branchesFromCompanyToAdd.length || isAnnualGoalReadOnly}
        onClick={handleAddCompany}
      >
        Agregar
      </Button>
    </Box>
  );
  const tablaBOX = (
    <Box
      sx={{
        display: "flex",
        marginBottom: "32px",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: ColorGrayDark2,
              }}
            >
              <TableCell
                sx={{
                  ...LinkSmallFont,
                  color: ColorPureWhite,
                  borderRadius: "14px 0 0 0",
                  textAlign: "center",
                }}
              >
                Compañía
              </TableCell>

              <TableCell
                sx={{
                  ...LinkSmallFont,
                  color: ColorPureWhite,
                  borderRadius: "0 14px 0 0",
                  textAlign: "center",
                  width: "174px",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {annualGoalCompaniesData.length
              ? annualGoalCompaniesTable
              : annualGoalCompaniesSkeleton}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>);

const columns: GridColDef[] = [
  {
    field: "companyId",
    headerName: "ID",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Typography sx={TextSmallFont}>
        {params.row.companyId ?? "LAL"}
      </Typography>
    ),
  },
  {
    field: "Compañía",
    headerName: "Compañía",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Typography sx={TextSmallFont}>{params.row.company.corporateName ?? 'A HORSE WITH NO NAME'}</Typography>
    ),
  },
  {
    field: "actions",
    headerName: "Acciones",
    minWidth: 100,
    renderCell: (params) => (
      <Typography sx={TextSmallFont}>
        <IconButton onClick={()=>{handleOpenCompanyGoalModal(params.row, false)}}>
        {!isAnnualGoalReadOnly ? (<><Edit color={ColorPink} /></>) : (<><View color={ColorPink} /></>)}
        </IconButton>
        <IconButton onClick={()=>{handleDeleteCompanyGoal(params.row)}}
        disabled={isAnnualGoalReadOnly}>
        <Delete
          color={isAnnualGoalReadOnly ? ColorGrayDisabled : ColorPink}
         />
        </IconButton>
      </Typography>
    ),
  },
];

  return (
    <>
      <Title title={" Registro de metas por compañía"} url={(window.location.href).slice(SIZE_WEB_URL)} />
      <Paper sx={{ p: '24px', borderRadius: '16px' }}>

        {/* Año */}
        <Box sx={{ display: "flex", marginBottom: "32px" }}>
          <Typography
            sx={{
              ...TextSmallFont,
              color: ColorPureBlack,
              marginY: "auto",
            }}
          >
            Año:
          </Typography>
          <Select
            name="year_catalog_selector"
            value={selectedYear}
            onChange={(event: any) => {
              handleChangeSelectedYear(event.target.value);
            }}
            sx={{
              ...TextSmallFont,
              color: ColorPureBlack,
              marginY: "auto",
              marginX: "20px",
            }}
          >
            {yearsCatalog.map((year: any) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          <Button
            startIcon={<Search color={ColorPureWhite} />}
            onClick={handleQueryYear}

          >
            Consultar
          </Button>
        </Box>

        {/* Estatus */}
        <Collapse in={oculto}>
          {estatusBOX}
        </Collapse>
        {/* Compañia */}
        <Collapse in={oculto}>
          {companiaBOX}
        </Collapse>
        {/* Tabla */}
        <Collapse in={tablaVisibleState}>
          {/* {tablaBOX} */}
          <DataGrid
            rows={annualGoalCompaniesData ?? []}
            getRowId={(row) => row.companyId + ""}
            columns={columns.filter((col) => col.field != "companyId")}
            disableRowSelectionOnClick
          />
        </Collapse>
      </Paper>

      {(loadingScreen !== false) ? <LoadingScreen message="Cargando" /> : <></>}
      {alert}
      {companyGoalEditModal}
      {approveAnnualGoalModal}
      {editAnnualGoalModal}
    </>
  );
}
