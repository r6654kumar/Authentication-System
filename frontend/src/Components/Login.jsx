import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'
const Login = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate =useNavigate()
    axios.defaults.withCredentials=true;
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:5000/api/login",{
            email,
            password
        }).then(response=>{
            if(response.data.status){
                navigate('/home');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
  return (
    <div className="sign-up-container">
        <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
            <label htmlFor="email"></label>
            <input type="email" 
            placeholder="Email id" 
            onChange={(e)=>setEmail(e.target.value)}
            />
            <label htmlFor="password"></label>
            <input type="password" 
            placeholder='Password' 
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <p><Link to='/forgot-password'>Forgot Password? Reset Here</Link></p>
            <p>Have an Account ?<Link to ="/register">Register</Link></p>
        </form>
    </div>
  )
}

export default Login