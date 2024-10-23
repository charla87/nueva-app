// src/components/AttributeManager.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AttributeManager = () => {
  const [attributeName, setAttributeName] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      const attributesSnapshot = await getDocs(collection(db, 'attributes'));
      setAttributes(attributesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAttributes();
  }, []);

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'attributes'), { name: attributeName, value: attributeValue });
      setAttributes([...attributes, { name: attributeName, value: attributeValue }]);
      setAttributeName('');
      setAttributeValue('');
    } catch (error) {
      console.error("Error al agregar el atributo", error);
    }
  };

  return (
    <div className="container">
      <h2>Gestionar Atributos</h2>
      <form onSubmit={handleAddAttribute}>
        <div className="mb-3">
          <label htmlFor="attributeName" className="form-label">Nombre del Atributo</label>
          <input
            type="text"
            className="form-control"
            id="attributeName"
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="attributeValue" className="form-label">Valor del Atributo</label>
          <input
            type="text"
            className="form-control"
            id="attributeValue"
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Atributo</button>
      </form>
      <ul className="list-group mt-3">
        {attributes.map((attribute) => (
          <li key={attribute.id} className="list-group-item">
            {attribute.name}: {attribute.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeManager;
