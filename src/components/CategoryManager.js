// src/components/CategoryManager.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'categories'), { name: categoryName });
      setCategories([...categories, { name: categoryName }]);
      setCategoryName('');
    } catch (error) {
      console.error("Error al agregar la categoría", error);
    }
  };

  return (
    <div className="container">
      <h2>Gestionar Categorías</h2>
      <form onSubmit={handleAddCategory}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Nombre de la Categoría</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Categoría</button>
      </form>
      <ul className="list-group mt-3">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item">{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
