// src/components/PostList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategories, setEditedCategories] = useState([]);
  const [editedAttributes, setEditedAttributes] = useState({});
  const [editedCustomFields, setEditedCustomFields] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error al eliminar el post", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedCategories(post.categories || []);
    setEditedAttributes(post.attributes || {});
    setEditedCustomFields(post.customFields || {});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "posts", editingPost.id), {
        title: editedTitle,
        content: editedContent,
        categories: editedCategories,
        attributes: editedAttributes,
        customFields: editedCustomFields,
      });
      setPosts(posts.map(post => post.id === editingPost.id ? { ...post, title: editedTitle, content: editedContent, categories: editedCategories, attributes: editedAttributes, customFields: editedCustomFields } : post));
      setEditingPost(null);
    } catch (error) {
      console.error("Error al actualizar el post", error);
    }
  };

  return (
    <div className="container">
      <h2>Mis Publicaciones</h2>
      {editingPost ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label htmlFor="editedTitle" className="form-label">Editar Título</label>
            <input type="text" className="form-control" id="editedTitle" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="editedContent" className="form-label">Editar Contenido</label>
            <textarea className="form-control" id="editedContent" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="editedCategories" className="form-label">Categorías</label>
            <ul>
              {editedCategories.map((category, index) => (
                <li key={index}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={category}
                    onChange={(e) => {
                      const updatedCategories = [...editedCategories];
                      updatedCategories[index] = e.target.value;
                      setEditedCategories(updatedCategories);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <label htmlFor="editedAttributes" className="form-label">Atributos</label>
            <ul>
              {Object.entries(editedAttributes).map(([name, value], index) => (
                <li key={index}>
                  <strong>{name}:</strong>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={value}
                    onChange={(e) => {
                      const updatedAttributes = { ...editedAttributes };
                      updatedAttributes[name] = e.target.value;
                      setEditedAttributes(updatedAttributes);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <label htmlFor="editedCustomFields" className="form-label">Campos Personalizados</label>
            <ul>
              {Object.entries(editedCustomFields).map(([name, value], index) => (
                <li key={index}>
                  <strong>{name}:</strong>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={value}
                    onChange={(e) => {
                      const updatedFields = { ...editedCustomFields };
                      updatedFields[name] = e.target.value;
                      setEditedCustomFields(updatedFields);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingPost(null)}>Cancelar</button>
        </form>
      ) : (
        <ul className="list-group">
          {posts.map(post => (
            <li key={post.id} className="list-group-item">
              <h5>{post.title}</h5>
              <p>{post.content}</p>
              <ul>
                {post.categories && post.categories.map((category, index) => (
                  <li key={index}><strong>Categoría:</strong> {category}</li>
                ))}
                {post.attributes && Object.entries(post.attributes).map(([name, value], index) => (
                  <li key={index}><strong>{name}:</strong> {value}</li>
                ))}
                {post.customFields && Object.entries(post.customFields).map(([name, value], index) => (
                  <li key={index}><strong>{name}:</strong> {value}</li>
                ))}
              </ul>
              <button className="btn btn-warning me-2" onClick={() => handleEdit(post)}>Editar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
