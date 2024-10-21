import http from "../common/HttpFileUpload";

const upload = (file, onUploadProgress) => {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

const getFiles = () => {
    return http.get("/home");
};

const FileUploadService = {
    upload,
    getFiles,
};

export default FileUploadService;