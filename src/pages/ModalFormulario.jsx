import { useState } from "react";
import { API_BASE_URL } from "../config/apiConfig";

function ModalFormulario({ anime, onClose, onActualizar, token }) {
    // Estado único para todo el formulario
    const [formData, setFormData] = useState({
        titulo: anime?.titulo || '',
        sinopsis: anime?.sinopsis || '',
        episodio: anime?.episodio || 0,
        calificacion: anime?.calificacion || 0.0,
        formato: anime?.formato || '',
        estado: anime?.estado || 'En Emision'
    });
    //Estado para errores
    const [errorMsg, setErrorMsg] = useState('');
    const [succesMsg, setSuccesMsg] = useState('');
    //Estado para Archivos y generos    
    const [archivo, setArchivo] = useState(null);
    const [generosSeleccionados, setGenerosSeleccionados] = useState(
        anime?.genero ? anime.genero.split(',') : []
    );

    const opcionesGenero = ["Romance", "Accion", "Comedia", "Drama", "Terror", "Fantasia"];
    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        if(type === 'checkbox') {
            setFormData({
                ...formData,
            [name]: checked ? "Finalizado" : "En Emision"
            });
        } else {
            setFormData({...formData, [name]: value});
        }
    };
    const manejarGenero = (e) => {
        const { value, checked } = e.target;
        setGenerosSeleccionados(checked 
            ? [...generosSeleccionados, value] 
            : generosSeleccionados.filter(g => g !== value));
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");

        if(!archivo){
            setErrorMsg("Dabe seleccionar una foto para el Anime")
            return;
        }

        const data = new FormData();
        
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append("genero", generosSeleccionados.join(','));
        if (archivo) data.append("file", archivo);

        const url = anime ? `${API_BASE_URL}/auth/blob/${anime.id}` : `${API_BASE_URL}/auth/blob/crear`;
        const method = anime ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });
        if(!response.ok){
            throw new Error("No se pudo registrar el Anime")
        }

        setSuccesMsg(anime ? "Actualizado con exito" : "Registrado con exito");
        onActualizar();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{anime ? "Editar" : "Registrar"} Anime</h2>
                <form onSubmit={manejarSubmit}>
                    <div className="form-title">
                        <label>Título:</label>
                        <input name="titulo" value={formData.titulo} onChange={manejarCambio} required />
                    </div>

                    <div>
                        <p>Géneros:</p>
                        <div className="checkbox-group">
                            {opcionesGenero.map(g => (
                                <label key={g}>
                                    <input 
                                        type="checkbox" 
                                        value={g} 
                                        checked={generosSeleccionados.includes(g)} 
                                        onChange={manejarGenero} 
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sinopsis</label>
                        <textarea
                            name="sinopsis"
                            minLength="10"
                            maxLength="250"
                            value={formData.sinopsis} 
                            onChange={manejarCambio} 
                            placeholder="Sinopsis" 
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Foto:</label>
                        <input type="file" onChange={(e) => setArchivo(e.target.files[0])} />
                    </div>

                    <div className="row-flex">
                        <div className="form-group flex-1">
                            <label>Episodios:</label>
                            <input 
                                type="number" 
                                name="episodio" 
                                value={formData.episodio} onChange={manejarCambio} 
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label>Calificación:</label>
                            <input 
                                type="number" 
                                name="calificacion" 
                                min="1" max="10" 
                                value={formData.calificacion} onChange={manejarCambio} 
                            />
                        </div>
                    </div>

                    <div className="row-flex">
                        <div className="form-group">
                            <label>Formato:</label>
                            <select name="formato" value={formData.formato} onChange={manejarCambio}>
                                <option value="">Seleccionar...</option>
                                <option value="Serie">Serie</option>
                                <option value="Pelicula">Pelicula</option>
                                <option value="OVA">OVA</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado:</label>
                            <input 
                                type="checkbox" 
                                name="estado" 
                                checked={formData.estado === "Finalizado"} 
                                onChange={manejarCambio} 
                            />
                        </div>
                    </div>

                    {errorMsg && <p className="error-msg">{errorMsg}</p>}
                    {succesMsg && <p className="success-msg">{succesMsg}</p>}

                    <div className="row-flex">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalFormulario;