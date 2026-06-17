import React, {useState, useEffect} from "react"
import styles from "./userProfile.module.css"
import image from "../../../../pictures/abhinand_t.jpg"
import {Box,Stack,InputLabel,Button,Typography,TextareaAutosize,Select,MenuItem,Paper} from "@mui/material"
import axios from "axios"

const UserProfile=()=>{
  const [details, setDetails]=useState("")
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
  const [error, setError]=useState("")
  const [region, setRegion]=useState("")
  const [address, setAddress]=useState("")
  const [profileURL, setProfileURL]=useState("")
  const [imageURL, setImageURL]=useState()
  const [selectedFile, setSelectedFile]=useState(null)

  useEffect(()=>{
    GetDetails()
  }, [])

  const GetDetails=async()=>{
    const result=await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getDetails`, {params:{email:localStorage.getItem('email')}})
    setDetails(result.data.details)
  }

  const ExtractDateComponents=(dateOfJoining)=>{
    const date=new Date(dateOfJoining);
    return{
      day: date.getDate(),
      month: date.getMonth()+1,
      year: date.getFullYear(),
    }
  }

  const handleProfilePic=(event)=>{
    const file=event.target.files[0]
    setSelectedFile(file)
    if(file){
      const reader=new FileReader()
      reader.onload=()=>{
        setImageURL(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePassword=(event)=>{
    setPassword(event.target.value)
  }

  const handleConfirmPassword=(event)=>{
    setConfirmPassword(event.target.value)
  }

  const handleRegion=(event)=>{
    setRegion(event.target.value)
  }

  const handleAddress=(event)=>{
    setAddress(event.target.value)
  }

  const uploadImageAndDownloadURL = async () => {
    if (!selectedFile) {
      alert("Please select an image")
      return null
    }

    const formData = new FormData()

    formData.append("file", selectedFile)
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    )

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )

      return response.data.secure_url
    }
    catch(error){
      console.error(error)
      return null
    }
  }

  const changeProfilePic=async(event)=>{
    const profilePic=await uploadImageAndDownloadURL()
    if(profilePic){
      const status_pfp=await axios.put(
        `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/editUser/${localStorage.getItem('email')}`,
        {
          profilePic
        }
      )
      console.log(status_pfp)
      window.location.reload()
      window.location.reload()
    }
  }

  const changePassword=async()=>{
    if(!(password==="")&&!(confirmPassword===""))
    {
      if(password===confirmPassword)
      {
        const status_password=await axios.put(`http://localhost:4000/editUser/${localStorage.getItem('email')}`, {password:password})
        console.log(status_password)
        setPassword()
        setConfirmPassword()
        setError()
      }
      else
        setError("Password and Confirm Password does not match.")
    }
    else
      setError("Please make sure password or confirm password is filled.")
  }

  const changeRegion=async()=>{
    const status_region=await axios.put(`http://localhost:4000/editUser/${localStorage.getItem('email')}`, {district:region})
    console.log(status_region)
    setRegion()
  }

  const changeAddress=async()=>{
    const status_address=await axios.put(`http://localhost:4000/editUser/${localStorage.getItem('email')}`, {address:address})
    console.log(status_address)
    setAddress()
  }

  return(
    <Box className={styles.userProfile}>
      <Box className={styles.rowContainer}>
        <Stack className={styles.overview}>
          <div style={{display:"flex",flexDirection:"row",height:"90%",paddingTop:"2%"}}>
            <Paper sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100%",width:"33.3%",padding:"10px 20px 10px 20px",marginRight:"5px",borderRadius:"20px",boxShadow:"2px 2px 10px black"}}>
              <img src={details.profilePic} alt="profile pic" style={{maxHeight:"75%",maxWidth:"75%",borderRadius:"50%",marginBottom:"5%",border:"2px ridge black"}}/>
              <div style={{display:"flex", justifyContent: "center"}}>
                <Button variant="contained" color="success" onClick={changeProfilePic} sx={{marginTop:"2%",borderRadius:"5px", height:"70%", width:"90%", marginRight:"1%"}}>Change Picture</Button><label htmlFor="profilePicUpload" style={{padding:"5px 5px 5px 5px", fontSize:"15px",backgroundColor:"#1976D2", color:"white", marginTop:"2%", borderRadius:"5px", height:"60%", width:"60%", marginLeft:"1%", textAlign:"center"}}>FILE UPLOAD<input id="profilePicUpload" type="file" onChange={handleProfilePic} style={{display:"none"}}/></label>
              </div>
            </Paper>
            <Paper sx={{height:"100%",marginLeft:"5px",backgroundColor:"white",width:"66.6%",marginRight:"5px",borderRadius:"20px",boxShadow:"2px 2px 10px black",padding:"10px 30px",textAlign:"center"}}>
            <Typography variant="h3">Details</Typography>
              <p style={{fontSize:"30px"}}>You joined Hire a Drive on {details.dateOfJoining?((()=>{const{day, month, year}=ExtractDateComponents(details.dateOfJoining);return `${day}/${month}/${year}`;})()):("N/A")}</p>
              <p style={{fontSize:"30px"}}>Name: {details.username}</p>
              <p style={{fontSize:"30px"}}>Date of Birth: {details.dateOfBirth?((()=>{const{day, month, year}=ExtractDateComponents(details.dateOfBirth);return `${day}/${month}/${year}`;})()):("N/A")}</p>
              <p style={{fontSize:"30px"}}>District: {details.district}</p>
              <p style={{fontSize:"30px"}}>Address: {details.address}</p>
            </Paper>
          </div>
        </Stack>
        <p style={{width:"15%",marginRight:"-0%"}}>&nbsp;</p>
        <Stack className={styles.passwordAndAddress}>
          <Box className={styles.columnContainer}>
            <Box className={styles.passwordContainer}>
              <Typography variant="h5" sx={{padding:"0 5%",marginBottom:"3%"}}>Change Password:</Typography>
              <InputLabel htmlFor="password" sx={{fontSize:"27px",width:"100%",marginLeft:"30%"}}>Password:&nbsp;&nbsp;<input id="password" type="text" onChange={handlePassword} className={styles.password}/></InputLabel>
              <p></p>
              <InputLabel htmlFor="confirmPassword" sx={{fontSize:"27px",width:"100%",marginLeft:"19%"}}>Confirm Password:&nbsp;&nbsp;<input id="password" type="text" onChange={handleConfirmPassword} className={styles.password}/></InputLabel>
              <p></p>
              <Typography variant="h4" sx={{color:"red",fontSize:"35px",width:"100%",marginLeft:"18%"}}>{error}</Typography>
              <Button variant="contained" color="success" onClick={changePassword} sx={{width:"22%", marginLeft:"75%"}}>Change Password</Button>
            </Box>
            <Box className={styles.addressContainer}>
              <Typography variant="h6" sx={{padding:"0 5%",marginBottom:"3%", marginRight:"65%"}}>Change Region & Address:</Typography>
              <InputLabel htmlFor="region" sx={{marginRight:"50%", fontSize:"20px"}}>Region:</InputLabel>
              <Select id="region" value={region} onChange={handleRegion} className={styles.region}>
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
              <Button variant="contained" color="success" onClick={changeRegion} sx={{width:"22%", marginLeft:"75%",marginTop:"-4%"}}>Change Region</Button>
              <p></p>
              <InputLabel htmlFor="address" sx={{marginRight:"50%", fontSize:"22px"}}>Address:</InputLabel>
              <TextareaAutosize id="address" minRows={5} onChange={handleAddress} className={styles.address}/>
              <Button variant="contained" color="success" onClick={changeAddress} sx={{width:"22%", marginLeft:"75%",marginTop:"-7%"}}>Change Address</Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default UserProfile