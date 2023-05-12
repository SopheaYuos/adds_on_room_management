import { createBrowserRouter, redirect } from "react-router-dom";
import Teacher from "./pages/Teacher/Teacher";
import Student from "./pages/Student/Student";
import Room from "./pages/Room/Room"
import MiniDrawer from "./pages/Drawer";
import Dashboard from "./pages/Dashboard/Dashboard";
import Booking from "./pages/Booking/Booking";
import { Login } from "./pages/Auth/Login";
import User from "./pages/Users/Main";
import Book from "./pages/Users/UserBooking/Book";
import BookedRoom from "./pages/Users/BookedRooms/BookedRooms";
import NotFound from "./pages/NotFound";
import jwt_decode from "jwt-decode";
// import io from 'socket.io-client'
import Test from "./pages/Test";
import { Login2 } from "./pages/Auth/Login/Login2";
import { ForgotPassword } from "./pages/Auth/ForgotPassword/forgotPassword";
import { RegisterForm } from "./pages/Auth/RegisterForm";
import { Register2 } from "./pages/Auth/Register/Register2";
import { ResetPassword } from "./pages/Auth/ResetPassword/ResetPassword";
// import { RegisterForm } from "./pages/Auth/RegisterForm";
// import RegisterPage from "./pages/Auth/Register/Register";
// import { Login2 } from "./pages/Auth/Login2";
// import { ForgotPassword } from "./pages/Auth/forgotPassword";
// const socket = io('http://localhost:4000', { transports: ['websocket'] });

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie[name];
}
function CheckAuth() {
  const cookie = getCookie('token');
  if (!cookie) {
    console.log('NO cookie');
    return redirect("/login")
  }
}
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MiniDrawer />,
    loader: CheckAuth,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: () => {
          if (jwt_decode(getCookie('token')).user_role === 'ADMIN') {
            return redirect("/dashboard")
          } else {
            return redirect("/user/book")

          }
        }
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/room",
        element: <Room />,
      }, {
        path: "/student",
        element: <Student />,
      }, {
        path: "/teacher",
        element: <Teacher />
      },

    ],

  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/login2',
    element: <Login2 />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/register',
    element: <RegisterForm />
  },
  {
    path: '/register2',
    element: <Register2 />
  },
  {
    path: '/test',
    element: <Test />
  },
  {
    path: '/user',
    element: <User />,
    loader: CheckAuth,
    children:
      [
        {
          index: true,
          element: <Book />
        },
        {
          path: '/user/book',
          element: <Book />
        },
        {
          path: '/user/booked_room',
          element: <BookedRoom />
        }
      ]

  }, {

    path: '*',
    element: <NotFound />

  }


]);
