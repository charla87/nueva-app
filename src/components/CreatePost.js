// src/components/CreatePost.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedCustomFields, setSelectedCustomFields] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const attributesSnapshot = await getDocs(collection(db, 'attributes'));
        const customFieldsSnapshot = await getDocs(collection(db, 'customFields'));

        setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setAttributes(attributesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCustomFields(customFieldsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar datos", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const imagesRef = ref(storage, 'images/');
      try {
        const result = await listAll(imagesRef);
        const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
        setImages(urls);
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadImage = () => {
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
          setImageUrl(downloadURL);
          setImages((prev) => [...prev, downloadURL]);
          setUploading(false);
        });
      }
    );
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        categories: selectedCategories,
        attributes: selectedAttributes,
        customFields: selectedCustomFields,
        imageUrl,
        createdAt: new Date(),
      });
      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setSelectedAttributes({});
      setSelectedCustomFields({});
      setFile(null);
      setImageUrl('');
    } catch (error) {
      console.error("Error al crear el post", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleAttributeChange = (attributeName, attributeValue) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: attributeValue,
    }));
  };

  const handleCustomFieldChange = (fieldName, fieldValue) => {
    setSelectedCustomFields((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const selectImage = (url) => {
    setImageUrl(url);
    closeModal();
  };

  return (
    <div className="container">
      <h2>Crear Post</h2>
      <form onSubmit={handleAddPost}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título</label>
          <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Contenido</label>
          <textarea className="form-control" id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Categorías</label>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                />
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label className="form-label">Atributos</label>
          <ul>
            {attributes.map((attribute) => (
              <li key={attribute.id}>
                <label>
                  {attribute.name}: 
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedAttributes[attribute.name] || ''}
                    onChange={(e) => handleAttributeChange(attribute.name, e.target.value)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label className="form-label">Campos Personalizados</label>
          <ul>
            {customFields.map((field) => (
              <li key={field.id}>
                <label>
                  {field.name}: 
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedCustomFields[field.name] || ''}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Subir Imagen</label>
          <input type="file" className="form-control" id="file" onChange={handleFileChange} />
          <button type="button" className="btn btn-secondary mt-2" onClick={handleUploadImage} disabled={!file || uploading}>
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
          </button>
        </div>
        <div className="mb-3">
          <button type="button" className="btn btn-info" onClick={openModal}>Seleccionar Imagen de la Galería</button>
        </div>
        {imageUrl && (
          <div className="mb-3">
            <p>Imagen seleccionada:</p>
            <img src={imageUrl} alt="Selected" style={{ maxWidth: '200px', cursor: 'pointer' }} onClick={openModal} />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Publicar</button>
      </form>

      <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h5 id="modal-modal-title">Seleccionar Imagen</h5>
          <div className="image-gallery" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Imagen ${index + 1}`}
                style={{ maxWidth: '100px', cursor: 'pointer', margin: '5px' }}
                onClick={() => selectImage(url)}
              />
            ))}
          </div>
          <Button variant="contained" color="secondary" onClick={closeModal} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreatePost;
