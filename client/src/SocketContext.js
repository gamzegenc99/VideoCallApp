import React, {createContext, useState, useRef, useEffect} from "react";
import {io} from "socket.io-client";
import Peer from "simple-peer";


const SocketContext = createContext();

// const socket = io('http://localhost:5000');
const socket = io('https://videocall-f7b79f270245.herokuapp.com/'); //passing in a srting of our server

function ContextProvider({children}) { //props
    const [stream, setStream] = useState(); // initial state is null.
    const [me, setMe] = useState(""); 
    const [call, setCall] = useState({}); //empty object
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name,setName] = useState("");
    const [callDeclined,setCallDeclined] = useState(false);
    

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    
    //permission for audio and camera 
    useEffect(() => {
        const constraints = {
            'video':  {
                mandatory: {
                    width:{
                        "min": 350,
                        "max": 550

                    },
                    "height": {
                        "min": 350,
                        "max": 550
                    }
                  },
                },
            'audio': {'echoCancellation': true}
        }
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => { //currentStream => stream or you can say mediaStream
                console.log('Got MediaStream:', stream);
                setStream(stream);                 
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });

        socket.on("me", (id) => setMe(id)); // listen for a specific action here get specific id
        
        socket.on("callUser", ({from, name: callerName, signal }) => { // get data object
            setCall({ isReceivedCall: true, from, name: callerName, signal }); // property called isReceived -receiving call  bc sometimes giving a call and sometimes it's going to receive a call 
        }); 
  
    }, []); // add empty dependicy array otherwise its always going run  
    
    useEffect(() => {
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      }, [myVideo, stream]);
      
    function answerCall() {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream: stream}); // create peer using simple peer
        // recieve signal then execute get data about signal and establish connection video
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: call.from });        
        });
        // stream for the other person
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });
        peer.signal(call.signal);      // come from initial socket
        connectionRef.current = peer; //current connection is equal to the current peer who is inside of this connection 
    };

    function callUser(id) {
        const peer = new Peer( { initiator:true, trickle: false, stream: stream }); //Every Peer object is assigned a random, unique ID when it's created.

        peer.on("signal", (data) => { 
            socket.emit("callUser", { userToCall: id, signalData: data, from: me, name: name});
        });

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };
    function declineCall() {
        setCallDeclined(true);
        const declinedBy = name;          
        socket.emit("declineCall", { from: call.from, name: declinedBy });
        alert(`Call declined by ${name}`)
        leaveCall();
    };

    function leaveCall() {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }// destroy specific connection stop receiving input{video audio} from users
        window.location.reload();// reloads the page and provides a user with new id
    };
    
    //globally accessible all of components -children  means all components that we have in there are going to be inside of that socket wrapped into it
    return(
        <SocketContext.Provider value={{ call, callAccepted,myVideo,userVideo,stream, name, setName, callEnded, me, callUser, leaveCall, answerCall,callDeclined, setCallDeclined,declineCall}} > 
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext};