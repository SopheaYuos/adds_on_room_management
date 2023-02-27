import { Chip, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";


function  Keys(){
return (
    

    <React.Fragment>
        
       
            <Stack justifyContent="center" alignItems="center">
            <h3>Return Keys</h3>
            <Chip sx={{width:"90px", backgroundColor:"#6FDFDF"}} label="5" />
             <h3>Took Keys</h3>
            
            <Chip sx={{width:"90px", backgroundColor:"#6FDFDF"}} label="5" />
           
            </Stack>
      
        
    </React.Fragment>
)};

export default Keys;