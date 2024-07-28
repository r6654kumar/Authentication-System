import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
const Dashboard = () => {
    const navigate=useNavigate()
    axios.defaults.withCredentials=true;
    useEffect(()=>{
        axios.get('http://localhost:5000/api/verify')
            .then(res=>{
                if(res.data.status){

                }
                else{
                    alert("Session Expired! Please Login again");
                    navigate('/login');
                    // console.log("Token invalid")
                }
            }).catch(err=>{
                alert("Session Expired! Please Login again");
                navigate('/login');
            })
    },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard