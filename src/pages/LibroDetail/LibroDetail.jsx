import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import ModalLibro from "../../components/LibroModal/LibroModal.jsx";
import "./LibroDetail.scss"
import ModalConfirmacionBorrado from "../../components/ModalConfirmacionBorrar/ModalConfirmacionBorrado.jsx";

const LibroDetail = () => {
    const {id} = useParams();
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const [libro, setLibro] = useState(null);
    const [autor, setAutor] = useState(null);
    const [autores, setAutores] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentLibro, setCurrentLibro] = useState(null);

    const fetchLibroDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:3002/libros/${id}`, {
                headers: {'auth': auth}
            });
            setLibro(res.data);
            fetchAutor(res.data.autor); // Fetch the author details using the autor ID
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    const fetchAutor = async (autorId) => {
        try {
            const res = await axios.get(`http://localhost:3002/autores/${autorId}`, {
                headers: {'auth': auth}
            });
            setAutor(res.data);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    const fetchAllAutores = async () => {
        let allAutores = [];
        let page = 1;
        let totalPages = 1;

        try {
            do {
                const res = await axios.get('http://localhost:3002/autores', {
                    headers: {'auth': auth},
                    params: {page, limit: 10}  // Ajusta el límite según sea necesario
                });
                allAutores = [...allAutores, ...res.data.docs];
                totalPages = res.data.totalPages;
                page += 1;
            } while (page <= totalPages);

            setAutores(allAutores);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchLibroDetails();
        fetchAllAutores();
    }, [id]);

    const handleLibroAdded = () => {
        fetchLibroDetails();
    };

    const handleDeleteLibro = async () => {
        try {
            await axios.delete(`http://localhost:3002/libros/${currentLibro._id}`, {
                headers: {'auth': auth}
            });
            navigate('/'); // Navigate to the home page after deletion
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmDelete = (libro) => {
        setCurrentLibro(libro);
        setShowConfirmModal(true);
    };

    const handleEditLibro = (libro) => {
        setCurrentLibro(libro);
        setShowModal(true);
    };

    return (
        <div>
            {error ? (
                <p>Error obteniendo libro</p>
            ) : libro ? (
                <div>
                    <h1>{libro?.titulo}</h1>
                    <p><strong>Autor:</strong> {autor?.nombre} {autor?.apellido}</p>
                    <p><strong>ISBN:</strong> {libro?.isbn}</p>
                    <p><strong>Genero:</strong> {libro?.genero}</p>
                    <p><strong>Editorial:</strong> {libro?.editorial}</p>
                    <p><strong>Fecha de publicacion:</strong> {libro?.fechaPublicacion?.substring(0, 10)}</p>
                    <p><strong>Paginas:</strong> {libro?.paginas}</p>
                    <p><strong>Activo:</strong> {libro?.activo ? 'Yes' : 'No'}</p>
                    <button onClick={() => handleEditLibro(libro)}>Editar</button>
                    <button onClick={() => handleConfirmDelete(libro)}>Borrar</button>
                    {showModal && <ModalLibro libro={currentLibro} onClose={() => {
                        setShowModal(false);
                        setCurrentLibro(null);
                    }}
                                              onLibroAdded={handleLibroAdded} show={showModal}
                                              setCurrentLibro={setCurrentLibro} autores={autores}/>}
                    {showConfirmModal && <ModalConfirmacionBorrado
                        message="Are you sure you want to delete this book?"
                        onConfirm={() => {
                            handleDeleteLibro();
                            setShowConfirmModal(false);
                        }}
                        onCancel={() => setShowConfirmModal(false)}/>}
                </div>
            ) : (
                <p>El libro se ha eliminado</p>
            )}
        </div>
    );
};

export {LibroDetail};
