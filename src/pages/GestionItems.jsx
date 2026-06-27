import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";
import ListaItems from "../componets/ListaItems";
import ModalFormulario from "./ModalFormulario";

function GestionItems(){
    const [listaAnimes, setListaAnimes] = useState([]);
    const [editarAnime, setEditarAnime] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    //const navigate = useNavigate();
    const {token} = useAuth();

    const cargarAnimes = useCallback (async ()=>{
        try {
            const response = await fetch(`${API_BASE_URL}/auth/blob`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
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

            <ListaItems 
                animes={listaAnimes}
                onEditar={setEditarAnime} // Simplificado para que sea directo
                onEliminar={cargarAnimes}
            />

            {errorMsg && <p className="error-msg" style={{ textAlign: 'center' }}>{errorMsg}</p>}
        </div>
    )
}
export default GestionItems;