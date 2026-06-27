import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {API_BASE_URL} from "../config/apiConfig"

function ListaItems({animes}){
    const [fotosUrl, setFotosUrl] = useState({});
    const {token} = useAuth();

    useEffect(()=>{
        const urlsCreadas = [];

        const descargarFotos = async ()=>{
            for(const anime of animes){
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/blob/${anime.id}/foto`, {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                },body: formData 
                                            });
                    if(response.ok){
                        const blob = await response.blob();
                        const urlLocal = URL.createObjectURL(blob);
                        urlsCreadas.push(urlLocal);
                        setFotosUrl((prev)=>({...prev, [anime.id]: urlLocal }))
                    }
                } catch (error) {
                    console.log("FALLO AL DESCARGAR LA FOTO:", error);
                }
            }
        }
        if(animes.length > 0){
            descargarFotos();
        }
        return()=>{
            for ( const url of urlsCreadas){
                URL.revokeObjectURL(url);
            }
        }
    }, [animes, token])
    
    return(
        <div className="grid-container"> 
        <h1>Listado de Animes</h1>

            {animes.map(a => (
                <div className="card" key={a.id}>
                <img 
                    src={fotosUrl[a.id] || 'placeholder.png'} 
                    alt={a.titulo} 
                    style={{width: '100px'}}
                />
                <h3>{a.titulo}</h3>
                <p>{a.genero}</p>
                <button>Editar</button>
                <button>Eliminar</button>
                </div>
            ))}
        
        </div>
    )
}
export default ListaItems;