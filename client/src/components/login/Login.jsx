import React, {useState, useEffect} from "react"
import {Box, Typography, Stack, Input, Button} from "@mui/material"
import styles from "./login.module.css" 
import axios from "axios"
import {useNavigate} from "react-router-dom"

const Login=()=>{
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [error, setError]=useState(" ")
    const navigate=useNavigate()

    useEffect(()=>{
        const currentSessionEmail=localStorage.getItem("email")
        if(currentSessionEmail){
            navigate("/home")
        }
    },[navigate])

    const handleEmail=(event)=>{
        setEmail(event.target.value)
    }

    const handlePassword=(event)=>{
        setPassword(event.target.value)
    }

    const login=async()=>{
        // const submit=await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`, {email:email, password:password}) // LOCALHOST
        const submit=await axios.post(`https://hire-a-drive-backend.onrender.com/login`, {email:email, password:password}) // DEPLOYMENT
        if(submit.data.doesExist===true){
            if(submit.data.passwordCheck===true){
                localStorage.setItem("email", email)
                navigate("/home")
            }else{
                setError("Invalid password.")
            }
        }else{
            setError("Account does not exist. Please sign up.")
        }
    }

  return (
    <div className={styles.loginPage}>
        <div className={styles.headerContainer}>
            <Box className={styles.header}>
                <Typography variant="h3">Login</Typography>
            </Box>
        </div>

        <div className={styles.mainContainer}>
            <Box className={styles.mainLeft}>
                <h1>Hire A Drive!</h1>
                <p>Trips made Easy</p>
            </Box>
            <Box className={styles.mainRight}>
                <Stack className={styles.driverLogin}>
                    <Input type="text" placeholder="Email" onChange={handleEmail} sx={{fontSize:"30px"}}/>
                    
                    <p><br/></p>
                    
                    <Input type="password" placeholder="Password" onChange={handlePassword} sx={{fontSize:"30px"}}/>
                    
                    <p><br/></p>
                    <p><br/></p>

                    <Button variant="contained" onClick={login} sx={{fontSize:"20px"}}>Login</Button>
                    <a href="/signup" className={styles.signUpLink}>Don't own an account?Sign Up!</a>
                </Stack>
                <p><br/></p>
                <Typography variant="h6" sx={{color:"red"}}>{error}</Typography>
            </Box>
        </div>
    </div>
  )
}

export default Login