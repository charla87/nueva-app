// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import ManageData from './components/ManageData';
import UploadImage from './components/UploadImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">React Firebase App</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/create-post">Crear Post</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/upload-image">Subir Imagen</Link>
                    </li>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        id="manageDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Gestionar Datos
                      </Link>
                      <ul className="dropdown-menu" aria-labelledby="manageDropdown">
                        <li>
                          <Link className="dropdown-item" to="/manage-categories">Categorías</Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/manage-attributes">Atributos</Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/manage-custom-fields">Campos Personalizados</Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/posts">Mis Publicaciones</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={user ? <CreatePost /> : <Login setUser={setUser} />} />
          <Route path="/create-post" element={user ? <CreatePost /> : <Login setUser={setUser} />} />
          <Route path="/upload-image" element={user ? <UploadImage /> : <Login setUser={setUser} />} />
          <Route path="/posts" element={user ? <PostList /> : <Login setUser={setUser} />} />
          <Route path="/manage-categories" element={user ? <ManageData type="categories" /> : <Login setUser={setUser} />} />
          <Route path="/manage-attributes" element={user ? <ManageData type="attributes" /> : <Login setUser={setUser} />} />
          <Route path="/manage-custom-fields" element={user ? <ManageData type="customFields" /> : <Login setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
