import http from "../common/HttpFileUpload";

// Assuming http has baseURL set to http://localhost:3001
const upload = (file, tags, onUploadProgress) => {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("tags", JSON.stringify(tags));

    return http.post("/file/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};


const getFile = (id) => {
    return http.get(`/file/${id}`);
};

const getFiles = () => {
    return http.get("/file/files");
};

const downloadFile = (id) => {
    return http.get(`/file/download/${id}`, {
        responseType: 'blob', // Important for file downloads
    });

};

const FileUploadService = {
    upload,
    getFiles,
    getFile,
    downloadFile,
};

export default FileUploadService;
