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
        <div>
            <div>
                <h1>Gestionar Animes</h1>
                <button onClick={() => setEditarAnime({})}>Registrar Nuevo</button>
            </div>
            {editarAnime &&(
                <ModalFormulario
                    anime={editarAnime.id ? editarAnime : null}
                    onClose={() => setEditarAnime(null)}
                    onActualizar={cargarAnimes}
                    token={token}
                />
            )}
            <ListaItems 
                animes={listaAnimes}
                onEditar={manejarEditar}
                onEliminar={cargarAnimes}
            />
            {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
        </div>
    )
}
export default GestionItems;