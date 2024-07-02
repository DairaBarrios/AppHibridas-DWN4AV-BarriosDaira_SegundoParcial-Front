import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from "../../context/AuthContext.jsx";
import "./LibroModal.scss";

const ModalLibro = ({libro, onClose, onLibroAdded, setCurrentLibro, autores}) => {
    const {auth} = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [genero, setGenero] = useState('');
    const [editorial, setEditorial] = useState('');
    const [imagen, setImagen] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState('');
    const [paginas, setPaginas] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (libro) {
            setTitulo(libro.titulo);
            setAutor(libro.autor._id);
            setIsbn(libro.isbn);
            setGenero(libro.genero);
            setEditorial(libro.editorial);
            setImagen(libro.imagen);
            setFechaPublicacion(libro.fechaPublicacion?.substring(0, 10));
            setPaginas(libro.paginas);
        } else {
            setTitulo('');
            setAutor('');
            setIsbn('');
            setGenero('');
            setEditorial('');
            setImagen('');
            setFechaPublicacion('');
            setPaginas('');
        }
    }, [libro]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!titulo.trim()) {
            setError('El título es obligatorio');
            return;
        }

        if (!autor) {
            setError('El autor es obligatorio');
            return;
        }

        if (isNaN(isbn) || isbn.length !== 13) {
            setError('El ISBN debe ser un número de 13 dígitos');
            return;
        }

        if (!genero.trim()) {
            setError('El género es obligatorio');
            return;
        }

        if (!editorial.trim()) {
            setError('La editorial es obligatoria');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (fechaPublicacion && fechaPublicacion > today) {
            setError('La fecha de publicación no puede ser en el futuro');
            return;
        }

        if (isNaN(paginas) || paginas <= 0) {
            setError('El número de páginas debe ser un número positivo');
            return;
        }

        setError('');

        try {
            const newLibro = {
                titulo,
                autor,
                isbn,
                genero,
                editorial,
                imagen,
                fechaPublicacion,
                paginas,
            };

            if (libro) {
                await axios.put('http://localhost:3002/libros/' + libro._id, newLibro, {
                    headers: {'auth': auth}
                });
                setCurrentLibro(null);
            } else {
                await axios.post('http://localhost:3002/libros', newLibro, {
                    headers: {'auth': auth}
                });
            }
            onLibroAdded();
            onClose();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{libro ? 'Editar Libro' : 'Agregar Nuevo Libro'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Título</label>
                        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Autor</label>
                        <select value={autor} onChange={(e) => setAutor(e.target.value)} required>
                            <option value="" disabled>Selecciona un autor</option>
                            {autores.map((autor) => (
                                <option key={autor._id} value={autor._id}>{autor.nombre} {autor.apellido}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>ISBN</label>
                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Género</label>
                        <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Editorial</label>
                        <input type="text" value={editorial} onChange={(e) => setEditorial(e.target.value)}/>
                    </div>
                    <div>
                        <label>Fecha de Publicación</label>
                        <input type="date" value={fechaPublicacion}
                               onChange={(e) => setFechaPublicacion(e.target.value)}/>
                    </div>
                    <div>
                        <label>Páginas</label>
                        <input type="number" value={paginas} onChange={(e) => setPaginas(e.target.value)} required/>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">{libro ? 'Actualizar Libro' : 'Agregar Libro'}</button>
                </form>
            </div>
        </div>
    );
};

export default ModalLibro;
