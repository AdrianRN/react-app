import ErrorPage from "./ErrorPage";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";
import { ErrorInfo } from "react-dom/client";
import blobStorageService from  "../../../services/blobstorage.service";
import Constants  from  "../../../utils/Constants"; 

export default function ReactErrorBoundary(props: any) {


    function logErrorToServer(error: Error, errorInfo: ErrorInfo, componentInfo: string, dateTime: Date, user: string) {
        
        const logMessage = `
          *******************************  
          Error: ${error.message}
          Stack Trace: ${error.stack}
          Additional Info: ${JSON.stringify(errorInfo)}
          Component Info: ${componentInfo}
          TimeStamp ${dateTime.toISOString()}
          User: ${user}
          *******************************  
        `;
        const currentDateTime = roundToNearestHour(dateTime);
        const logMessageError = btoa(logMessage);
        const fileName = `front_log_${formatDate(currentDateTime, 'DDMMYYYY')}_${process.env.NODE_ENV==='development'?"dev":"prod"}.txt`;
        postWriteLogs(logMessageError,fileName);
      }
    
      const postWriteLogs = async (logs: string,fileName: string) => {
        try {
        const response = await blobStorageService.post(Constants.logsErrorsContainerName,fileName, logs);
        } catch (error) {
          // Manejo de errores
          console.error("Error al obtener datos:", error);
        }
      };
      function roundToNearestHour(date: Date): Date {
        const roundedDate = new Date(date);
        roundedDate.setMinutes(0);
        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);
        return roundedDate;
      }
      function formatDate(date: Date, format: string): string {
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
        };
        const formatter = new Intl.DateTimeFormat('es-ES', options);
        const formattedDate = formatter.format(date);
        return format.replace(/YYYY/, formattedDate.slice(6, 10))
          .replace(/MM/, formattedDate.slice(3, 5))
          .replace(/DD/, formattedDate.slice(0, 2))
          .replace(/HH/, formattedDate.slice(12, 14));
      }

    return (
        <ErrorBoundary
            FallbackComponent={ErrorPage}
            onError={(error, errorInfo) => {
                // log the error
                const componentStack = errorInfo.componentStack;
                const componentLines = componentStack.split('\n');
                const relevantComponentLine = componentLines[1];
                const currentDateTime = new Date();
                const user = localStorage.getItem("userEmail") ?? "";
				logErrorToServer(error, errorInfo, relevantComponentLine, currentDateTime, user);
            }}
            onReset={() => {
                // reloading the page to restore the initial state
                // of the current page
                console.log("reloading the page...");
                window.location.reload();
                // other reset logic...
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
}