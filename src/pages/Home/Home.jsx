import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from '../../context/AuthContext';
import {Link} from 'react-router-dom';
import ModalLibro from '../../components/LibroModal/LibroModal';
import "./Home.scss"

const Home = () => {
    const {auth, logoutUser, user} = useContext(AuthContext);
    const [libros, setLibros] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [genero, setGenero] = useState('');
    const [nroPaginasInicio, setNroPaginasInicio] = useState('');
    const [nroPaginasFin, setNroPaginasFin] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [campoOrdenamiento, setCampoOrdenamiento] = useState('');
    const [direccionOrdenamiento, setDireccionOrdenamiento] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [autores, setAutores] = useState([]);
    const [currentLibro, setCurrentLibro] = useState(null);

    useEffect(() => {
        fetchAutores();
        fetchLibros();
    }, [page, limit, campoOrdenamiento, direccionOrdenamiento]);

    const fetchAutores = async () => {
        try {
            const res = await axios.get("http://localhost:3002/autores", {
                headers: {'auth': auth}
            });
            setAutores(res.data.docs);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLibros = async (params = {}) => {
        try {
            const res = await axios.get("http://localhost:3002/libros", {
                headers: {'auth': auth},
                params: {
                    titulo: params.titulo || null,
                    genero: params.genero || null,
                    nroPaginasInicio: params.nroPaginasInicio || null,
                    nroPaginasFin: params.nroPaginasFin || null,
                    page: params.page || page,
                    limit,
                    campoOrdenamiento: campoOrdenamiento || null,
                    direccionOrdenamiento
                }
            });

            setLibros(res.data.docs);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        fetchLibros({titulo, genero, nroPaginasInicio, nroPaginasFin, page: 1});
    };

    const handleAddLibro = () => {
        setCurrentLibro(null);
        setShowModal(true);
    };

    const handleLibroAdded = () => {
        fetchLibros();
        setShowModal(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchLibros({page: newPage});
    };

    const handleClearFilters = () => {
        setTitulo('');
        setGenero('');
        setNroPaginasInicio('');
        setNroPaginasFin('');
        setCampoOrdenamiento('');
        setDireccionOrdenamiento('asc');
        setPage(1);
        fetchLibros({page: 1});  // Llamar fetchLibros para actualizar los resultados
    };

    return (
        <div>
            <h1>Libros</h1>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Titulo' value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
                <input type="text" placeholder='Genero' value={genero} onChange={(e) => setGenero(e.target.value)}/>
                <input type="number" placeholder='Minimo paginas' value={nroPaginasInicio}
                       onChange={(e) => setNroPaginasInicio(e.target.value)}/>
                <input type="number" placeholder='Maximo paginas' value={nroPaginasFin}
                       onChange={(e) => setNroPaginasFin(e.target.value)}/>
                <select value={campoOrdenamiento} onChange={(e) => setCampoOrdenamiento(e.target.value)}>
                    <option value="">Ordenar por</option>
                    <option value="titulo">Titulo</option>
                    <option value="genero">Genero</option>
                    <option value="paginas">Paginas</option>
                </select>
                <select value={direccionOrdenamiento} onChange={(e) => setDireccionOrdenamiento(e.target.value)}>
                    <option value="asc">Ascendiente</option>
                    <option value="desc">Descendiente</option>
                </select>
                <button type='submit'>Buscar</button>
            </form>
            <button onClick={handleClearFilters}>Limpiar filtros</button>
            <button onClick={handleAddLibro}>Nuevo libro</button>
            <table>
                <thead>
                <tr>
                    <th onClick={() => setCampoOrdenamiento('titulo')}>Titulo</th>
                    <th onClick={() => setCampoOrdenamiento('genero')}>Genero</th>
                    <th onClick={() => setCampoOrdenamiento('paginas')}>Paginas</th>
                </tr>
                </thead>
                <tbody>
                {libros.map(libro => (
                    <tr key={libro._id}>
                        <td><Link to={`/libros/${libro._id}`}>{libro.titulo}</Link></td>
                        <td>{libro.genero}</td>
                        <td>{libro.paginas}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</button>
                <button onClick={() => handlePageChange(page + 1)} disabled={libros.length < limit}>Siguiente</button>
            </div>
            {showModal && (
                <ModalLibro
                    libro={currentLibro}
                    onClose={() => setShowModal(false)}
                    onLibroAdded={handleLibroAdded}
                    setCurrentLibro={setCurrentLibro}
                    autores={autores}
                />
            )}
        </div>
    );
};

export {Home};
