import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StudentIcon from '@mui/icons-material/Group';
import TeacherIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import { Avatar, Badge, GlobalStyles, Menu, MenuItem } from '@mui/material';
import '../../index.css';
import { AccountCircle } from '@material-ui/icons';
import usersApi from '../../api/usersApi';
import getUserFromCookie, { removeCookie } from '../../helper/cookieHelper';
import { Logout, NotificationsNone, Settings } from '@mui/icons-material';
import { displayTimeDistance } from '../../helper/dateFormatHelper';
import io from 'socket.io-client';
import notificationsApi from '../../api/notificationsApi';

const socket = io.connect("http://localhost:4000");

const drawerWidth = 180;
const bodyColor = "rgba(246, 246, 246, 0.8)"
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  toolbar: theme.mixins.toolbar,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {

  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function MiniDrawer() {


  // function deleteAllCookies() {
  //   const cookies = document.cookie.split(";");

  //   for (let i = 0; i < cookies.length; i++) {
  //     const cookie = cookies[i];
  //     const eqPos = cookie.indexOf("=");
  //     const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //   }
  // }


  const sideBarMainFeatures = [
    // {
    //   text: <Typography sx={{ fontSize: '18px' }} variant="h5" component="h5">
    //     Dashboard
    //   </Typography>, icon: <DashboardIcon />, path: '/dashboard',
    // },
    {
      text: <Typography sx={{ fontSize: '18px' }} variant="h5" component="h5">
        Room
      </Typography>, icon: <MeetingRoomIcon />, path: '/room',
    },
    {
      text: <Typography sx={{ fontSize: '18px' }} variant="h5" component="h5">
        Booking
      </Typography>, icon: <CalendarMonthIcon />, path: '/booking'
    },
    {
      text: <Typography sx={{ fontSize: '18px' }} variant="h5" component="h5">
        Student
      </Typography>, icon: <StudentIcon />, path: '/student'
    },
    // {
    //   text: <Typography sx={{ fontSize: '18px' }} variant="h5" component="h5">
    //     Teacher
    //   </Typography>, icon: <TeacherIcon />, path: '/teacher'
    // }
  ];
  const settings = [
    // { text: 'Setting', icon: <SettingsIcon /> }
  ]
  const navigate = useNavigate();
  const theme = useTheme();
  let [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    if (open) setOpen(false); //if it open close it back
    else setOpen(true)

    console.log(React.useState)
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(Boolean(anchorEl));
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = React.useState(false);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [notifications, setNotifications] = React.useState([]);
  const [unReadNotifications, setUnReadNotifications] = React.useState(0);
  const [userProfileInfo, setUserProfileInfo] = React.useState();

  const getUserProfileInfomation = async () => {
    const res = await usersApi.getOneUser(getUserFromCookie('token').user_id);
    console.log(res.data.data[0]);
    setUserProfileInfo(res.data.data[0]);
  }
  const onUserProfileSettings = async () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
    navigate('/profile-setting')
  }
  const renderNotificationsMessage = (message) => {

    return (
      <div dangerouslySetInnerHTML={{ __html: message }}></div>
    );
  }
  
  const setupSocketListener = () => {
      socket.on('newBookingForAdminNotification', (data) => {
        console.log('here we gooooooooo')
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
        setUnReadNotifications((prevCount) => prevCount + 1);
      });

  };

  React.useEffect(() => {
    console.log('1')
    setupSocketListener();
    console.log('2')
    // if(setUpS)
    getUserProfileInfomation();
    console.log(notifications, 'xdssxx')
    return () => {
      socket.off('newBookingForAdminNotification');
    };
  }, []);
  const handleProfileMenuOpen = (event) => {
    setIsMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationsMenuOpen = (event) => {
    setIsNotificationsMenuOpen(true);
    setNotificationsAnchorEl(event.currentTarget);
    setUnReadNotifications(0)
  };
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
    setIsNotificationsMenuOpen(false);
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
    handleMobileMenuClose();
  };
  const handleMenuLogout = () => {
    navigate('/login');
    document.setCookie('token', '', 0)
  }
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const onUserLogOut = () => {
    removeCookie('token');
    setAnchorEl(null);
    setIsMenuOpen(false);
    window.location.reload();
  }
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      onBlur={handleMenuClose}
      MenuListProps={{ style: { paddingTop: 0, width: 280, maxWidth: 280, height: 200 } }}
      PaperProps={{
        style: {
          borderRadius: '12px',
        },
      }}
      anchorEl={anchorEl} // Use separate anchorEl for profile menu and notification menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose} // Update the event handler for the profile menu
    >
      {/* Profile menu content */}
      <section className='notifications__container user_profile_container'>

        <div>
          <AccountCircle />
          <div className="profile-name">{userProfileInfo?.name}</div>
        </div>
        <Divider />



      </section>
      <section className='notifications__content user_profile_content'>
        <div className='profile-content' onClick={onUserProfileSettings}>
          <Settings />
          <div>Profile Settings</div>
        </div>
        <div className='profile-content' onClick={onUserLogOut}>
          <Logout />
          <div >Log Out</div>
        </div>
      </section>

      {/* <MenuItem onClick={handleMenuClose}>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                {userProfileInfo.name}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  );
  const renderNotificationsMenu = (
    <Menu
      MenuListProps={{ style: { paddingTop: 0, width: 480, maxWidth: 480, height: 500 } }}
      PaperProps={{
        style: {
          borderRadius: '12px',
        },
      }}
      anchorEl={notificationsAnchorEl} // Use separate anchorEl for notifications menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose} // Update the event handler for the notification menu
    >

      <section className='notifications__container'>

        <div>Notifications</div>
        <Divider />



      </section>


      {notifications.length === 0
        ?

        <div className='notifications__empty-content'>
          <div className='notification-icon'>
            <NotificationsNone />
          </div>
          <div>Your notifications live here</div>
        </div>

        :

        <section className='notifications__content' style={{ paddingTop: '55px' }}>
          {notifications.map(item =>
            <div>
              {/* <div className={`${item.is_read ? 'read_notification-sign' : 'unread_notification-sign'}`}></div> */}
              <div>
                <div onClick={handleNotificationsMenuClose}>{renderNotificationsMessage(item.message)}</div>
                <div className='time-to-now' onClick={handleNotificationsMenuClose}>{displayTimeDistance(item.created)}</div>
              </div>
            </div>
          )
          }
        </section>

      }


    </Menu>
  );


  return (

    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <AppBar position="fixed" open={false} >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Stack width={2000} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" noWrap component="div">
              Admin Page
            </Typography>
           <div>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsMenuOpen}

              >
                <Badge badgeContent={unReadNotifications} color="error">
                  {isNotificationsMenuOpen ? <NotificationsIcon /> : <NotificationsNone />}
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle fontSize="large" />

              </IconButton>
           </div>
            {renderMenu}
            {renderNotificationsMenu}
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} className='drawer__sidebar-container'>
        <DrawerHeader className='thisis2' >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List style={{ border: 'none !important' }}>

          {sideBarMainFeatures.map((item, index) => (

            <ListItem
              key={index} disablePadding sx={{ display: 'block' }}
              style={({ isActive }) => ({

                color: isActive ? 'var(--primary-color)' : 'black',
                backgroundColor: isActive ? 'rgba(245, 245, 240, 0.7)' : '',
              })}
              component={NavLink} to={`${item.path}`}
            >

              <ListItemButton
              disableRipple
                LinkComponent={`${item.path}`}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  component={NavLink}
                  className={`${({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                        ? "pending"
                        : ""
                  }`}
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}

                >

                  {item.icon}


                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

          ))}
        </List>

        <Divider />
        <List>
          {settings.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}

              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <GlobalStyles styles={{
          body: { backgroundColor: bodyColor },

        }}>


        </GlobalStyles>
        < Outlet />
      </Box>
    </Box >
  );
}
export default MiniDrawer