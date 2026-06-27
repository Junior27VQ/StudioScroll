import { useState } from "react";
import { API_BASE_URL } from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

function Registrar(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [err, setErr] = useState('');

    const navigate = useNavigate();

    const [alerta, setAlerta] = useState(null);
    function mostrarAlerta(msg) {
        setAlerta(msg);
    };

    const onRegistrar = async (e)=>{
        e.preventDefault();
        setErr('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password, rol}),
            });

            if(!response.ok){
                throw new Error('Ya existe el usuario: '+username)
            }

            navigate('/login');
            mostrarAlerta("Registro completado correctamente");

        } catch (error) {
            setErr(error.message);
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <h1>Registro de Usuario</h1>
                <form onSubmit={onRegistrar}>
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password" // Cambiado a password por seguridad
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Rol en el Sistema</label>
                        <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                            <option value="">Seleccionar...</option>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    
                    {err && <p className="error-msg">{err}</p>}
                    
                    <button type="submit" className="btn-primary">Registrar</button>
                </form>
            </div>
        </div>
    )
}
export default Registrar;