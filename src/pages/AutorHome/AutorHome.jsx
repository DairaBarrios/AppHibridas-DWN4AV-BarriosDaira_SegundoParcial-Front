import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from '../../context/AuthContext';
import {Link} from 'react-router-dom';
import ModalAutor from '../../components/AutorModal/AutorModal';
import "./AutorHome.scss"

const AutorHome = () => {
    const {auth, logoutUser, user} = useContext(AuthContext);
    const [autores, setAutores] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [campoOrdenamiento, setCampoOrdenamiento] = useState('');
    const [direccionOrdenamiento, setDireccionOrdenamiento] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [currentAutor, setCurrentAutor] = useState(null);

    useEffect(() => {
        fetchAutores();
    }, [page, limit, campoOrdenamiento, direccionOrdenamiento]);

    const fetchAutores = async (params = {}) => {
        try {
            const res = await axios.get("http://localhost:3002/autores", {
                headers: {'auth': auth},
                params: {
                    nombre: params.nombre || null,
                    apellido: params.apellido || null,
                    nacionalidad: params.nacionalidad || null,
                    fechaInicio: params.fechaInicio || null,
                    fechaFin: params.fechaFin || null,
                    page: params.page || page,
                    limit,
                    campoOrdenamiento: params.campoOrdenamiento || null,
                    direccionOrdenamiento
                }
            });

            setAutores(res.data.docs);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        fetchAutores({nombre, apellido, nacionalidad, fechaInicio, fechaFin, page: 1});
    };

    const handleAddAutor = () => {
        setCurrentAutor(null);
        setShowModal(true);
    };

    const handleAutorAdded = () => {
        fetchAutores();
        setShowModal(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchAutores({page: newPage});
    };

    const handleClearFilters = () => {
        setNombre('');
        setApellido('');
        setNacionalidad('');
        setFechaInicio('');
        setFechaFin('');
        setCampoOrdenamiento('');
        setDireccionOrdenamiento('asc');
        setPage(1);
        fetchAutores({page: 1});  // Llamar fetchAutores para actualizar los resultados
    };

    return (
        <div>
            <h1>Autores</h1>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Nombre' value={nombre}
                       onChange={(e) => setNombre(e.target.value)}/>
                <input type="text" placeholder='Apellido' value={apellido}
                       onChange={(e) => setApellido(e.target.value)}/>
                <input type="text" placeholder='Nacionalidad' value={nacionalidad}
                       onChange={(e) => setNacionalidad(e.target.value)}/>
                <input type="date" placeholder='Fecha de inicio' value={fechaInicio}
                       onChange={(e) => setFechaInicio(e.target.value)}/>
                <input type="date" placeholder='Fecha de finalizacion' value={fechaFin}
                       onChange={(e) => setFechaFin(e.target.value)}/>
                <select value={campoOrdenamiento} onChange={(e) => setCampoOrdenamiento(e.target.value)}>
                    <option value="">Ordenar por</option>
                    <option value="nombre">Nombre</option>
                    <option value="apellido">Apellido</option>
                    <option value="nacionalidad">Nacionalidad</option>
                </select>
                <select value={direccionOrdenamiento} onChange={(e) => setDireccionOrdenamiento(e.target.value)}>
                    <option value="asc">Ascendiente</option>
                    <option value="desc">Descendiente</option>
                </select>
                <button type='submit'>Buscar</button>
            </form>
            <button onClick={handleClearFilters}>Limpiar filtros</button>
            <button onClick={handleAddAutor}>Nuevo autor</button>
            <table>
                <thead>
                <tr>
                    <th onClick={() => setCampoOrdenamiento('nombre')}>Nombre</th>
                    <th onClick={() => setCampoOrdenamiento('apellido')}>Apellido</th>
                    <th onClick={() => setCampoOrdenamiento('nacionalidad')}>Nacionalidad</th>
                </tr>
                </thead>
                <tbody>
                {autores.map(autor => (
                    <tr key={autor._id}>
                        <td><Link to={`/autores/${autor._id}`}>{autor.nombre}</Link></td>
                        <td>{autor.apellido}</td>
                        <td>{autor.nacionalidad}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</button>
                <button onClick={() => handlePageChange(page + 1)} disabled={autores.length < limit}>Siguiente</button>
            </div>
            {showModal && (
                <ModalAutor
                    autor={currentAutor}
                    onClose={() => setShowModal(false)}
                    onAutorAdded={handleAutorAdded}
                    setCurrentAutor={setCurrentAutor}
                />
            )}
        </div>
    );
};

export {AutorHome};
