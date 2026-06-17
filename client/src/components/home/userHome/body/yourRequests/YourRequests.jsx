import React,{useEffect, useState} from "react"
import {Box, Stack, InputLabel, Select, MenuItem, Paper, Typography, Button} from "@mui/material"
import styles from "./yourRequests.module.css"
import image from "../../../../pictures/default_profile_pic_1.jpeg"
import axios from "axios"
import {useNavigate} from "react-router-dom"

const YourRequests=()=>{
  const [currentRequestId, setCurrentRequestId]=useState()
  const [acceptedRequests, setAcceptedRequests]=useState([])
  const [selectedDriver, setSelectedDriver]=useState("")
  const [selectedEmail, setSelectedEmail]=useState("")
  const [selectedFare, setSelectedFare]=useState("")
  const [selectedProfilePic, setSelectedProfilePic]=useState("")
  const [selectedRating, setSelectedRating]=useState(0)
  const navigate=useNavigate()

  useEffect(()=>{
    const getAcceptedRequests=async()=>{
      const accepted_request_status = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/acceptedUserRequests`, {params: {email: localStorage.getItem('email')}})
      console.log("accepted request status="+accepted_request_status.data)
      setAcceptedRequests(accepted_request_status.data)
      setCurrentRequestId(accepted_request_status.data[0].requestId)
    }

    getAcceptedRequests()
  }, [])

  const handleDriverSelect=(event)=>{
    const driverName = event.target.value[0]
    const driverEmail = event.target.value[1]
    setSelectedDriver(driverName)
    setSelectedEmail(driverEmail)
    setSelectedFare(driverName);
    
    const selectedRequest = acceptedRequests.find(request => 
      request.driverResponse.some(driver => driver.drivername === driverName)
    )
  
    if(selectedRequest) {
      const selectedDriverDetail = selectedRequest.driverResponse.find(driver => driver.drivername === driverName)
      setSelectedFare(selectedDriverDetail ? selectedDriverDetail.fare : "") // Update the fare based on the selected driver
      setSelectedProfilePic(selectedDriverDetail ? selectedDriverDetail.profilePic : "")
      setSelectedRating(selectedDriverDetail ? selectedDriverDetail.rating : 0)
    }
  }

  const confirmDriver=async()=>{
    const confirm_driver_status = await axios.put(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/confirmDriver/${currentRequestId}`, {driverId: selectedEmail, drivername: selectedDriver, confirmedFare: selectedFare})
    console.log("confirm_driver_status="+confirm_driver_status)
    navigate("/userJourney", {state: {userId: localStorage.getItem('email'), driverId: selectedEmail}}) 
    setSelectedDriver("")
    setSelectedFare(null)
    setSelectedEmail("")
    setSelectedProfilePic("")
    setSelectedRating(0)
  }

  return(
    <Box className={styles.yourRequests}>
      <Stack className={styles.stack}>
          <Select defaultValue="default" value="default" className={styles.inputFields} onChange={handleDriverSelect}>
            <MenuItem value="default" sx={{display:"none"}}>Drivers who accepted your request</MenuItem>
            {acceptedRequests
              .flatMap((requests) => requests.driverResponse.map((driver, index) => (
                <MenuItem key={`${requests._id}-${index}`} value={[driver.drivername, driver.email]}>{driver.drivername}</MenuItem> 
            )))}
          </Select>
          <p></p>
          <InputLabel htmlFor="fare">Journey Fare</InputLabel>
          <Select variant="outlined" id="fare" className={styles.inputFields} value={selectedFare} readOnly>
            <MenuItem value={selectedFare}>{selectedFare}</MenuItem>
          </Select>
          <p></p>
          <Paper className={styles.paper}>
              <div className={styles.row1}>
                <img src={selectedProfilePic || image} alt="driver profile pic" style={{ height: "200px", width: "200px", borderRadius: "50%", border: "2px solid black"}}/>
                <Typography variant="h2" sx={{paddingTop:"5%"}}>{selectedDriver}</Typography>
              </div>
              <div className={styles.row2}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.star} style={{color: index <selectedRating ? "gold" : "grey"}}>&#9734;</span>
                ))}
              </div>
              <div className={styles.row3}>
                <Button variant="contained" color="success" style={{fontSize: "25px", marginTop: "-50px", marginBottom: "20px"}} onClick={confirmDriver}>Confirm Driver</Button>
              </div>
          </Paper>
      </Stack>
    </Box>
  )
}

export default YourRequests