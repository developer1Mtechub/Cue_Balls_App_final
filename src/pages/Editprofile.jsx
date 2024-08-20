import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputfieldCom from "../components/items/InputfieldCom";
import { Avatar, Box, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import ButtonMD from "../components/items/ButtonMD";
import { useNavigate } from "react-router-dom";
import url from "../url";
import Sidebar from "../components/sidebar/Sidebar";
import background from "../Assets/background.PNG";
import endpoint from "../Endpointurl";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

function Editprofile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profiledetails, setProfiledetails] = useState("");
    const [username, setUsername] = useState("");
    const { t, i18n } = useTranslation();

    // Simulated email value, you might get this from props, state, or an API call
    const userEmail = "user@example.com";

    useEffect(() => {

        const details = JSON.parse(localStorage.getItem('profiledetails'));
        if (details) {
            setProfiledetails(details);
        }

        const username = JSON.parse(localStorage.getItem('username'));
        if (username) {
            setUsername(username);
        }

    }, []);

    const validationSchema = yup.object({
        username: yup
            .string('Enter your username')
            .required('Username is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: username || ''
        },
        enableReinitialize: true,
        validationSchema: validationSchema,

        onSubmit: (values, { resetForm }) => {
            console.log(values);

            setLoading(true);
            setTimeout(() => {
                var InsertAPIURL = `${url}user/update_user_name`
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };
                var Data = {
                    "user_id": profiledetails?.data?.user_id,
                    "user_name": values.username
                };
                fetch(InsertAPIURL, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        setLoading(false);
                        console.log(response)
                        if (response.error) {
                            setLoading(false);
                            toast.error(response.message, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        } else {

                            // navigate(`${endpoint}playgame`)

                            toast.success(response.message, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            localStorage.setItem('username', JSON.stringify(values.username));
                            window.location.reload();
                            setTimeout(() => {
                                setLoading(false);
                                formik.resetForm();
                            }, 2000)

                        }
                    }
                    )
                    .catch(error => {
                        setLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 2000)

        },
    });

    const [status, setStatus] = useState("");

    useEffect(() => {
        // Initialize the socket connection
        const socket = io(url);

        // Define the message listener
        const messageListener = (msg) => {
            console.log("msg", msg);
            setStatus(msg);

            switch (msg.status) {
                case "created":
                    console.log("game-created"); // show triangle screen
                    navigate(`${endpoint}playgame`);
                    break;
                case "waiting":
                    console.log("game-status-change"); // show waiting screen ss in phone if status is waiting
                    navigate(`${endpoint}waiting`);
                    break;
                case "started":
                    console.log("game-started"); // if status is started then show animation
                    navigate(`${endpoint}gamestarted`);
                    break;
                case "result-anounced":
                    console.log("result-anounced");
                    navigate(`${endpoint}winner`);
                    break;
                case "restart":
                    console.log("game-restart"); // show restart game screen ss in phone
                    navigate(`${endpoint}restart`);
                    break;
                case "added-participants":
                    console.log("added-participants");
                    break;
                case "deleted":
                    console.log("game-deleted");
                    navigate(`${endpoint}dashboard`);
                    break;
                case "scheduled":
                    console.log("game-scheduled");
                    navigate(`${endpoint}playgame`);
                    break;
                default:
                    console.log("Unknown status");
            }

            console.log(":ddggfgf");
        };

        // Set up the socket event listener
        socket.on("received-data", messageListener);

        // Cleanup function to remove the message listener and disconnect socket
        return () => {
            socket.off("received-data", messageListener);
            socket.disconnect();
        };
    }, [status]);

    return (
        <>
            <Sidebar
                componentData={
                    <Box
                        sx={{
                            backgroundImage: `url(${background})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            width: "100%",
                            height: "100vh",
                            overflow: "hidden"
                        }}
                    >
                        <Container>
                            <Typography variant='h6' color="#F5BC01" align="center" fontFamily="Pacifico" fontSize={{ xs: "27px", sm: "37px", md: "57px" }} pt={4} mb={1}  >
                                {t("Edit Profile")}
                            </Typography>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                                <Card sx={{ mt: { xs: 0, md: 5 }, p: 0, backgroundColor: "transparent", borderRadius: "10px", boxShadow: "none", border: "1px solid transparent", width: { xs: "90%", md: "50%" } }}>
                                    <CardContent>

                                        <form onSubmit={formik.handleSubmit} >
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} md={12}>
                                                    <Stack direction="column">
                                                        <div style={{ marginBottom: "10px" }}>
                                                            <Typography variant='h6' color="gray" align="left" fontFamily="Rubik" fontSize="17px" mb={1}>
                                                                {t("Username")}
                                                            </Typography>
                                                            <InputfieldCom
                                                                autoFocus={false}
                                                                value={formik.values.username}
                                                                onChngeterm={(e) => formik.setFieldValue("username", e.target.value)}
                                                                error={formik.touched.username && Boolean(formik.errors.username)}
                                                                helperText={formik.touched.username && formik.errors.username}
                                                                type="text"
                                                                variant="outlined"
                                                                label=""
                                                            />
                                                        </div>

                                                        <div style={{ marginBottom: "10px" }}>
                                                            <Typography variant='h6' color="gray" align="left" fontFamily="Rubik" fontSize="17px" mb={1}>
                                                                {t("Email")}
                                                            </Typography>
                                                            <InputfieldCom
                                                                autoFocus={false}
                                                                value={`${profiledetails?.data?.email}`}
                                                                // onChngeterm={(e) => formik.setFieldValue("email", e.target.value)}
                                                                // error={formik.touched.email && Boolean(formik.errors.email)}
                                                                helperText="You cannot update your email address"
                                                                type="text"
                                                                variant="outlined"
                                                                label=""
                                                                disabled={true}
                                                            />
                                                        </div>

                                                        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "30px" }}>
                                                            <ButtonMD variant="contained" title={t("Edit Profile")} width={{ xs: "90%", md: "50%" }} type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} onClick={formik.handleSubmit} />
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </form>

                                    </CardContent>
                                </Card>
                            </div>
                        </Container>
                    </Box>
                }
            />
            <ToastContainer />
        </>
    );
}

export default Editprofile;
