import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Inputfield from "../components/items/Inputfield";
import MailOutlineTwoToneIcon from '@mui/icons-material/MailOutlineTwoTone';
import { Avatar, Box, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import TypographyMD from "../components/items/Typography";
import ButtonMD from "../components/items/ButtonMD";
import { useState } from "react";
import mainBG from "../Assets/main_bg.png";
import InputPasswordfield from "../components/items/InputPasswordfield";
import { Google, KeyboardArrowDown, KeyboardArrowUp, Lock, LockTwoTone } from "@mui/icons-material";
import CardMD from "../components/items/CardMD";
import { NavLink, useNavigate } from "react-router-dom";
import url from "../url";
import endpoint from "../Endpointurl";
import { useEffect } from "react";
import ModalWarning from "../components/items/ModalWarning";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import flag_eng from "../Assets/flag_eng.png";
import flag_spanish from "../Assets/flag_spanish.png";

function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [opensuccess, setOpensuccess] = useState(false);

    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
        handleClose(); // Close menu after selection
    };

    const getCurrentFlag = () => {
        if (i18n.language === 'en') {
            return {
                src: flag_eng,
                label: 'English'
            };
        }
        if (i18n.language === 'es') {
            return {
                src: flag_spanish,
                label: 'Spanish'
            };
        }
        return {
            src: flag_eng,
            label: 'English'
        }; // Default to English if language is not recognized
    };

    const currentFlag = getCurrentFlag();

    const validationSchema = yup.object({
        email: yup
            .string()
            .email("Invalid email")
            .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email")
            .required('Required Email'),
        password: yup
            .string('Enter your password')
            .required('Password is required')
        // .min(8, 'Password must be at least 8 characters')
        // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        // .matches(/[0-9]/, 'Password must contain at least one digit')
        // .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    });
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,

        onSubmit: (values, { resetForm }) => {
            console.log(values);

            setLoading(true);
            setTimeout(() => {
                var InsertAPIURL = `${url}user/sign_in`
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };
                var Data = {
                    "email": values.email,
                    "password": values.password,
                    "signup_type": "email"
                };
                fetch(InsertAPIURL, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setLoading(false);
                        console.log(response)
                        if (response.error) {
                            setLoading(false);
                            toast.error(response.message, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        } else {
                            if (response.data.deleted_user === "true") {
                                setOpensuccess(true);
                            } else {
                                localStorage.setItem('profiledetails', JSON.stringify(response));
                                localStorage.setItem('username', JSON.stringify(response?.data.user_name));
                                localStorage.setItem("userpassword", values.password);

                                navigate(`${endpoint}playgame`);
                                setLoading(false);
                                formik.resetForm();
                            }
                        }
                    }
                    )
                    .catch(error => {
                        setLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 1000)

        },
    });

    // google

    const [googleLoading, setGoogleLoading] = useState(false);

    const googleHandler = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log(error)
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user) {
            setGoogleLoading(true);
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            })
                .then((res) => {
                    setGoogleLoading(false);
                    ResponseGoogle(res.data, user.access_token);
                })
                .catch((err) => {
                    setGoogleLoading(false);
                    console.log(err);
                });
        }
    }, [user]);

    const ResponseGoogle = (data, token) => {

        console.log("data", data);
        console.log("token", token);

        setGoogleLoading(true);
        const googleData = {

            email: data.email,
            access_token: token,
            signin_type: "google"

        };
        fetch(`${url}user/sign_in`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(googleData)
        })
            .then((res) => res.json())
            .then((res) => {
                setGoogleLoading(false);
                console.log(res);
                if (res.error) {
                    setLoading(false);
                    toast.error(res.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    if (res.data.deleted_user === "true") {
                        setOpensuccess(true);
                    } else {
                        localStorage.setItem('profiledetails', JSON.stringify(res));
                        localStorage.setItem('username', JSON.stringify(data?.name));
                        // localStorage.setItem("userpassword", values.password);

                        navigate(`${endpoint}playgame`);
                        setLoading(false);
                    }
                }
            })
            .catch((error) => {
                setGoogleLoading(false);
                toast.error(error.message, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });
    };

    return (
        <>
            <Box
                sx={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mainBG})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "100vh",
                }}
            >

                <Grid container spacing={0} pt={1} pr={2}>
                    <Grid xs={12} align="right">
                        <Box sx={{ width: "130px", border: "2px solid white", borderRadius: "10px" }}>
                            <IconButton onClick={handleClick} >
                                <Avatar variant="square" src={currentFlag.src} sx={{ width: 30, height: 20 }} />
                                <Typography sx={{ color: "white", marginLeft: 1 }}>{currentFlag.label}</Typography>
                                {anchorEl ? <KeyboardArrowUp sx={{ color: "white" }} /> : <KeyboardArrowDown sx={{ color: "white" }} />}
                            </IconButton>
                        </Box>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{ width: "160px", mt: 1 }}
                        >
                            <MenuItem
                                selected={i18n.language === 'en'}
                                onClick={() => changeLanguage('en')}
                            >
                                <Avatar variant="square" src={flag_eng} sx={{ width: 30, height: 30 }} />
                                <Typography sx={{ marginLeft: 1 }}>English</Typography>
                            </MenuItem>
                            <MenuItem
                                selected={i18n.language === 'es'}
                                onClick={() => changeLanguage('es')}
                            >
                                <Avatar variant="square" src={flag_spanish} sx={{ width: 30, height: 30 }} />
                                <Typography sx={{ marginLeft: 1 }}>Spanish</Typography>
                            </MenuItem>
                        </Menu>

                    </Grid>
                </Grid>

                <div style={{ display: "flex", alignContent: "center", alignItems: "center", height: "auto" }}>

                    <CardMD
                        content={
                            <>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: 0 }}>
                                    <TypographyMD variant='paragraph' label={t('Sign In to your Account')} color="white" marginLeft={0} fontFamily="Rubik" fontSize={{ xs: "20px", md: "33px" }} fontWeight={450} align="center" />
                                </div>

                                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", paddingBottom: 3 }}>
                                    <TypographyMD variant='paragraph' label={t('Don’t have an account?')} color="white" marginLeft={0} fontFamily="Rubik" fontSize={{ xs: "12px", md: "16px" }} fontWeight={400} align="center" />
                                    <NavLink to={`${endpoint}signup`} style={{ textDecoration: "none" }}>
                                        <TypographyMD variant='paragraph' label={t('Create Account')} color="#FFE064" marginLeft={0} fontFamily="Rubik" fontSize={{ xs: "12px", md: "16px" }} fontWeight={400} align="center" />
                                    </NavLink>
                                </Box>

                                <form onSubmit={formik.handleSubmit} >
                                    <div>
                                        <div style={{ marginBottom: '5px' }}>

                                            <Inputfield
                                                autoFocus={false}
                                                value={formik.values.email}
                                                onChngeterm={(e) => formik.setFieldValue("email", e.target.value)}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                                // icon={<MailOutlineTwoToneIcon sx={{ color: "#B6BEA9" }} />}
                                                type="text"
                                                variant="outlined"
                                                label=""
                                                placeholder={t('Email Address')}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '0px' }}>

                                            <InputPasswordfield
                                                value={formik.values.password}
                                                onChngeterm={(e) => formik.setFieldValue("password", e.target.value)}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                                // icon={<Lock sx={{ color: "#B6BEA9" }} />}
                                                type="password"
                                                variant="outlined"
                                                placeholder={t('Password')}
                                            />
                                        </div>

                                        <div style={{ marginBottom: "3vh" }}>
                                            <Grid container spacing={0}>

                                                <Grid xs={12} align="right">
                                                    <div style={{ width: "fit-content" }}>
                                                        <NavLink to={`${endpoint}emailverification`} style={{ textDecoration: "none" }}>

                                                            <TypographyMD variant='h6' label={t("Forgot password?")} color="#FFE064" fontFamily="Rubik" marginLeft={0} fontSize="15px" fontWeight={450} align="right" />

                                                        </NavLink>
                                                    </div>
                                                </Grid>

                                            </Grid>
                                        </div>

                                        <ButtonMD variant="contained" title={t("Sign In")} width="100%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} />

                                    </div>
                                </form>

                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 2 }}>
                                    <TypographyMD variant='paragraph' label={t("or")} color="white" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={400} align="center" />
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
                                    <ButtonMD
                                        variant="outlined"
                                        title={t("Sign in With Google")} width={{ xs: "100%", md: "80%" }}
                                        color="primary"
                                        startIcon={<Google fontSize="12px" />}
                                        onClickTerm={googleHandler}
                                        disabled={googleLoading}
                                    />
                                </Box>

                            </>
                        } />
                </div>
            </Box>

            <ModalWarning
                open={opensuccess}
                onClose={() => setOpensuccess(false)}
                title={
                    <div>
                        Your account has been deleted. To initiate the data recovery process, please send an email to
                        <a href={`mailto:Cue-Ball@gmail.com`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <span style={{ color: '#F5BC01' }}> Cue-Ball@gmail.com</span>
                        </a>
                        &nbsp; within the next 90 days.
                    </div>
                }
                // subheading={`User ${userdetails.status == "unblock" ? "block" : "unblock"} Successfully`}
                data={
                    <ButtonMD variant="contained" title="OK" width="60%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} onClickTerm={() => setOpensuccess(false)} />
                }
            />

            <ToastContainer />

        </>
    )
}

export default Login;