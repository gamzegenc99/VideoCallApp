import React, { useContext } from "react";
import {Grid,Typography,Paper} from '@mui/material';
import { SocketContext } from "../SocketContext";


// creating video iframe and putting the stream inside
function VideoPlayer() {
    
    const {name, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext); // get data from context

    return (
        <Grid container  spacing={3} sx={{padding:3, justifyContent:"center" }}> {/** add css style with sx prop*/}
            <Grid item>
                {stream && (
	                <Paper elevation={10} >
	                    <Grid item xs={12} md={6} sx={{m:1, p:1}}>
	                        <Typography  variant= "h5" gutterBottom> {name || "Name"} </Typography>
	                        <video playsInline muted ref={myVideo} autoPlay style={{ width: "350px" }}/>
                        </Grid>
                    </Paper>
	            )}
            </Grid>

            {/* user's video */}
            <Grid item >
	            {callAccepted && !callEnded && (
	                <Paper elevation={10}>
	                    <Grid item xs= {12} md={6} sx={{m:1, p:1}}> 
	                        <Typography variant= "h5" gutterBottom> {call.name || "Name"} </Typography>
	                        <video playsInline muted ref={userVideo} autoPlay style={{ width: "350px" }}/>
	                    </Grid>
	                </Paper>
                )}
            </Grid>
	    </Grid>
    );
};
export default VideoPlayer;