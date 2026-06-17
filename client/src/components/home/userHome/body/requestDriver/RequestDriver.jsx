import React,{useState, useEffect} from "react"
import {Box, Stack, InputLabel, Select, MenuItem, Button, Snackbar} from "@mui/material"
import styles from "./requestDriver.module.css"
import axios from 'axios'

const RequestDriver=()=>{
  const [startingLocation, setStartingLocation]=useState("default")
  const [destination, setDestination]=useState("default")
  const [vehicle, setVehicle]=useState("default")
  const [driver, setDriver]=useState("random")
  const [yourDriver, setYourDriver]=useState(false)
  const [loading, setLoading]=useState(false);
  const [errorMessage, setErrorMessage]=useState("")
  const [totalRequests, setTotalRequests]=useState(0)
  const [requestPending, setRequestPending]=useState()
  
  useEffect(() => {
    const fetchRequestCount=async()=>{
      // const response = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getRequestCount`, {params: {email: localStorage.getItem('email')}}) // LOCALHOST
      const response = await axios.get(`https://hire-a-drive-backend.onrender.com/getRequestCount`, {params: {email: localStorage.getItem('email')}}) // DEPLOYMENT
      setTotalRequests(response.data.count)
    }

    const getUserRequestApprovalStatus=async()=>{
      // const user_request_status = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userRequestApprovalStatus`, {params: {email: localStorage.getItem('email')}}) // LOCALHOST
      const user_request_status = await axios.get(`https://hire-a-drive-backend.onrender.com/userRequestApprovalStatus`, {params: {email: localStorage.getItem('email')}}) // DEPLOYMENT
      if(user_request_status.data.active === true)
        setRequestPending(true)
      else if(user_request_status.data.active === false)
        setRequestPending(false)
    }
    
    getUserRequestApprovalStatus()
    fetchRequestCount()
  }, [])

  const handleStartingLocation=(event)=>{
    setStartingLocation(event.target.value)
  }

  const handleDestination=(event)=>{
    setDestination(event.target.value)
  }

  const handleVehicle=(event)=>{
    setVehicle(event.target.value)
  }

  const handleYourDriver=()=>{
    setYourDriver(prev=>{
      const newValue = !prev
      setDriver(newValue ? "default" : "random")
      return newValue
    })
  }

  const handleDriver=(event)=>{
    setDriver(event.target.value)
  }

  const submitRequest=async()=>{
    if (startingLocation === "default" || destination === "default" || vehicle === "default") {
      setErrorMessage("Please select valid options for all fields.");
      return;
    }
    setLoading(true); 
    // const status_submit=await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/submitUserRequest`, {requestId:totalRequests ,userId:localStorage.getItem('email'),driverId: "", startingLocation:startingLocation, destination:destination, vehicle:vehicle, driver:driver}) // LOCALHOST
    const status_submit=await axios.post(`https://hire-a-drive-backend.onrender.com/submitUserRequest`, {requestId:totalRequests ,userId:localStorage.getItem('email'),driverId: "", startingLocation:startingLocation, destination:destination, vehicle:vehicle, driver:driver}) // DEPLOYMENT
    console.log(status_submit)
    setLoading(false);
    setStartingLocation("")
    setDestination("")
    setVehicle("default")
    setDriver("random")
    setRequestPending(true)
  }

  return requestPending?(
    <Box className={styles.requestDriver}>
      <div style={{display: "flex", justifyContent: "center", fontSize: "30px"}}>
        <h1>Awaiting Driver Approval...</h1>
      </div>
    </Box>
  ):(
    <Box className={styles.requestDriver}>
      <Stack>
        <p></p>
        <InputLabel htmlFor="startingLocation">Starting Location</InputLabel>
        <Select id="startingLocation" value={startingLocation} onChange={handleStartingLocation} className={styles.inputFields}>
        <MenuItem value="default" style={{display:"none"}}></MenuItem>
          <MenuItem value="default" style={{display:"none"}}>Select starting location</MenuItem>
          <MenuItem value="Thiruvananthapuram">Thiruvananthapuram</MenuItem>
          <MenuItem value="Kollam">Kollam</MenuItem>
          <MenuItem value="Pathanamthitta">Pathanamthitta</MenuItem>
          <MenuItem value="Alappuzha">Alappuzha</MenuItem>
          <MenuItem value="Kottayam">Kottayam</MenuItem>
          <MenuItem value="Idukki">Idukki</MenuItem>
          <MenuItem value="Ernakulam">Ernakulam</MenuItem>
          <MenuItem value="Thrissur">Thrissur</MenuItem>
          <MenuItem value="Palakkad">Palakkad</MenuItem>
          <MenuItem value="Malappuram">Malappuram</MenuItem>
          <MenuItem value="Kozhikode">Kozhikode</MenuItem>
          <MenuItem value="Wayanad">Wayanad</MenuItem>
          <MenuItem value="Kannur">Kannur</MenuItem>
          <MenuItem value="Kasaragod">Kasaragod</MenuItem>
        </Select>
        <p></p>
        <InputLabel htmlFor="destination">Destination</InputLabel>
        <Select id="destination" value={destination} onChange={handleDestination} className={styles.inputFields}>
          <MenuItem value="default" style={{display:"none"}}>Select destination</MenuItem>
          <MenuItem value="Thiruvananthapuram">Thiruvananthapuram</MenuItem>
          <MenuItem value="Kollam">Kollam</MenuItem>
          <MenuItem value="Pathanamthitta">Pathanamthitta</MenuItem>
          <MenuItem value="Alappuzha">Alappuzha</MenuItem>
          <MenuItem value="Kottayam">Kottayam</MenuItem>
          <MenuItem value="Idukki">Idukki</MenuItem>
          <MenuItem value="Ernakulam">Ernakulam</MenuItem>
          <MenuItem value="Thrissur">Thrissur</MenuItem>
          <MenuItem value="Palakad">Palakad</MenuItem>
          <MenuItem value="Malappuram">Malappuram</MenuItem>
          <MenuItem value="Kozhikode">Kozhikode</MenuItem>
          <MenuItem value="Wayanad">Wayanad</MenuItem>
          <MenuItem value="Kannur">Kannur</MenuItem>
          <MenuItem value="Kasaragod">Kasaragod</MenuItem>
        </Select>
        <p></p>
        <InputLabel htmlFor="vehicle">Vehicle</InputLabel>
        <Select id="vehicle" value={vehicle} onChange={handleVehicle} className={styles.inputFields}>
          <MenuItem value="default" style={{display:"none"}}>Select type of vehicle</MenuItem>
          <MenuItem value="2-Seater Bike">2-Seater Bike</MenuItem>
          <MenuItem value="2-Seater Scooter">2-Seater Scooter</MenuItem>
          <MenuItem value="4-Seater Hatchback">4-Seater Hatchback</MenuItem>
          <MenuItem value="4-Seater Sedan">4-Seater Sedan</MenuItem>
          <MenuItem value="5-Seater">5-Seater</MenuItem>
          <MenuItem value="7-Seater">7-Seater</MenuItem>
          <MenuItem value="7-Seater Luxury">7-Seater Luxury</MenuItem>
          <MenuItem value="8-Seater Van">8-Seater Van</MenuItem>
        </Select>
        <p></p>
        <InputLabel htmlFor="preferedDriver">Do you prefer a driver?</InputLabel>
        <Box sx={{display:"flex", flexDirection:"row", width:"100%"}}>
          <input id="preferedDriver" type="checkbox" onChange={handleYourDriver} style={{height:"45px", width:"45px", marginRight:"10px"}}/>
          {yourDriver===true?
          <Select value={driver} onChange={handleDriver} sx={{width:"99%"}} className={styles.inputFields}>
            <MenuItem value="default">Select your driver</MenuItem>
            <MenuItem value="random" style={{display:"none"}}>Select your driver</MenuItem>
          </Select>
          :
          <Select value={driver} sx={{width:"99%"}} className={styles.inputFields} disabled>
            <MenuItem value="default">Select your driver</MenuItem>
            <MenuItem value="random" style={{display:"none"}}>Select your driver</MenuItem>
          </Select>
          }
        </Box>
        <p></p>
        <Button variant="contained" color="success" onClick={submitRequest}>{loading ? "Sending..." : "Send Request"}</Button>
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage("")} message={errorMessage}/>
      </Stack>
    </Box>
  )
}

export default RequestDriver