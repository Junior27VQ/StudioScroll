import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvaider(props) {
    const {children} = props;

    const [token, setToken] = useState(localStorage.getItem("token") || null);
//funcion para guardar el token en el estado
    const login = (nuevoToken) => {
        localStorage.setItem("token", nuevoToken);
        setToken(nuevoToken);
    };
//serrar secion    
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
//registrar usuario
    const registrar = (nuvoUsuario) => {
        localStorage.setItem("username", nuevoUsuario);
    }

    return(
        <AuthContext.Provider 
            value={{token, login, logout}}
        >{children}</AuthContext.Provider>
    )

}

export function useAuth(){
    return useContext(AuthContext)
}