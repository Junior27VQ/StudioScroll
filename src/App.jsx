import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { AuthProvaider } from './context/AuthContext'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Registrar from './pages/Registrar'
import ProtectedRoute from './componets/ProtectedRoute'
import Perfil from './pages/Perfil'
import GestionItems from './pages/GestionItems'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvaider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace/>} />
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/registrar' element={<Registrar/>} />

          <Route element={ <ProtectedRoute/> }>
            <Route path='/perfil' element={<Perfil/>}/>
            <Route path='/blob' element={<GestionItems/>} />
          </Route>

          <Route path='*' element={<Navigate to='/login' replace/>} />

        </Routes>
      </BrowserRouter>
    </AuthProvaider>
  )
}

export default App
