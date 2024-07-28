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
                    navigate('/home');
                }
            }).catch(err=>{
                alert("Please login again");
                navigate('/home');
            })
    },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard