import { Card, Checkbox, Fab, FormHelperText, Grid } from "@mui/material";
import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { height, Stack } from "@mui/system";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import BookIcon from '@mui/icons-material/Book';
import ClearIcon from '@mui/icons-material/Clear';
function RequestApprove(){
return (
    

    <React.Fragment>
        
        
         <Stack  justifyContent="right" alignItems="center" paddingTop={2} >
        <span>
            <Stack direction={"row"} sx={{marginRight:10,paddingBottom:3}}>
            <Fab size="medium" variant="extended" color="primary" aria-label="add" sx={{boxShadow:"0"}} >
            
                <BookIcon sx={{ m:1 }}/>
         
            </Fab>
            <Stack >
            <span style={{marginLeft:"10px"}} ><b>Request</b></span>
            <b style={{marginLeft:10, color:"red"}}>09</b>
            </Stack>
             </Stack> 
            </span>
            <span>
            <Stack direction={"row"} sx={{marginRight:8.8 ,paddingBottom:3}}>
            <Fab size="medium" variant="extended" color="primary" aria-label="add" sx={{boxShadow:"0"}} >
            
                <CheckBoxIcon sx={{ m:1 }}/>
         
            </Fab>
            <Stack >
            <span style={{marginLeft:"10px"}} ><b>Approved</b></span>
            <b style={{marginLeft:10, color:"red"}}>05</b>
            </Stack>
             </Stack> 
            </span> 
            <span>
            <Stack direction={"row"} sx={{marginRight:11.2,paddingBottom:3}}>
            <Fab size="medium" variant="extended" color="primary" aria-label="add" sx={{boxShadow:"0"}} >
            
                <CancelIcon sx={{ m:1 }}/>
         
            </Fab>
            <Stack >
            <span style={{marginLeft:"10px"}} ><b>Cancel</b></span>
            <b style={{marginLeft:10, color:"red"}}>09</b>
            </Stack>
             </Stack> 
            </span> 
            <span>
            <Stack direction={"row"} sx={{marginRight:9}}>
            <Fab size="medium" variant="extended" color="primary" aria-label="add" sx={{boxShadow:"0"}} >
            
                <ClearIcon sx={{ m:1 }}/>
         
            </Fab>
            <Stack >
            <span style={{marginLeft:"10px"}} ><b>Rejected</b></span>
            <b style={{marginLeft:10, color:"red"}}>09</b>
            </Stack>
             </Stack> 
            </span>
         </Stack>
          
         
            
        

           
            
            
     
        
    </React.Fragment>
)};

export default RequestApprove;