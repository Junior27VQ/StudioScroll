import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";
import ListaItems from "../componets/ListaItems";
import ModalFormulario from "./ModalFormulario";
import { useNavigate } from "react-router-dom";

function GestionItems(){
    const [listaAnimes, setListaAnimes] = useState([]);
    const [editarAnime, setEditarAnime] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [animeSeleccionado, setAnimeSeleccionado] = useState(null);

    const navigate = useNavigate();
    const {token} = useAuth();

    const cargarAnimes = useCallback (async ()=>{
        try {
            const response = await fetch(`${API_BASE_URL}/auth/blob`, {
                method: 'GET',            
                headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
            if(!response.ok){
                throw new Error("No se pudo obtener la lista de animes")
            }

            const datos = await response.json();
            setListaAnimes(datos);

        } catch (error) {
            setErrorMsg(error.message);
        }
    }, [token]);

    useEffect(()=> { cargarAnimes(); },[cargarAnimes]);

    return(
        <div className="auth-container" style={{ padding: '20px', minHeight: 'auto', display: 'block' }}>
            <button className="btn-primary" onClick={() => navigate('/perfil')}>
                Perfil
            </button>
            <header className="profile-header" style={{ marginBottom: '30px' }}>
                <h1>Gestión de Animes</h1>
                <button 
                    className="btn-primary" 
                    onClick={() => setEditarAnime({})}
                    style={{ width: 'auto', padding: '10px 20px' }}
                >
                    + Registrar Nuevo
                </button>
            </header>

            {editarAnime && (
                <ModalFormulario
                    anime={editarAnime.id ? editarAnime : null}
                    onClose={() => setEditarAnime(null)}
                    onActualizar={cargarAnimes}
                    token={token}
                />
            )}

            {animeSeleccionado && (
                <div className="modal-overlay"> {/* Una capa oscura que cubre la pantalla */}
                    <div className="modal-content">
                        <h2>{animeSeleccionado.titulo}</h2>
                        <p>Género: {animeSeleccionado.genero}</p>
                        <p>Estado: {animeSeleccionado.estado}</p>
                        <p>Sinopsis: {animeSeleccionado.sinopsis}</p>
                        {/* Aquí puedes mostrar la imagen grande usando fotosUrl[animeSeleccionado.id] */}
                        <button onClick={() => setAnimeSeleccionado(null)}>Cerrar</button>
                    </div>
                </div>
            )}

            <ListaItems 
                animes={listaAnimes}
                onEditar={setEditarAnime} // Simplificado para que sea directo
                onEliminar={cargarAnimes}
                inf={setAnimeSeleccionado}
            />

            {errorMsg && <p className="error-msg" style={{ textAlign: 'center' }}>{errorMsg}</p>}
        </div>
    )
}
export default GestionItems;