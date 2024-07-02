import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from "../../context/AuthContext.jsx";
import './AutorModal.scss';

const ModalAutor = ({autor, onClose, onAutorAdded, setCurrentAutor}) => {
    const {auth} = useContext(AuthContext);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (autor) {
            setNombre(autor.nombre);
            setApellido(autor.apellido);
            setNacionalidad(autor.nacionalidad);
            setFechaNacimiento(autor.fechaNacimiento?.substring(0, 10));
        } else {
            setNombre('');
            setApellido('');
            setNacionalidad('');
            setFechaNacimiento('');
        }
    }, [autor]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!apellido.trim()) {
            setError('El apellido es obligatorio');
            return;
        }

        if (!nacionalidad.trim()) {
            setError('La nacionalidad es obligatoria');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (fechaNacimiento && fechaNacimiento > today) {
            setError('La fecha de nacimiento no puede ser en el futuro');
            return;
        }

        setError('');

        try {
            const newAutor = {
                nombre,
                apellido,
                nacionalidad,
                fechaNacimiento,
            };

            if (autor) {
                await axios.put('http://localhost:3002/autores/' + autor._id, newAutor, {
                    headers: {'auth': auth}
                });
                setCurrentAutor(null);
            } else {
                await axios.post('http://localhost:3002/autores', newAutor, {
                    headers: {'auth': auth}
                });
            }
            onAutorAdded();
            onClose();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{autor ? 'Editar Autor' : 'Agregar Nuevo Autor'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Apellido</label>
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Nacionalidad</label>
                        <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)}
                               required/>
                    </div>
                    <div>
                        <label>Fecha de nacimiento</label>
                        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
                               required/>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">{autor ? 'Actualizar autor' : 'Agregar autor'}</button>
                </form>
            </div>
        </div>
    );
};

export default ModalAutor;
