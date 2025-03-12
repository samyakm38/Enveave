import React from 'react';
// import { useSelector } from 'react-redux';
import { Button, Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Header = () => {
    // const { isLoggedIn, user } = useSelector((state) => state.auth);
    // const location = useLocation();
    const [activeLink, setActiveLink] = React.useState(location.pathname);

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
                </Navbar.Brand>

                <div className="flex md:order-2">
                    {/*{!isLoggedIn ? (*/}
                    {/*    <Link to="/login">*/}
                    {/*      <Button color="gray">Login</Button>*/}
                    {/*    </Link>*/}
                    {/*) : (*/}
                    {/*    <>*/}
                    {/*      {(() => {*/}
                    {/*        if (user.isAdmin === 'true') {*/}
                    {/*          // console.log('in if',user.isAdmin);*/}
                    {/*          return (*/}
                    {/*              <Link to="/admin/dashboard">*/}
                    {/*                <img*/}
                    {/*                    src={user.profilePic}*/}
                    {/*                    alt="Profile"*/}
                    {/*                    className="w-10 h-10 rounded-full object-cover"*/}
                    {/*                    style={{ cursor: 'pointer' }}*/}
                    {/*                />*/}
                    {/*              </Link>*/}
                    {/*          );*/}
                    {/*        } else {*/}
                    {/*          return (*/}
                    {/*              <Link to="/user/dashboard">*/}
                    {/*                <img*/}
                    {/*                    src={user.profilePic}*/}
                    {/*                    alt="Profile"*/}
                    {/*                    className="w-10 h-10 rounded-full object-cover"*/}
                    {/*                    style={{ cursor: 'pointer' }}*/}
                    {/*                />*/}
                    {/*              </Link>*/}
                    {/*          );*/}
                    {/*        }*/}
                    {/*      })()}*/}
                    {/*    </>*/}
                    {/*)}*/}
                    <Link to="/login">
                        <Button
                            style={{
                                backgroundColor: '#113627',
                                border: '2px solid #FFF',
                                fontFamily: 'Montserrat',
                            }}
                        >
                            Sign-up
                        </Button>
                    </Link>
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
                        NGOs
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
                        About us
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