import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

function Perfil(){
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [error, setError] = useState('');

    const {token, logout} = useAuth();

    const navigate = useNavigate();

    const [alerta, setAlerta] = useState(null);
    function mostrarAlerta(msg) {
        setAlerta(msg);
    };

    useEffect(()=>{
        const cargarPerfil = async ()=>{
            try{
                const response = await fetch(`${API_BASE_URL}/auth/perfil`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(!response.ok){
                    throw new Error('No se podo cargar Perfil, inicie sesion nuevamente')
                }
            }catch(err){
                setError(err.message)
            };
        }
        cargarPerfil()
    }, [token]);

    const manejarLogOut = async()=>{
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
           
        } catch (err) {
            console.log('Error de red al intentar revocar el token: ' + err);
        }
        logout();
         mostrarAlerta("");
        navigate('/login')
    }

    return(
        <div className="auth-container">
            <div className="auth-card profile-card">
                <header className="profile-header">
                    <h2>Perfil de Usuario</h2>
                    <div className="button-group">
                        <button className="btn-primary" onClick={() => navigate('/blob')}>
                            Gestionar Animes
                        </button>
                        <button className="btn-secondary" onClick={manejarLogOut}>
                            Cerrar Sesión
                        </button>
                    </div>
                </header>

                {error && <p className="error-msg">{error}</p>}

                {datosPerfil && (
                    <div className="profile-details">
                        <div className="detail-item">
                            <span>Usuario:</span>
                            <p className="highlight">{datosPerfil.usuario}</p>
                        </div>
                        <div className="detail-item">
                            <span>Rol:</span>
                            <p>{datosPerfil.rol_detectado}</p>
                        </div>
                        <div className="detail-item">
                            <span>Estado:</span>
                            <p>{datosPerfil.status}</p>
                        </div>
                        <p className="welcome-msg">{datosPerfil.Mensaje}</p>
                    </div>
                )}
            </div>
        </div>
    )

}

export default Perfil;