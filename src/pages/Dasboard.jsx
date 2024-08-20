import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton, InputAdornment, Menu, MenuItem, Modal, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import TypographyMD from "../components/items/Typography";
import endpoint from "../Endpointurl";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar/Topbar";
import url from "../url";
import background from "../Assets/background.PNG";
import balls from "../Assets/balls.png";
import io from 'socket.io-client';
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function Dashboard() {

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [profiledetails, setProfiledetails] = useState('');
    // const [balls, setBalls] = useState([]);
    const [game, setGame] = useState([]);
    const [selectedBall, setSelectedBall] = useState(null);
    const [userdetails, setUserdetails] = useState("");

    const getScheduleGame = (details) => {

        var InsertAPIURL = `${url}game/get_scheduled_games?user_id=${details?.data?.user_id}`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        fetch(InsertAPIURL, {
            method: 'GET',
            headers: headers,
            body: JSON.stringify(),
        })
            .then(response => response.json())
            .then(response => {

                console.log("game", response.data);

                if (response?.data == null || undefined || response?.data?.length == 0) {
                    navigate(`${endpoint}dashboard`);
                } else if (response.data[0].game_status == "waiting") {
                    navigate(`${endpoint}waiting`);
                } else if (response.data[0].game_status == "started") {
                    navigate(`${endpoint}gamestarted`);
                }
                //  else if (response.data[0].user_selcted_ball >= 1&&response.data[0].game_status == "scheduled") {
                //     navigate(`${endpoint}restart`);
                // }   
                else {
                    navigate(`${endpoint}playgame`);
                }
            }
            )
            .catch(error => {
                // setLoading(false);
                toast.error(error, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });


    }

    const getUserDetails = (details) => {

        var InsertAPIURL = `${url}transaction_history/get_wallet_value_by_user_id?user_id=${details.data.user_id}`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        fetch(InsertAPIURL, {
            method: 'GET',
            headers: headers,
            body: JSON.stringify(),
        })
            .then(response => response.json())
            .then(response => {

                console.log("user", response);
                setUserdetails(response);

                // if (response.data[0] == null || undefined) {
                //     navigate(`${endpoint}dashboard`);
                // } else {
                //     navigate(`${endpoint}playgame`);
                // }
            }
            )
            .catch(error => {
                // setLoading(false);
                toast.error(error, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });


    }


    useEffect(() => {

        const details = JSON.parse(localStorage.getItem('profiledetails'));
        if (details) {
            setProfiledetails(details);
        }

        getScheduleGame(details);
        getUserDetails(details);

    }, []);


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
                    toast.error("Game has restarted", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setTimeout(() => {
                        navigate(`${endpoint}restart`);
                    }, 2000)
                    break;
                case "added-participants":
                    console.log("added-participants");
                    break;
                case "deleted":
                    console.log("game-deleted");
                    navigate(`${endpoint}dashboard`);
                    break;
                // case "scheduled":
                //     console.log("game-scheduled");
                //     navigate(`${endpoint}playgame`);
                //     break;
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

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 2000); // 2 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);

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
                        }}
                    >
                        {loader ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                                <Card sx={{ mt: { xs: 0, md: 5 }, p: 0, borderRadius: "10px", boxShadow: "none", border: "1px solid #F5BC01", width: { xs: "90%", md: "50%" } }}>
                                    <CardContent>
                                        <Grid container spacing={0}>
                                            <Grid xs={6} md={6}>
                                                <Stack direction="column">
                                                    <TypographyMD variant='paragraph' label={t("Available Balance")} color="#000000" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="left" />

                                                    <TypographyMD variant='paragraph' label={t("Total Played Games")} color="#000000" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="left" />

                                                    <TypographyMD variant='paragraph' label={t("Won Games")} color="#000000" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="left" />

                                                    <TypographyMD variant='paragraph' label={t("Lost Games")} color="#000000" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="left" />
                                                </Stack>
                                            </Grid>

                                            <Grid xs={6} md={6}>
                                                <Stack direction="column">
                                                    <TypographyMD variant='paragraph' label={`$ ${userdetails?.total_balance}`} color="#F5BC01" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="right" />

                                                    <TypographyMD variant='paragraph' label={userdetails?.total_played_games} color="#F5BC01" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="right" />

                                                    <TypographyMD variant='paragraph' label={userdetails?.total_won_games} color="#F5BC01" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="right" />

                                                    <TypographyMD variant='paragraph' label={userdetails?.total_lose_games} color="#F5BC01" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450} align="right" />

                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <img src={balls} alt="Balls" style={{ width: "50vh", marginBottom: '20px' }} />

                                <Typography
                                    variant='h6'
                                    color="#F5BC01"
                                    fontFamily="Pacifico"
                                    fontSize="30px"
                                    sx={{
                                        width: { xs: "90%", md: '30%' },
                                        textAlign: 'center',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {t("No games yet. 🎱 Get ready for action! Stay tuned. 🌟🔄")}
                                </Typography>
                            </div>
                        )}
                    </Box>
                }
            />

            <ToastContainer />
        </>
    )
}

export default Dashboard;