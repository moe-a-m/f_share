import React, { useState, useEffect, useRef } from "react";
import UploadService from "../services/FileUploadService";
import FileDetails from "./FileDetails"; // Import the FileDetails component

const UserFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileTags, setFileTags] = useState([]);
    const [progressInfos, setProgressInfos] = useState({ val: [] });
    const [message, setMessage] = useState([]);
    const [imageInfos, setImageInfos] = useState([]);
    const progressInfosRef = useRef(null);
    const [selectedFileId, setSelectedFileId] = useState(null); // State variable for selected file ID

    useEffect(() => {
        UploadService.getFiles().then((response) => {
            console.log("Files received:", response.data); // Debugging: Log the received files
            setImageInfos(response.data);
        });
    }, []);

    const selectFiles = (event) => {
        let images = [];
        let initialTags = [];

        for (let i = 0; i < event.target.files.length; i++) {
            images.push(URL.createObjectURL(event.target.files[i]));
            initialTags.push([]); // Initialize tags for each file
        }

        setSelectedFiles(event.target.files);
        setImagePreviews(images);
        setFileTags(initialTags);
        setProgressInfos({ val: [] });
        setMessage([]);
    };

    function handleTagChange(event) {
        const newTags = event.target.value.split(','); // Assuming tags are comma-separated
        setFileTags(newTags);
    }

    const upload = (idx, file) => {
        let _progressInfos = [...progressInfosRef.current.val];
        return UploadService.upload(file, [], (event) => {
            _progressInfos[idx].percentage = Math.round(
                (100 * event.loaded) / event.total
            );
            setProgressInfos({ val: _progressInfos });
        })
            .then(() => {
                setMessage((prevMessage) => [
                    ...prevMessage,
                    "Uploaded the image successfully: " + file.name,
                ]);
                // Refresh the file list after upload
                return UploadService.getFiles();
            })
            .then((files) => {
                setImageInfos(files.data);
            })
            .catch(() => {
                _progressInfos[idx].percentage = 0;
                setProgressInfos({ val: _progressInfos });

                setMessage((prevMessage) => [
                    ...prevMessage,
                    "Could not upload the image: " + file.name,
                ]);
            });
    };

    const uploadMedia = () => {
        const files = Array.from(selectedFiles);

        let _progressInfos = files.map((file) => ({
            percentage: 0,
            fileName: file.name,
        }));

        progressInfosRef.current = {
            val: _progressInfos,
        };

        const uploadPromises = files.map((file, i) => upload(i, file));

        Promise.all(uploadPromises)
            .then(() => {
                setMessage([]);
                setImagePreviews([]); // Clear previews after upload
            })
            .catch((error) => {
                console.error("Error uploading files:", error);
            });
    };

    return (
        <div className="container">
            {/* File selection and upload section */}
            <div className="my-3">
                <label className="btn btn-default p-0">
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={selectFiles}
                    />
                </label>
                <input type="text" value={fileTags} onChange={handleTagChange} />
                <div>
                    {/* Other note content */}
                    <div>
                        {fileTags.map((tag, index) => (
                            <span key={index} className="badge bg-primary">{tag}</span>
                        ))}
                    </div>
                </div>
                <button
                    className="btn btn-success btn-sm"
                    disabled={!selectedFiles}
                    onClick={uploadMedia}
                >
                    Upload
                </button>
            </div>
            {progressInfos &&
                        progressInfos.val.length > 0 &&
                        progressInfos.val.map((progressInfo, index) => (
                            <div className="mb-2" key={index}>
                                <span>{progressInfo.fileName}</span>
                                <div className="progress">
                                    <div
                                        className="progress-bar progress-bar-info"
                                        role="progressbar"
                                        aria-valuenow={progressInfo.percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{ width: progressInfo.percentage + "%" }}
                                    >
                                        {progressInfo.percentage}%
                                    </div>

                                </div>
                            </div>
                        ))}

                    {imagePreviews && (
                        <div>
                            {imagePreviews.map((img, i) => {
                                return (
                                    <img className="img-thumbnail" src={img} alt={"image-" + i} key={i} />
                                );
                            })}
                        </div>
                    )}

                    {message.length > 0 && (
                        <div className="alert alert-secondary mt-2" role="alert">
                            <ul>
                                {message.map((item, i) => {
                                    return <li key={i}>{item}</li>;
                                })}
                            </ul>
                        </div>
                    )}


            {/* List of uploaded files */}
            {imageInfos.length > 0 && (
                <div className="card mt-3">
                    <div className="card-header">List of Media</div>
                    <ul className="list-group list-group-flush">
                        {imageInfos.map((img, index) => (
                            <li
                                className="list-group-item"
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedFileId(img._id)} // Use _id for the file ID
                            >
                                <p>
                                    <strong>{img.originalName}</strong>
                                </p>
                                <img src={img.url} alt={img.name} height="80px" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display FileDetails component when a file is selected */}
            {selectedFileId && (
                <div className="mt-3">
                    <FileDetails fileId={selectedFileId} />
                    <button
                        className="btn btn-secondary mt-2"
                        onClick={() => setSelectedFileId(null)} // Allow closing the details view
                    >
                        Close Details
                    </button>
                </div>
            )}

            
        </div>
    );
};

export default UserFiles;
