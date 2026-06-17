import React,{useState, useEffect} from 'react'
import styles from "./driverJourney.module.css"
import {Box, Button} from "@mui/material"
import {useNavigate} from "react-router-dom"
import {useLocation} from 'react-router-dom'
import axios from "axios"

const DriverJourney=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    const [username, setUsername]=useState(null)
    const [drivername, setDrivername]=useState(null)
    const [fare, setFare]=useState(null)
    const [pickUp, setPickUp]=useState(null)
    const [destination, setDestination]=useState(null)
    const [isUserRequestValidatedFromDriver, setIsUserRequestValidatedFromDriver]=useState()
    const {userId, driverId}=location.state || {}

    useEffect(()=>{
        const getDetailsForUser=async()=>{
            // await axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/deleteUserRequest/${userId}/${driverId}`) // LOCALHOST
            await axios.delete(`https://hire-a-drive-backend.onrender.com/deleteUserRequest/${userId}/${driverId}`) // DEPLOYMENT
            setUsername(details.data.details.username)
        }

        const getDetailsForDriver=async()=>{
            // const details=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getDetails`,{params:{email:driverId}})  // LOCALHOST
            const details=await axios.get(`https://hire-a-drive-backend.onrender.com/getDetails`,{params:{email:driverId}}) // DEPLOYMENT
            setDrivername(details.data.details.username)
        }

        const getValidatedUserRequestsForDrivers=async()=>{
            // const validatedUserRequestFromDriver=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getValidatedUserRequestFromDriver`,{params:{driverId: localStorage.getItem('email')}}) // LOCALHOST
            const validatedUserRequestFromDriver=await axios.get(`https://hire-a-drive-backend.onrender.com/getValidatedUserRequestFromDriver`,{params:{driverId: localStorage.getItem('email')}}) // DEPLOYMENT
            setIsUserRequestValidatedFromDriver(validatedUserRequestFromDriver.data.isValid)
            setFare(validatedUserRequestFromDriver.data.validatedUserRequest.confirmedFare)
            setPickUp(validatedUserRequestFromDriver.data.validatedUserRequest.startingLocation)
            setDestination(validatedUserRequestFromDriver.data.validatedUserRequest.destination)
        }
        
        getValidatedUserRequestsForDrivers()
        getDetailsForUser()
        getDetailsForDriver()
        if(isUserRequestValidatedFromDriver===false)
            navigate("/home")
    }, [isUserRequestValidatedFromDriver, navigate])

    const finishJourney=async()=>{
        // await axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/deleteUserRequest/${userId}/${driverId}`) // LOCALHOST
        await axios.delete(`https://hire-a-drive-backend.onrender.com/deleteUserRequest/${userId}/${driverId}`) // DEPLOYMENT
        navigate('/home')
    }

    const cancelJourney=async()=>{
        // await axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/deleteUserRequest/${userId}/${driverId}`) // LOCALHOST
        await axios.delete(`https://hire-a-drive-backend.onrender.com/deleteUserRequest/${userId}/${driverId}`) // DEPLOYMENT
        navigate('/home')
    }

    return(
        <Box className={styles.driverJourney}>
             <div className={styles.header}>
                <h1>You are driving...</h1>
            </div>
            <div className={styles.main}>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <table border="1">
                        <tr>
                            <th>DRIVER</th>
                            <td>:</td>
                            <td>{drivername}</td>
                        </tr>
                        <tr>
                            <th>PASSENGER</th>
                            <td>:</td>
                            <td>{username}</td> 
                        </tr>
                        <tr>
                            <th>FARE</th>
                            <td>:</td>
                            <td>{fare}</td>
                        </tr>
                        <tr>
                            <th>PICKUP</th>
                            <td>:</td>
                            <td>{pickUp}</td>
                        </tr>
                        <tr>
                            <th>DESTINATION</th>
                            <td>:</td>
                            <td>{destination}</td>
                        </tr>
                    </table>
                    <div className={styles.buttonGroup}>
                        <button onClick={finishJourney}>Finish Journey</button>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <Button color="error" variant="contained" sx={{ height: "100px", width: "250px", fontSize: "30px", borderRadius: "20px", marginRight: "60px" }} onClick={cancelJourney}>CANCEL JOURNEY</Button>
            </div>
        </Box>
    )
}

export default DriverJourney