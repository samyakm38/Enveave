import React, { useState, useEffect } from 'react';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../redux/hooks';
import { useProfileImage } from '../../redux/hooks/useProfileImage';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(location.pathname);
    const { currentUser, isAuthenticated, userType, logout } = useAuth();
    const { profileImage } = useProfileImage(); // Add our new custom hook to get the profile image

    // Base link styles
    const linkBaseStyle = {
        fontFamily: 'Montserrat',
        fontSize: '1.15rem',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
    };

    // Function to get link style with conditional color
    const getLinkStyle = (path) => ({
        ...linkBaseStyle,
        color: activeLink === path ? '#F6F67D' : '#FFFFFF',
        ...(path === '/contact-us' && { marginRight: '50px' }) // Only add marginRight for contact-us
    });

    return (
        <div style={{
            padding: '2rem',
            backgroundColor: "#e9eaec",
            zIndex: 1,
        }}>
            <Navbar fluid style={{
                background: '#113627',
                borderRadius: '0.5rem'
            }}>
                <Navbar.Brand href="/">
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        style={{ height: '4rem', width: 'auto' }}
                    />
                    <span
                        className="self-center whitespace-nowrap text-xl font-semibold"
                        style={{
                            color: "#FFF",
                            fontFamily: 'Montserrat Alternates',
                            fontSize: '1.75rem',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: 'normal',
                            marginLeft: '-10px'
                        }}
                    >
                        ENVEAVE
                    </span>
                </Navbar.Brand>                <div className="flex md:order-2">
                    {!isAuthenticated ? (
                        <Link to="/login">
                            <Button
                                style={{
                                    backgroundColor: '#113627',
                                    border: '2px solid #FFF',
                                    fontFamily: 'Montserrat',
                                }}
                            >
                                Sign-in
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center">
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={                                <Avatar
                                        alt="User profile"
                                        img={profileImage || "/dashboard-default-user-image.svg"}
                                        rounded
                                        bordered
                                        color="success"
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                }
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm font-medium truncate">
                                        {userType === 'volunteer' ? (currentUser?.name || 'User') : 
                                         userType === 'provider' ? (currentUser?.organizationName || 'Organization') : 'Admin'}
                                    </span>
                                    <span className="block truncate text-sm">
                                        {currentUser?.email || ''}
                                    </span>
                                </Dropdown.Header>
                                <Dropdown.Item onClick={() => navigate(userType === 'volunteer' ? '/volunteer/dashboard' :
                                    userType === 'provider' ? '/provider/dashboard' : '/admin/dashboard'
                                )}>
                                    Dashboard
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => {
                                    logout();
                                    navigate('/');
                                }}>
                                    Sign out
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                    )}
                    <Navbar.Toggle />
                </div>

                <Navbar.Collapse style={{ marginTop: 0 }}>
                    <Link
                        key={0}
                        to="/"
                        onClick={() => setActiveLink('/')}
                        style={getLinkStyle('/')}
                    >
                        Home
                    </Link>
                    <Link
                        key={1}
                        to="/volunteers"
                        onClick={() => setActiveLink('/volunteers')}
                        style={getLinkStyle('/volunteers')}
                    >
                        Volunteers
                    </Link>
                    <Link
                        key={2}
                        to="/ngos"
                        onClick={() => setActiveLink('/ngos')}
                        style={getLinkStyle('/ngos')}
                    >
                        Organization
                    </Link>
                    <Link
                        key={3}
                        to="/opportunities"
                        onClick={() => setActiveLink('/opportunities')}
                        style={getLinkStyle('/opportunities')}
                    >
                        Opportunities
                    </Link>
                    <Link
                        key={4}
                        to="/about-us"
                        onClick={() => setActiveLink('/about-us')}
                        style={getLinkStyle('/about-us')}
                    >
                        About Us
                    </Link>
                    <Link
                        key={5}
                        to="/contact-us"
                        onClick={() => setActiveLink('/contact-us')}
                        style={getLinkStyle('/contact-us')}
                    >
                        Contact Us
                    </Link>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Header;