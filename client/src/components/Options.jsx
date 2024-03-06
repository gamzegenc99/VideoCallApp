import React, { useContext, useState } from "react";
import { Button, TextField, Grid, Typography, Container,Paper} from "@mui/material";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {VideoCall, Assignment, VideocamOff} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import { SocketContext } from "../SocketContext";

function Options( { children } ) {
    const {me, callAccepted, name, setName,callEnded, leaveCall, callUser} = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState("");
    const [calling, setCalling] = useState(false); // created for LoadingButton 
    
    return(
        <Container sx={{pb:1,width:550 }}>
            <Paper elevation={10} >
                    <form autoComplete="off" noValidate >
                        <Grid container>
                            <Grid item xs={12} md={6} sx={{p:5}} >
                                <Typography gutterBottom variant="h6">Account Info</Typography>
                                <TextField label="name" value={name} onChange={(e) => setName(e.target.value)} fullWidth variant="filled" required margin="dense"/> {/**setting value of name w onchange handler Değer değiştirildiğinde geri arama tetiklenir.*/}
                                <CopyToClipboard text={me}>
                                    <Button variant="contained" fullWidth  startIcon={<Assignment  fontSize="large"/>}>Copy Your ID</Button>
                                </CopyToClipboard>
                            </Grid>
                      
                            <Grid item xs={12} md={6} sx={{p:5}}>
                                <Typography gutterBottom variant="h6">Make a Meeting</Typography>
                                <TextField  label="ID to Call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth variant="filled" required margin="dense"/> {/**setting value of name w onchange handler Değer değiştirildiğinde geri arama tetiklenir.*/}
                                {callAccepted && !callEnded ? (
                                    <Button variant="contained" color="error" startIcon={<VideocamOff fontSize="large"/>} fullWidth onClick={leaveCall}>end meeting</Button>
                                ):(
                                    <LoadingButton variant="contained" color="primary" fullWidth startIcon={<VideoCall fontSize="large"/>} loadingIndicator="Calling..." loading={calling} onClick = { () => {setCalling(true); callUser(idToCall); }} > Video Call </LoadingButton>
                                )}                    
                            </Grid>
                        </Grid>
                    </form>
                {children} {/**Notification component inside of options comp */}                        
            </Paper>
            
        </Container>
    );
}
export default Options;