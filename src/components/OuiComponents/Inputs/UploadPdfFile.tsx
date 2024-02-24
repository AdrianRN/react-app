/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ButtonMUI from '@mui/material/Button';
import { Attached, Print } from "../Icons";
import { ColorPink, ColorPinkDark } from "../Theme";
import Constants from "../../../utils/Constants";
import FileStorage from "../../../models/FileStorage";
import fileStorageService from "../../../services/fileStorage.service";
import { useAlertContext } from "../../../context/alert-context";
import { Tooltip } from "@mui/material";

const UploadPdfFile = ({ policyFolio, policyStatus }: any) => {
	const [pdfFile, setPdfFile] = useState<FileStorage | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileUrl, setFileUrl] = useState("");
	const [fileFolio, setFileFolio] = useState("");
	const [hasAttachedFile, setHasAttachedFile] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fileStorageService.getFileStorageByExternalFolio(policyFolio);
			const json = response.data;
			if (json.length > 0) {
				setHasAttachedFile(true);
				setFileFolio(json[0].folio);
				setFileUrl(json[0].fileUrl);
			} else {
				setHasAttachedFile(false);
			}
		}
		fetchData();
	}, [])

	const setBase64 = (file: any) => {
		if (fileUrl.length > 0) {
			handleDeletePreviousFile()
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const readerSplit = reader.result?.toString().split(",")[1] ?? null;
			const fileName = file.name.toString();
			const notes = file.notes;
			const fileExt = file.name.toString().split(".")[1];
			let updatedFileForm = { ...pdfFile };
			updatedFileForm.externalFolio = policyFolio ?? "";
			updatedFileForm.description = fileName;
			updatedFileForm.fileName = `${policyFolio} - ${fileName}`;
			updatedFileForm.notes = notes ?? "";
			updatedFileForm.fileExtension = fileExt;
			updatedFileForm.containerName = Constants.insurancePoliciesCoverContainerName;
			updatedFileForm.objectStatusId = 1;
			updatedFileForm.fileBytes = readerSplit ?? "";
			updatedFileForm.fileUrl = "";
			setPdfFile(updatedFileForm);
		};
	};

	const {
		autoHideDuration,
		setDataAlert,
	} = useAlertContext();

	useEffect(() => {
		const handleFileUpload = async () => {
			if (pdfFile?.fileBytes) {
				await fileStorageService
					.post(pdfFile)
					.then((response: any) => {
						if (response.message === "OK") {
							setDataAlert(
								true,
								"El archivo se adjuntó con éxito.",
								"success",
								autoHideDuration
							);
							setHasAttachedFile(true);
							setPdfFile(null);
							setFileFolio(response.data.folio)
							setFileUrl(response.data.fileUrl)
						} else {
							setDataAlert(true, response.message, "error", autoHideDuration);
						}
					})
					.catch((e: Error) => {
						setDataAlert(true, e.message, "error", autoHideDuration);
					});
			}
		}

		if (pdfFile !== undefined || pdfFile !== null) {
			handleFileUpload()
		}
	}, [pdfFile])

	const handleDeletePreviousFile = async () => {
		const checkExistingFile = await fileStorageService.getByFolio(fileFolio);
		if (checkExistingFile.data) {
			try {
				await fileStorageService.deleteByFolio(fileFolio)
			} catch (error) {
				console.log('Error al eliminar el archivo', error)
			}
		}
	}

	const handleDownloadFile = () => {
		window.open(fileUrl, "_blank");
	}

	return (
		<>
		
		<Tooltip title={"Adjuntar documento."}>
			<span>
			<ButtonMUI
				variant="contained"
				sx={{
					borderRadius: "10px",
					backgroundColor: ColorPink,
					"&:hover": { backgroundColor: ColorPinkDark },
				}}
				onClick={() => {
					if (inputRef.current) {
						inputRef.current.click();
					}
				}}
				disabled={(policyStatus !== Constants.statusPendingFolio)||hasAttachedFile}
			>
				<input
					type="file"
					accept=".pdf, application/pdf"
					hidden
					ref={inputRef}
					style={{ position: 'absolute', left: '-9999px' }}
					onChange={(e) => {
						if (e.target.files?.length) {
							setBase64(e.target.files[0]);
						}
					}}
				/>
				<Attached color="#FFF" />
			</ButtonMUI>
		</span>
		</Tooltip>
		<Tooltip title={"Imprimir documento adjunto."}>
		<span>
			<ButtonMUI
				variant="contained"
				sx={{
					borderRadius: "10px",
					backgroundColor: ColorPink,
					"&:hover": { backgroundColor: ColorPinkDark },
				}}
				disabled={!hasAttachedFile}
				onClick={handleDownloadFile}
			>
				<Print color="#FFF" />
			</ButtonMUI>
		</span>
		</Tooltip>
		</>
	);
}

export default UploadPdfFile;
