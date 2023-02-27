import { createTheme } from "@mui/material/styles"

const Colors = {
    primary: "#00796b",
    secondary: "#6200ea",
    error: "#f44336",
    warning: "#ff9800",
    
}
const theme = createTheme({
    palette: {
        primary: {
            main: Colors.primary
        },
        secondary: {
            main: Colors.secondary
        },
        error: {
            main: Colors.error
        },
        warning: {
            main: Colors.warning
        },
        success: {
            main: "#4caf50"
        },
        background: {
            paper: '#EFF7FF', // your color
        },
    }
})
export default theme;
