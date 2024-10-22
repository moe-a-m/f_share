import React, { useEffect, useState } from 'react';
import FileUploadService from '../services/FileUploadService';

const FileDetails = ({ fileId }) => {
    const [file, setFile] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        FileUploadService.getFile(fileId)
            .then(response => {
                setFile(response.data);
            })
            .catch(error => {
                console.error('Error fetching file:', error);
            });
    }, [fileId]);

    const handleDownload = () => {
        FileUploadService.downloadFile(fileId)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.originalName);
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };

    if (!file) return <div>Loading...</div>;

    return (
        <div>
            <h2>File Details</h2>
            <p><strong>Name:</strong> {file.originalName}</p>
            <p><strong>Type:</strong> {file.fileType}</p>
            <p><strong>Uploaded At:</strong> {new Date(file.uploadDate).toLocaleString()}</p>
            <p><strong>Tags:</strong> {file.tags.join(', ')}</p>
            {imagePreviews && (
                <div>
                    {imagePreviews.map((img, i) => {
                        return (
                            <img className="img-thumbnail" src={img} alt={"image-" + i} key={i} />
                        );
                    })}
                </div>
            )}
            <button onClick={handleDownload}>Download</button>
        </div>
    );
};

export default FileDetails;
