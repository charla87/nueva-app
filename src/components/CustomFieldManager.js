// src/components/CustomFieldManager.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CustomFieldManager = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedCustomFields, setSelectedCustomFields] = useState({});
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

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        categories: selectedCategories,
        attributes: selectedAttributes,
        customFields: selectedCustomFields,
        createdAt: new Date(),
      });
      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setSelectedAttributes({});
      setSelectedCustomFields({});
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

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Gestor de Contenido</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/create-post">Crear Post</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/manage-categories">Publicar Categorías</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/manage-attributes">Publicar Atributos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/manage-custom-fields">Publicar Campos Personalizados</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
        <button type="submit" className="btn btn-primary">Publicar</button>
      </form>
    </div>
  );
};

export default CustomFieldManager;
