import React, { useState, useEffect, useRef } from "react";
import UploadService from "../services/FileUploadService";

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileTags, setFileTags] = useState([]);
    const [progressInfos, setProgressInfos] = useState({ val: [] });
    const [message, setMessage] = useState([]);
    const [imageInfos, setImageInfos] = useState([]);
    const progressInfosRef = useRef(null);

    useEffect(() => {
        UploadService.getFiles().then((response) => {
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

    const handleTagChange = (fileIndex, tags) => {
        let newFileTags = [...fileTags];
        newFileTags[fileIndex] = tags;
        setFileTags(newFileTags);
    };

    const upload = (idx, file) => {
        let _progressInfos = [...progressInfosRef.current.val];
        const tags = fileTags[idx]; // Get tags for the current file

        return UploadService.upload(file, tags, (event) => {
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

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>Upload Files with Tags</h3>
            </header>
            <label className="btn btn-default p-0">
                <input
                    type="file"
                    multiple
                    accept="image/*,video/mp4,video/x-m4v,video/*"
                    onChange={selectFiles}
                    className="img-thumbnail"
                />
            </label>

            {imagePreviews.length > 0 && (
                <div className="preview-container">
                    {imagePreviews.map((image, index) => (
                        <div key={index} className="preview-item">
                            <img
                                className="preview"
                                src={image}
                                alt={"preview " + index}
                            />
                            <input
                                type="text"
                                placeholder="Enter tags separated by commas"
                                value={fileTags[index].join(",")}
                                onChange={(e) =>
                                    handleTagChange(
                                        index,
                                        e.target.value.split(",")
                                    )
                                }
                            />
                            <button
                                onClick={() =>
                                    upload(index, selectedFiles[index])
                                }
                            >
                                Upload
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {message.length > 0 && (
                <div className="alert alert-secondary" role="alert">
                    <ul>
                        {message.map((item, i) => {
                            return <li key={i}>{item}</li>;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
