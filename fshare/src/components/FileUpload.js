import React, { useState, useEffect, useRef } from "react";

import UploadService from "../services/FileUploadService";

const Home = () => {
    const [content, setContent] = useState("");
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
        let images = [];

        for (let i = 0; i < event.target.files.length; i++) {
            images.push(URL.createObjectURL(event.target.files[i]));
        }

        setSelectedFiles(event.target.files);
        setImagePreviews(images);
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
    

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>placeholder</h3>
            </header>
            <label className="btn btn-default p-0">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={selectFiles}
                />
            </label>
        </div>
    );
};

export default Home;