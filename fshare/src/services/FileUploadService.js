import http from "../common/HttpFileUpload";

// Assuming http has baseURL set to http://localhost:3001
const upload = (file, tags, onUploadProgress) => {
    console.log(file);
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

const getFiles = () => {
    return http.get("/file/files");
};


const FileUploadService = {
    upload,
    getFiles,
};

export default FileUploadService;
