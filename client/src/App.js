import React from "react";
import {Typography,AppBar,Toolbar} from '@mui/material';
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notifications from "./components/Notifications";

function App() {
    return(
        <>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Video Call App</Typography>
            </Toolbar>
          </AppBar>
          <VideoPlayer />
          <Options>
            <Notifications />
          </Options>
        </>
     
    );
    
}

export default App;