import React from 'react';
// import { useSelector } from 'react-redux';
import {Button, Navbar} from 'flowbite-react';
import {Link} from 'react-router-dom';

const Header=() => {
    // const { isLoggedIn, user } = useSelector((state) => state.auth);  // Access the auth state from Redux
    // const location = useLocation();
    const [activeLink, setActiveLink]=React.useState(location.pathname);


    // console.log('User:', user);
    // console.log('isAdmin:', user?.isAdmin);

    return (
        <Navbar fluid style={{background: '#113627'}}>
            <Navbar.Brand href="/">
                <img
                    src="/logo.svg"
                    // className="mr-1"
                    alt="Logo"
                    style={{height: '4rem', width: 'auto'}}
                />


                <span className="self-center whitespace-nowrap text-xl font-semibold"
                      style={{
                          color: "#FFF",
                          fontFamily: 'Montserrat Alternates',
                          fontSize: '1.75rem',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          lineHeight: 'normal',
                          marginLeft: '-10px'
                      }}>
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
                    <Button style={{
                        backgroundColor: '#113627',
                        border: '2px solid #FFF',
                        fontFamily: 'Montserrat',
                    }}
                    >
                        Sign-up
                    </Button>
                </Link>
                <Navbar.Toggle/>
            </div>
            <Navbar.Collapse style={{marginTop: 0}}>
                {/* Navbar Links */}
                <Link
                    key={0}
                    to="/"
                    onClick={() => setActiveLink('/')}
                    style={{
                        color: activeLink === '/' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    Home
                </Link>
                <Link
                    key={1}
                    to="/volunteers"
                    onClick={() => setActiveLink('/volunteers')}
                    style={{
                        color: activeLink === '/volunteers' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    Volunteers
                </Link>
                <Link
                    key={2}
                    to="/ngos"
                    onClick={() => setActiveLink('/ngos')}
                    style={{
                        color: activeLink === '/ngos' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    NGOs
                </Link>
                <Link
                    key={3}
                    to="/opportunities"
                    onClick={() => setActiveLink('/opportunities')}
                    style={{
                        color: activeLink === '/opportunities' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    Opportunities
                </Link>
                <Link
                    key={4}
                    to="/about-us"
                    onClick={() => setActiveLink('/about-us')}
                    style={{
                        color: activeLink === '/about-us' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    About us
                </Link>
                <Link
                    key={5}
                    to="/contact-us"
                    onClick={() => setActiveLink('/contact-us')}
                    style={{
                        color: activeLink === '/contact-us' ? '#F6F67D' : '#FFFFFF',
                        fontFamily: 'Montserrat',
                        fontSize: '1.15rem',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        marginRight: '50px',
                    }}
                >
                    Contact Us
                </Link>


            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;