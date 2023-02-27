import { ThemeProvider } from "@emotion/react";
import { Card, CardContent, Drawer } from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import theme from "../styles/Styles";

function Profile(props) {
    const { name, age } = { ...props };
    return (
        <ThemeProvider theme={theme}>
            <Link to='/message' >Go to Message</Link>
            <h1 style={{ backgroundColor: "blue" }} > {name}, {age}2 </h1>
            <Stack padding={5} direction="row" spacing={6}>

                <Card sx={{ bgcolor: 'secondary.main', color: '#fff' }}>
                    <CardContent >Cardcontent1</CardContent>
                </Card>
                <Card></Card>
                <Drawer></Drawer>
            </Stack>
        </ThemeProvider >
    )
}
export default Profile;