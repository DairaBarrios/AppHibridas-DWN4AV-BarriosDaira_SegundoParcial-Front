import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ModalAutor from '../../components/AutorModal/AutorModal';
import {AuthContext} from '../../context/AuthContext';
import "./AutorDetail.scss"

const AutorDetail = () => {
    const {id} = useParams();
    const {auth} = useContext(AuthContext);
    const [autor, setAutor] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchAutorDetails();
    }, [id]);

    const fetchAutorDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:3002/autores/${id}`, {
                headers: {'auth': auth}
            });
            setAutor(res.data);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    const handleAutorUpdated = () => {
        fetchAutorDetails();
        setShowModal(false);
    };

    const handleEditAutor = () => {
        setShowModal(true);
    };

    return (
        <div>
            {error ? (
                <p>Error al obtener datos.</p>
            ) : autor ? (
                <div>
                    <h1>{autor.nombre} {autor.apellido}</h1>
                    <p><strong>Nacionalidad:</strong> {autor.nacionalidad}</p>
                    <p><strong>Fecha de nacimiento:</strong> {autor.fechaNacimiento?.substring(0, 10)}</p>
                    <button onClick={handleEditAutor}>Editar</button>
                    {showModal && (
                        <ModalAutor
                            autor={autor}
                            onClose={() => setShowModal(false)}
                            onAutorAdded={handleAutorUpdated}
                            setCurrentAutor={() => setAutor(autor)}
                        />
                    )}
                </div>
            ) : (
                <p>Autor no encontrado</p>
            )}
        </div>
    );
};

export {AutorDetail};
