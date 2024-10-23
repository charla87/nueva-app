// src/components/ManageData.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageData = ({ type }) => {
  const [dataName, setDataName] = useState('');
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataSnapshot = await getDocs(collection(db, type));
      setDataList(dataSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, [type]);

  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, type), { name: dataName });
      setDataList([...dataList, { name: dataName }]);
      setDataName('');
    } catch (error) {
      console.error(`Error al agregar ${type}`, error);
    }
  };

  const handleUpdateData = async (id, newName) => {
    try {
      const dataDoc = doc(db, type, id);
      await updateDoc(dataDoc, { name: newName });
      setDataList(dataList.map(item => (item.id === id ? { ...item, name: newName } : item)));
    } catch (error) {
      console.error(`Error al actualizar ${type}`, error);
    }
  };

  const handleDeleteData = async (id) => {
    try {
      await deleteDoc(doc(db, type, id));
      setDataList(dataList.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error al eliminar ${type}`, error);
    }
  };

  return (
    <div className="container">
      <h2>Gestionar {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <form onSubmit={handleAddData}>
        <div className="mb-3">
          <label htmlFor="dataName" className="form-label">Nombre de {type}</label>
          <input
            type="text"
            className="form-control"
            id="dataName"
            value={dataName}
            onChange={(e) => setDataName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar {type}</button>
      </form>
      <ul className="list-group mt-3">
        {dataList.map((item) => (
          <li key={item.id} className="list-group-item">
            <input
              type="text"
              className="form-control d-inline w-50"
              value={item.name}
              onChange={(e) => handleUpdateData(item.id, e.target.value)}
            />
            <button className="btn btn-danger ms-3" onClick={() => handleDeleteData(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageData;
