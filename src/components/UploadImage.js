// src/components/UploadImage.js
import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Puedes añadir lógica para mostrar el progreso de carga
      },
      (error) => {
        console.error('Error al subir archivo:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="container">
      <h2>Subir Imagen</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        className="btn btn-primary mt-3"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Subiendo...' : 'Subir'}
      </button>
      {url && (
        <div className="mt-3">
          <p>Imagen subida correctamente:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ver Imagen
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
