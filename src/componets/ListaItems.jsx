import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {API_BASE_URL} from "../config/apiConfig"

function ListaItems({animes, onEliminar, onEditar, inf}){
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
                                                } 
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
        <div className="lista-animes-grid">
            {animes.map(a => (
                <div className="card" key={a.id}>
                    {/* La imagen ahora se ajusta al contenedor */}
                    <div className="card-image-container">
                        <img 
                            src={fotosUrl[a.id] || 'placeholder.png'} 
                            alt={a.titulo} 
                        />
                    </div>
                    
                    <div className="card-body">
                        <h3>{a.titulo}</h3>
                        <div className="card-info">
                            <p><span>Género:</span> {a.genero}</p>
                            <p><span>Calificación:</span> {a.calificacion}/10</p>
                            <p><span>Formato:</span> {a.formato}</p>
                            <p><span>Estado:</span> {a.estado ? "Finalizado" : "En Emisión"}</p>
                        </div>
                        
                        <div className="card-actions">
                            <button className="btn-accion btn-editar" onClick={() => onEditar(a)}>Editar</button>
                            <button className="btn-accion btn-eliminar" onClick={() => manejarEliminar(a.id)}>Eliminar</button>
                            {/* Botón de función "Más Info" */}
                            <button className="btn-accion btn-info" onClick={() => inf(a)}>Info</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default ListaItems;