// import { Component } from "react";
// import Button from '@mui/material/Button'
// import theme from "../styles/Styles";
// import { ThemeProvider } from "@emotion/react";
// import CustomizedSnackbars from "./Snackbar";
// import { Link } from "react-router-dom"

// class Message extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             counter: this.props.count
//         }
//         console.log("state", this.state)

//     }
//     countNum() {
//         this.setState({
//             counter: this.state.counter + 1
//         })
//     }
//     render() {
//         return (
//             <ThemeProvider theme={theme}>
//                 <h2>class count {this.state.counter} </h2>'
//                 <CustomizedSnackbars />
//                 <nav><Link to='/room'>Click me</Link></nav>

//                 <Button variant="contained" onClick={
//                     () => this.countNum()

//                 }>
//                     Submit mee
//                 </Button>
//             </ThemeProvider>
//         )
//     }
// }
// export default Message;