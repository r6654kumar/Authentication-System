import React from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './Components/SignUp'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App