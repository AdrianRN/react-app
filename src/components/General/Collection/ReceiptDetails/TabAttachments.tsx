import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import {
    ColorPink,
    LinkLargeFont,
    TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { uploadSuretyXmlService } from "../../../../services/policyload.service";
import SuretyAddDto from "../../../../models/SuretyAddDto";
import { CircularProgress } from "../../../OuiComponents/Feedback";
import fileStorageService from "../../../../services/fileStorage.service";
import DownloadCloud from "../../../OuiComponents/Icons/DownloadCloud";
import Save from '../../../OuiComponents/Icons/Save';
import { Delete } from "../../../OuiComponents/Icons";
import FileStorage from "../../../../services/fileStorageController.service";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import IFileStorage from "../../../../models/FileStorage";
import Constants from "../../../../utils/Constants";
import ReceiptsService from "../../../../services/receipts.service";

const StyledBox = styled(Box)({
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: "100%",
    padding: '20px',
    width: '100%'

});


export default function TabAttachments(props: any) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loadingFile, setLoadingFile] = React.useState(false);
    const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(
        null
    );
    const [response, setResponse] = useState<SuretyAddDto | undefined>(undefined);
    const [dataDocs, setDataDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [receiptFolio, setReceiptFolio] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    

    const {
        isSnackbarOpen,
        severity,
        messageAlert,
        autoHideDuration,
        handleSnackbarClose,
        setDataAlert,
    } = useAlertContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fileStorageService.getFileStorageByExternalFolio(props.data.receiptFolio);
                const receiptFolio = props.data.receiptFolio;
                setReceiptFolio(receiptFolio);
                await ReceiptsService.patchFlags(receiptFolio, "hasFiles", true);
                const dataWithIds = response.data.map((item: any, index: number) => ({ id: index + 1, ...item }));
                setDataDocs(dataWithIds);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [props.data.receiptFolio]);

    const handleSave = (fileUrl: string) => {
        window.location.href = fileUrl;
    };

    const handleDelete = async (folio: string) => {
        try {
            await FileStorage.deleteFileStoragebyFolio(folio);
            const updatedData = dataDocs.filter((item: any) => item.folio !== folio);
            if (updatedData.length === 0) {
                setUploadedFileName(null);
                await ReceiptsService.patchFlags(receiptFolio, "hasFiles", false);
            }
            setDataAlert(true, "Eliminado exitosamente.", "success", autoHideDuration);
            setDataDocs(updatedData);
        } catch (error) {
            console.error(`Error al eliminar el archivo con folio ${folio}:`, error);
        }
    };

    const columns = [
        { field: 'fileName', headerName: 'Documento', flex: 1 },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            renderCell: (params: any) => (
                <>
                    <IconButton onClick={() => handleSave(params.row.fileUrl)}>
                        <Save color={ColorPink} />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(params.row.folio)}>
                        <Delete color={ColorPink} />
                    </IconButton>
                </>
            ),
        },
    ];


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/xml",
      ];
      const maxSize = 25 * 1024 * 1024;

      // Verifica si se seleccionó un archivo
      if (!e.target.files || e.target.files.length === 0) {
        // No se seleccionó ningún archivo, puedes manejarlo aquí si es necesario
        return;
      }

      setLoadingFile(true);

      const selectedFile = e.target.files[0];

      if (selectedFile.size > maxSize) {
        setDataAlert(
          true,
          "El archivo es demasiado grande. Tamaño máximo permitido: 25 MB",
          "error",
          autoHideDuration
        );
        await setUploadedFileName("");
        setLoadingFile(false);
        return;
      }

      if (
        allowedTypes.includes(selectedFile.type) ||
        selectedFile.type === ".exe"
      ) {
        setUploadedFileName(selectedFile.name);

        try {
          const { name, content } = await getContentInBytes(selectedFile);

          // Construye el objeto FileStorage
          const fileStorageObject: IFileStorage = {
            externalFolio: props.data.receiptFolio,
            fileName: selectedFile.name,
            description: selectedFile.name,
            notes: selectedFile.name,
            fileExtension: selectedFile.type,
            fileBytes: content,
            containerName: Constants.receiptdocumentsContainerName,
            objectStatusId: 1,
            effectiveDate: selectedFile.name,
            issueDate: selectedFile.name,
          };

          // Realiza la solicitud POST
          const responseApi = await fileStorageService.post(fileStorageObject);

          // Agrega el nuevo elemento al array dataDocs
          const newData: any = [
            ...dataDocs,
            { id: dataDocs.length + 1, ...responseApi.data },
          ];

          // Actualiza los datos del DataGrid
          setDataDocs(newData);
          setDataAlert(
            true,
            "Archivo cargado exitosamente",
            "success",
            autoHideDuration
          );

          // Otras operaciones después de la actualización, si es necesario
        } catch (error) {
          setDataAlert(
            true,
            "El archivo seleccionado es demasiado grande",
            "error",
            autoHideDuration
          );
          setUploadedFileName("");
          console.error("Error:", error);
          // Manejar el error, si es necesario
        } finally {
          // Operaciones finales, si es necesario
          setLoadingFile(false);
        }
      } else {
        const extension = getExtensionFromMime(selectedFile.type);

        setDataAlert(
          true,
          `El tipo de archivo "${extension}" no esta permitido. Por favor, selecciona un archivo válido.`,
          "error",
          autoHideDuration
        );
        setUploadedFileName("");
        setLoadingFile(false);
      }
    };

    function getExtensionFromMime(mimeType: string): string {
      const mimeToExtension: { [key: string]: string } = {
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          ".docx",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          ".xlsx",
        "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          ".pptx",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
        "audio/mpeg": ".mp3",
        "audio/wav": ".wav",
        "video/mp4": ".mp4",
        "video/mpeg": ".mpeg",
        "video/quicktime": ".mov",
        "application/zip": ".zip",
        "application/x-msdownload": ".exe",
        "text/plain": ".txt",
        "application/json": ".json",
      };

      return mimeToExtension[mimeType] || "";
    }

    async function getContentInBytes(
      file: File
    ): Promise<{ name: string; content: string }> {
      const nameFile: string = file.name;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          // El resultado de la lectura es un ArrayBuffer
          const buffer = reader.result as ArrayBuffer;

          try {
            // Convierte el ArrayBuffer a un array de bytes utilizando Uint8Array
            //const bytes: any = new Uint8Array(buffer);

            // Convierte el array de bytes a una cadena base64
            const base64Content = arrayBuffertoBase64(buffer);

            resolve({ name: nameFile, content: base64Content });
          } catch (error) {
            console.log("Error en la conversión a base64:", error);
            reject(error);
          }
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    }

    const arrayBuffertoBase64 = (buffer: ArrayBuffer): string => {
      let binary = "";
      const bytes = new Uint8Array(buffer);

      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    return (
        <>
            <Box maxWidth="auto">
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Documentos
                </Typography>
                <Stack direction="column">
                    <Stack direction="row" display="flex" spacing={1}>
                        <Grid
                            container
                            flexGrow={1}
                            flexBasis={0}
                            rowSpacing={1}
                            columnSpacing={{ xs: 1 }}
                        >
                            <Grid item xs={12} alignSelf="center">
                                <StyledBox
                                    height="70%"
                                    width="100%"
                                    borderRadius={3}
                                    sx={{
                                        cursor: "pointer",
                                        position: "relative",
                                        marginBottom: '30px',
                                        backgroundColor: '#ececec',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        accept=".jpg, .png, .pdf, .xml"
                                        hidden
                                        ref={inputRef}
                                        onChange={handleFileChange}
                                    />
                                    {loadingFile && (
                                        <CircularProgress
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                            }}
                                            size={20}
                                        />
                                    )}
                                    <Box height="inherit" width="inherit" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <DownloadCloud color="#8f91aa" />
                                        <Typography sx={{ marginLeft: '10px' }}>
                                            {uploadedFileName
                                                ? (
                                                    <span>
                                                        <span style={{ color: '#525469' }}>Archivo:</span>
                                                        <strong style={{ fontSize: '16px', color: '#E5105d' }}> {uploadedFileName}</strong>
                                                    </span>
                                                )
                                                : (
                                                    <span>
                                                        <span style={{ color: '#525469' }}>Selecciona un archivo</span>
                                                        <strong style={{ fontSize: '16px', color: '#E5105d' }}> .jpg .png .pdf .xml</strong>
                                                    </span>
                                                )}
                                        </Typography>
                                    </Box>
                                </StyledBox>
                            </Grid>


                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <DataGrid
                                    rows={dataDocs}
                                    columns={columns}
                                    disableRowSelectionOnClick
                                    sx={{ mt: 2 }}
                                />
                            )}

                            <MessageBar
                                open={isSnackbarOpen}
                                severity={severity}
                                message={messageAlert}
                                close={handleSnackbarClose}
                                autoHideDuration={autoHideDuration}
                            />


                        </Grid>
                    </Stack>
                </Stack>
                {/* <Grid item xs={12} md={20} textAlign="end">
                    <Button type="submit">Guardar</Button>
                </Grid> */}
            </Box>
        </>
    );
}
