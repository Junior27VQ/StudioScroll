import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const {login} = useAuth();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUsername('');
        setPassword('');

        try{
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
            });

            if(!response.ok){
                throw new Error('Usuario o Contraseña Incorrectos')
            }
            
            const datos = await response.json();
            login(datos.token);
            navigate('/perfil');

        }catch(err){
            setError(err.message)
        }
    }

    const registar = ()=> {
        navigate('/registrar')
    }

    return(
        <div className="auth-container">
        <div className="auth-card">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={manejarSubmit}>
                <div className="input-group">
                    <label>Usuario:</label>
                    <input required type="text" value={username} onChange={(e)=> setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-msg">{error}</p>}
                <div className="button-group">
                    <button type="submit" className="btn-primary">Ingresar</button>
                    <button type="button" className="btn-secondary" onClick={registar}>Registrar</button>
                </div>
            </form>
        </div>
    </div>
    )
}
export default Login;