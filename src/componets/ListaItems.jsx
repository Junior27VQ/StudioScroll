import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {API_BASE_URL} from "../config/apiConfig"

function ListaItems({animes, onEliminar, onEditar}){
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
    }, [animes, token]);

    const manejarEliminar = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este anime?");
        
        if (confirmacion) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/blob/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert("Anime eliminado con éxito");
                    onEliminar();
                } else {
                    alert("Error al intentar eliminar");
                }
            } catch (error) {
                console.error("Error de red:", error);
            }
        }
    };
    
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
                <p><strong>Género:</strong> {a.genero}</p>
                <p><strong>Calificación:</strong> {a.calificacion}/10</p>
                <p><strong>Formato:</strong> {a.formato}</p>
                {/*Botones*/}
                <button onClick={()=> onEditar(a)}>Editar</button>
                <button onClick={() => manejarEliminar(a.id)}>Eliminar</button>
                </div>
            ))}
        
        </div>
    )
}
export default ListaItems;