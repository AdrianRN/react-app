/**
 * Esta función está diseñada para procesar datos de un elemento input 
 * de tipo archivo (<input type="file">).
 * @param {HTMLInputElement} data - El elemento input de tipo archivo que contiene los datos del archivo.
 * @returns {Promise<{ fileName: string, fileExtension: string, fileBytes: string }>} - 
 *          Una promesa que se resuelve con los datos procesados del archivo, incluyendo su nombre, 
 *          extensión y bytes como una URL de datos.
 * Ejemplo de llamada:
 * await returnBinaries(e.target)
 */
function GetFileData(data: HTMLInputElement): Promise<{ fileName: string, fileExtension: string, fileBytes: string }> {

    //Se guarda una referencia al primer archivo seleccionado en la variable
    const selectedFile = data?.files?.[0];
    //Verificar si se seleccionó un archivo.
    if(selectedFile){
        // obtener el nombre del archivo seleccionado.
        const fileName = "" + data?.files?.[0].name;
        //Se crea una instancia de FileReader, que es una interfaz que permite leer archivos 
        //de forma asincrónica en el navegador.
        const reader = new FileReader();
        //Esto carga el archivo en el objeto FileReader como una URL de datos.
        reader.readAsDataURL(selectedFile);
        return new Promise((resolve, reject) => {
            //Se define un evento onload que se activa cuando se completa la lectura del archivo. 
            reader.onload = () => {
            /* Dentro de esta función de devolución de llamada, se accede al resultado 
            de la lectura del archivo a través de reader.result, 
            que contendrá la URL de datos del archivo*/
            
            //Se convierte a una cadena utilizando toString() y se asigna a readerSplit.
            var readerSplit: string = reader.result?.toString()??'';
            //Se obtiene la extensión del archivo.
            const currentExtensionFile: string = (fileName.substring(fileName.lastIndexOf("."), fileName.length));
            //Aqui se obtienen los bytes del archivo
            //Normalmente readerSplit se suele ver asi: 
            //data:application/pdf;base64,bytes_Del_Archivo
            if (readerSplit.lastIndexOf(",") > 0){
                readerSplit = readerSplit.substring(readerSplit.lastIndexOf(",") + 1, readerSplit.length);
            }
            resolve({
                fileName:fileName,
                fileExtension: currentExtensionFile,
                fileBytes: readerSplit,
            });
        }});
    }
    // Si no se selecciona ningún archivo, se devuelve un objeto vacío.
    return Promise.resolve({
        fileName:'',
        fileExtension: '',
        fileBytes: '',
    });
}
export default GetFileData;