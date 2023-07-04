import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button, Divider } from '@mui/material';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';
import './StyleUser.css';
import { Logout, NotificationsNone, Settings } from '@mui/icons-material';
import notificationsApi from '../../api/notificationsApi';
import getUserFromCookie, { removeCookie } from '../../helper/cookieHelper';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { displayTimeDistance } from '../../helper/dateFormatHelper';
import usersApi from '../../api/usersApi';
const socket = io.connect("http://localhost:4000");

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function User() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const [isMenuOpen, setIsMenuOpen] = React.useState(Boolean(anchorEl));
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = React.useState(false);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [notifications, setNotifications] = React.useState([]);
    const [unReadNotifications, setUnReadNotifications] = React.useState(0);
    const [userProfileInfo, setUserProfileInfo] = React.useState();
    const handleProfileMenuOpen = (event) => {
        setIsMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };
    const handleNotificationsMenuOpen = (event) => {
        setIsNotificationsMenuOpen(true);
        setNotificationsAnchorEl(event.currentTarget);
    };
    const handleNotificationsMenuClose = ()=>{
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

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const setupSocketListener = () => {
        socket.on('notificationApprovalSocket', (notifcationData) => {
            setNotifications((prevNotifications) => [...notifcationData, ...prevNotifications]);
        });
    };
    const onUserLogOut = () =>{
        removeCookie('token');
        window.location.reload();
        console.log('here we go');
    }
    const getNotificationFromApi = async()=>{
        try {
            const result = await notificationsApi.getAllNotificationByUserId(getUserFromCookie('token').user_id);
            setNotifications(result.data.data)
            let counter = 0;
            result.data.data.map(item => {
                if (!item.is_read) {
                    counter++;
                }
            })
            setUnReadNotifications(counter)

        }
        catch (err) {
            // setSnackBar({ isOpen: true, message: "Server Error", type: "error" })
            // setLoading(false)

        }
    }
    const getUserProfileInfomation = async() => {
        const res = await usersApi.getOneUser(getUserFromCookie('token').user_id);
        console.log(res.data.data[0]);
        setUserProfileInfo(res.data.data[0]);
    }
     React.useEffect(() =>{
        setupSocketListener();
        getNotificationFromApi();
         getUserProfileInfomation();
        return () => {
            socket.off('notificationApprovalSocket');
        };
    }, []);

    const menuId = 'custom-menu-profile';
    const renderMenu = (
        <Menu
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
                <div className='profile-content'>
                    <Settings />
                    <div>Profile Settings</div>
                </div>
                <div className='profile-content' onClick={onUserLogOut}>
                    <Logout/>
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
    const renderNotificationsMessage = (message) => {

        return (
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
        );
    }
    const renderNotificationsMenu = (
        <Menu
            MenuListProps={{style: { paddingTop: 0, width: 480, maxWidth: 480, height: 500} }}
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
                    
                    <section className='notifications__content'>
                            {console.log(notifications, 'notification')}
                          {  notifications.map(item =>
                            <div>
                                <div className={`${item.is_read ? 'read_notification-sign' : 'unread_notification-sign'}`}></div>
                                  <div>
                                      <div className='room-name' onClick={handleNotificationsMenuClose}>{(item.room_name)} {item.sub_room_name ? `(${item.sub_room_name})` : ''}</div>
                                      <div onClick={handleNotificationsMenuClose}>{renderNotificationsMessage(item.message)}</div>
                                      <div className='time-to-now' onClick={handleNotificationsMenuClose}>{displayTimeDistance(item.created)}</div>
                                  </div>
                                  <div>
                                      <img className='notification-room-img' src={item.room_image_url}/>
                                  </div>
                            </div>
                            )
                            }
                        </section>

                }
            
                    
        </Menu>
    );


    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={1000} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    aria-controls="notification-id"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        
        <Box className='user__page-container'>
            <AppBar sx={{ backgroundColor: '#1565c0' }} position="fixed">
                <Toolbar>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        User Page
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, }} className='user__page-box'>
                        <Button
                            className='user__page-nav-bar-button'
                            style={({ isActive }) => ({
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                            })}
                            component={NavLink} to={`${'/user/book'}`
                            } size="large" aria-label="show 4 new mails" color="inherit">

                            Book
                        </Button>
                        
                        <Button className='user__page-nav-bar-button' style={({ isActive }) => ({
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                        })}
                            component={NavLink} to={`${'/user/booked_room'}`} aria-label="show 4 new mails" color="inherit">

                            Booked Rooms
                        </Button>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={handleNotificationsMenuOpen}

                        >
                            <Badge badgeContent={unReadNotifications} color="error">
                                {isNotificationsMenuOpen ? <NotificationsIcon />  : <NotificationsNone />}
                            </Badge>
                        </IconButton>
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
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {renderNotificationsMenu}
            <Outlet ></Outlet>
        </Box >
    );
}