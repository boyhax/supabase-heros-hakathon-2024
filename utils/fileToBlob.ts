export default function fileToBlob(file:File):Promise<Blob> {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as BlobPart;
            const blob = new Blob([arrayBuffer], { type: file.type });
            resolve(blob);
        };

        reader.onerror = () => {
            reader.abort();
            reject(new Error('Error reading file.'));
        };

        reader.readAsArrayBuffer(file);
    });
}