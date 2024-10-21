import React, { useState, useEffect, useRef } from "react";

import UploadService from "../services/FileUploadService";

const Home = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [imagePreviews, setImagePreviews] = useState([]);
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
        let media = [];

        for (const element of event.target.files) {
            media.push(URL.createObjectURL(element));
        }

        setSelectedFiles(event.target.files);
        setImagePreviews(media);
        setProgressInfos({ val: [] });
        setMessage([]);
    };

    const upload = (idx, file) => {
        let _progressInfos = [...progressInfosRef.current.val];
        return UploadService.upload(file, (event) => {
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
            .then(() => UploadService.getFiles())
            .then((files) => {
                setImageInfos(files.data);
            });

        setMessage([]);
    };

    
    return (
        <div className="col-md-12">
            <div className="card card-container">
                <div className="container">
                    <div className="form-group">
                        <label className="btn btn-default p-0">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={selectFiles}
                            />
                        </label>
                    </div>
                    <div className="col-4">
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
                                    <img className="img" src={img} alt={"image-" + i} key={i} />
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

                    {/* {imageInfos.length > 0 && (
                        <div className="card mt-3">
                            <div className="card-header">List of media</div>
                            <ul className="list-group list-group-flush">
                                {imageInfos.map((img, index) => (
                                    <li className="list-group-item" key={index}>
                                        <p>
                                            <a href={img.url}>{img.name}</a>
                                        </p>
                                        <img src={img.url} alt={img.name} height="80px" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )} */}
                </div>
            </div>
        </div>

    );
};

export default Home;