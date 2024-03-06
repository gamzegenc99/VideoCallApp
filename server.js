//Modüllerin içe aktarılması
import express from "express"; 
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express(); // express modülü kullanarak app yani uygulama oluşturulması.
const server = http.createServer(app); // app uygulamasının HTTP sunucusuna dönüştürülmesi


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}); 
app.use(cors());

//Set-up server
app.get("/", (req, res) => { // express get ve send metodu 
    try {
        res.status(200).send("Server is running"); // if request success return successful response to client
    } catch (error) {
        res.status(500).send("Internal Server Error"); // if request error return internal server error to client
    }
});

//socket.io - Socket aracılığıyla bağlantı oluşturma
io.on("connection", (socket) => { //io socketten objemiz | eventname,(..arg listener) ev — Name of the event,@param listener — Callback function

    //console.log(socket.id,"connected");

    socket.emit("me", socket.id); // me bc i joined thats my specifies user

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")  //simply broadcast meassage bu sokete bağlı clientların disconnet oluna bu mesaj hepsine gitsin istiyorum.
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => { // Kullanıcıyı arayabilme yeteneği 
        io.to(userToCall).emit("callUser", {signal:signalData, from, name}) // Destructuring data from received client side. usertocall user idsi. 
        
    });
    
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
    
    socket.on("declineCall", (data) => {
        io.to(data.to).emit("callDeclined",{name:data.name});
    });  

})

// Bağlantı noktası(port) belirleme ve sunucuyu başlatma
const port = process.env.PORT || 5000;

    server.listen(port, () => {
        console.log(`Express server listening on port http://localhost:${port}`);  
    });

    

    

