import React, { useContext, useEffect} from "react";
import { Button,Alert} from "@mui/material";
import { SocketContext } from "../SocketContext";
import ringtoneSound from "../assets/hang.mp3";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

function Notifications() { 
    const {answerCall, call, callAccepted, declineCall } = useContext(SocketContext);

    useEffect(() => {
        if (call.isReceivedCall && !callAccepted) {
            const audio = new Audio(ringtoneSound);
            audio.loop = true; // Loop the ringtone
            audio.play();
            return () => {
                audio.pause(); // Pause the ringtone when call is accepted or component unmounts
            };
        }
    }, [call, callAccepted]);
    
    return (
        <>
            {call.isReceivedCall && !callAccepted && (
                <div style={{paddingBottom:20, display:"flex", justifyContent:"center", gap:10}}>
                    {/* <Typography gutterBottom variant="h6"align="inherit" icon={<ContactPhoneIcon fontSize="inherit" />}>{call.name} is calling... </Typography>   */}
                    <Alert icon={<ContactPhoneIcon fontSize="medium" />} severity="info">{call.name} is calling...</Alert>
                    <Button variant="contained" color="primary" onClick={answerCall} >
                        Answer
                    </Button> 
                    <Button variant="contained" color="error" onClick={declineCall}>
                        Decline 
                    </Button>
                </div>
            )}
        </>

    );

}
export default Notifications;