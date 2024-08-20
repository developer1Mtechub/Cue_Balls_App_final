import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton, InputAdornment, Menu, MenuItem, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import TypographyMD from "../components/items/Typography";
import Topbar from "../components/topbar/Topbar";
import { ArrowBackIos, ArrowForwardIos, Block, Error as MuiError, FilterAlt, Search, Visibility, Close } from "@mui/icons-material"
import background from "../Assets/background.PNG";
import ButtonMD from "../components/items/ButtonMD";
import "./scrollbar.css"
import { ToastContainer, toast } from 'react-toastify';
import ModalAdd from "../components/items/Modal";
import Inputfield from "../components/items/Inputfield";
import { useFormik } from "formik";
import * as yup from 'yup';
import endpoint, { url_FE } from "../Endpointurl";
import url from "../url";
import ModalSuccess from "../components/items/ModalSuccess";
import moment from "moment";
import InputfieldCom from "../components/items/InputfieldCom";
import { useTranslation } from "react-i18next";

function Wallet() {

    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    const [profiledetails, setProfiledetails] = useState('');
    const [balance, setBalance] = useState('');
    const [transactionhistory, setTransactionhistory] = useState([]);

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem('profiledetails'));
        if (details) {
            setProfiledetails(details);
            formikwithdraw.setFieldValue('email', details.data.email);
            getUserWalletBalance(details);
            getUserTransactionHistory(details);
        }
    }, []);

    const getUserWalletBalance = (details) => {

        var InsertAPIURL = `${url}user/get_specific_user_by_id?user_id=${details?.data?.user_id}`
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

                setBalance(response);

            }
            )
            .catch(error => {
                setLoading(false);
                toast.error(error, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });

    }

    const getUserTransactionHistory = (details) => {

        var InsertAPIURL = `${url}transaction_history/get_transactions_by_user_id?user_id=${details?.data?.user_id}`
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

                console.log(response.data);
                setTransactionhistory(response.data);

            }
            )
            .catch(error => {
                setLoading(false);
                toast.error(error, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });

    }

    // deposit
    const [openmodaldeposit, setOpenmodaldeposit] = useState(false);
    const handleopenmodaldeposit = (data) => {
        setOpenmodaldeposit(true);
    };

    // withdraw
    const [openmodalwithdraw, setOpenmodalwithdraw] = useState(false);
    const handleopenmodalwithdraw = (data) => {
        setOpenmodalwithdraw(true);
    };

    // success 
    const [opensuccess, setOpensuccess] = useState(false);
    const handleOpensuccess = () => {
        setOpensuccess(true);
    };

    const validationSchemaWithdraw = yup.object({
        email: yup
            .string()
            .email("Invalid email")
            .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email")
            .required('Email is required'),
        amount: yup
            .string()
            .required('Amount is required')
    });

    const validationSchema = yup.object({
        amount: yup
            .string()
            .required('Amount is required')
    });
    const formik = useFormik({
        initialValues: {
            amount: ''
        },
        validationSchema: validationSchema,

        onSubmit: (values, { resetForm }) => {
            console.log(values);

            setLoading(true);
            setTimeout(() => {

                const paymentData = {
                    user_id: 100653,
                    // game_id: 10242,
                    items: [{
                        "name": profiledetails?.data?.user_name,
                        "sku": "item",
                        "price": values.amount,
                        "currency": "USD",
                        "quantity": 1
                    }],
                    amount: {
                        "currency": "USD",
                        "total": values.amount
                    },
                    description: "This is the payment description.",
                    redirect_urls: {
                        //  
                        "return_url": `${url_FE}${endpoint}success`,
                        "cancel_url": `${url_FE}${endpoint}cancel`
                    }
                };

                fetch(`${url}pay`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log("response");
                        console.log(response);
                        return response.json();
                    })
                    .then(data => {
                        console.log("data");

                        console.log(data);
                        console.log(data.approval_url);

                        setTimeout(() => {
                            window.location.href = data.approval_url;
                            setLoading(false);
                            // handleOpensuccess();

                            localStorage.setItem("deposit_amount", values.amount);

                        }, 3000)


                    })
                    .catch(error => {
                        setLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.TOP_RIGHT
                        });

                        console.log('There has been a problem with your fetch operation:', error);
                    });
            }, 2000)

        },
    });

    // withdraw formik 
    const formikwithdraw = useFormik({
        initialValues: {
            email: '',
            amount: '',
        },
        validationSchema: validationSchemaWithdraw,
        enableReinitialize: true,
        onSubmit: (values, { resetForm, setFieldValue }) => {
            console.log(profiledetails?.data?.user_id, values);

            setLoading(true);
            setTimeout(() => {
                fetch(`${url}transaction_history/create_transaction_history`, {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: values.amount, // assuming 'amount' is the amount to be withdrawn
                        // receiver:"sb-29ki4328820990@business.example.com"
                        user_id: profiledetails?.data?.user_id,
                        email: values.email
                    })
                })
                    .then(response => {
                        console.log("response");
                        console.log(response);
                        return response.json();
                    })
                    .then(data => {
                        // handle response data

                        setLoading(false);
                        console.log(data)
                        if (data.error) {
                            toast.error(data.message, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        } else if (data.message === "Internal server error") {
                            toast.error("Internal server error", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            setOpenmodalwithdraw(false);
                            // resetForm(values.amou);
                        } else {
                            console.log(data.PaypalWithdrawObject.payout_batch_id);
                            let payoutId = data.PaypalWithdrawObject.payout_batch_id;

                            fetch(`${url}payout-check`, {

                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    payoutBatchId: payoutId, // assuming 'amount' is the amount to be withdrawn
                                    // receiver:"sb-29ki4328820990@business.example.com"
                                    // user_id: 100641
                                })
                            })
                                .then(response => {
                                    console.log("response");
                                    console.log(response);
                                    return response.json();
                                })
                                .then(datad => {
                                    console.log("datad")
                                    if (!datad.error) {
                                        setLoading(false);
                                        setOpenmodalwithdraw(false);
                                        // formikwithdraw.resetForm();
                                        setFieldValue('amount', '');
                                        toast.success("Withdraw created successfully", {
                                            position: toast.POSITION.TOP_RIGHT
                                        });
                                        getUserWalletBalance(profiledetails);
                                        getUserTransactionHistory(profiledetails);
                                    }
                                })
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }, 2000)

        },
    });

    // format time
    function formatDate(timestamp) {
        // Parse the timestamp using Moment.js
        const dateObj = moment(timestamp);

        // Format the Date
        const formattedDate = dateObj.format('MMM DD, YYYY');

        // Format the Time
        const formattedTime = dateObj.format('hh:mma');

        // Combine date and time
        const formattedDateTime = `${formattedTime} - ${formattedDate}`;

        return formattedDateTime;
    }

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
                    < Box
                        sx={{
                            backgroundImage: `url(${background})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            width: "100%",
                            height: "100vh",
                            overflow: "hidden",

                        }}
                    >
                        {loader ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <Box pb={50} pl={{ xs: 5, md: 20 }} pr={{ xs: 5, md: 20 }}>
                                {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}> */}
                                <Typography variant='h6' align="center" color="#F5BC01" fontFamily="Pacifico" fontSize={{ xs: "27px", md: "50px" }} mt={1}   >
                                    {t("My Wallet")}
                                </Typography>

                                <Card sx={{ mt: { xs: 2, md: 2 }, p: 0, borderRadius: "10px", boxShadow: "none", border: "1px solid #F5BC01", width: { xs: "100%", md: "100%" } }}>
                                    <CardContent>
                                        <Stack direction="column">

                                            <Typography variant='h6' align="center" color="gray" fontFamily="Rubik" fontSize={{ xs: "20px", md: "20px" }} mt={1}   >
                                                {t("Your Balance")}
                                            </Typography>

                                            <Typography variant='h6' align="center" color="#F5BC01" fontFamily="Rubik" fontSize={{ xs: "27px", md: "47px" }} fontWeight="57px"  >
                                                {balance.wallet == null || undefined ? <>$ 0</> : <> $ {Number(balance.wallet).toFixed(2)}</>}
                                            </Typography>

                                        </Stack>

                                        <Grid container spacing={0}>
                                            <Grid xs={6} md={6} align="center">
                                                <ButtonMD variant="contained" title={t("Withdraw")} width="80%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} onClickTerm={handleopenmodalwithdraw} />
                                            </Grid>

                                            <Grid xs={6} md={6} align="center">
                                                <ButtonMD variant="contained" title={t("Deposit")} width="80%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} onClickTerm={handleopenmodaldeposit} />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* </div> */}

                                <Typography variant='h6' align="left" color="#000000" fontFamily="Rubik" fontSize={{ xs: "20px", md: "28px" }} mt={1}   >
                                    {t("Transaction History")}
                                </Typography>

                                <Box backgroundColor="" display="flex" flexDirection="column" flexGrow={1} height="100%">
                                    <Stack
                                        sx={{
                                            height: '255px', // Set a specific height for the stack
                                            overflowY: 'auto', // Enable vertical scrolling
                                            scrollbarWidth: 'thin', // Firefox
                                            scrollbarColor: 'light gray', // For Firefox
                                            '&::-webkit-scrollbar': {
                                                width: '2px', // Width of the scrollbar
                                                backgroundColor: 'gray', // Make the scrollbar itself transparent
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: 'gray', // Make the scrollbar thumb transparent
                                                borderRadius: '10px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: 'gray', // Make the scrollbar track transparent
                                            },
                                        }}
                                    >
                                        {transactionhistory.map((item) => (
                                            <>
                                                <Box
                                                    sx={{
                                                        mt: { xs: 1, md: 1 },
                                                        p: 0,
                                                        borderRadius: '10px',
                                                        boxShadow: 'none',
                                                        border: '1px solid #F5BC01',
                                                        width: { xs: '100%', md: '100%' },
                                                    }}
                                                >
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                        <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                                            <Typography
                                                                variant="h6"
                                                                align="left"
                                                                color="#F5BC01"
                                                                fontFamily="Rubik"
                                                                fontSize={{ xs: "12px", md: "15px" }}
                                                                fontWeight="bold"
                                                                pl={1}
                                                            >
                                                                {t("Transaction ID:")}
                                                            </Typography>

                                                            <Typography
                                                                variant="h6"
                                                                align="left"
                                                                color="#000000"
                                                                fontFamily="Rubik"
                                                                fontSize={{ xs: "12px", md: "15px" }}
                                                                pl={1}
                                                            >
                                                                #{item.transaction_history_id}
                                                            </Typography>
                                                        </div>

                                                        <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                                                            <Box
                                                                align="right"
                                                                sx={{
                                                                    mt: 0.1,
                                                                    mr: 0.1,
                                                                    pl: 1,
                                                                    pr: 1,
                                                                    width: "fit-content",
                                                                    borderBottomLeftRadius: "10px",
                                                                    borderTopRightRadius: "10px",
                                                                    backgroundColor: `${item.type === "deposit" ? "#00C57F" : "#F5BC01"}`
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body"
                                                                    align="right"
                                                                    color="white"
                                                                    fontFamily="Rubik"
                                                                    fontSize={11}
                                                                    letterSpacing="1px"
                                                                >
                                                                    {item.type}
                                                                </Typography>
                                                            </Box>
                                                        </div>
                                                    </Stack>

                                                    <Grid container spacing={0} p={1} pb={2}>
                                                        <Grid item xs={4} md={6} align="left">
                                                            <Stack direction="column">
                                                                <Typography
                                                                    variant="h6"
                                                                    align="left"
                                                                    color="#000000"
                                                                    fontFamily="Rubik"
                                                                    fontSize={{ xs: "12px", md: "15px" }}
                                                                >
                                                                    $ {item.amount}
                                                                </Typography>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={8} md={6} align="right">
                                                            <Typography
                                                                variant="h6"
                                                                align="right"
                                                                color="gray"
                                                                fontFamily="Rubik"
                                                                fontSize={{ xs: "12px", md: "15px" }}
                                                            >
                                                                {formatDate(item.created_at)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                            </>
                                        ))}
                                    </Stack>
                                </Box>

                            </Box>
                        )}
                    </Box >
                }
            />

            {/* deposit */}
            <ModalAdd
                open={openmodaldeposit}
                onClose={() => setOpenmodaldeposit(false)}
                title={t("Deposit Amount")}
                data={
                    <>

                        <form onSubmit={formik.handleSubmit} >

                            <div>
                                <div style={{ padding: 30 }}>
                                    <InputfieldCom
                                        autoFocus={false}
                                        value={formik.values.amount}
                                        onChngeterm={(e) => formik.setFieldValue("amount", e.target.value)}
                                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                                        helperText={formik.touched.amount && formik.errors.amount}
                                        type="number"
                                        variant="outlined"
                                        label=""
                                        placeholder="Amount"
                                        step="0.01"
                                    />

                                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "5px" }}>
                                        <ButtonMD variant="contained" title={t("Continue")} width="60%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} />
                                    </div>

                                </div>
                            </div>

                        </form>

                    </>
                }
            />

            {/* withdraw */}
            <ModalAdd
                open={openmodalwithdraw}
                onClose={() => setOpenmodalwithdraw(false)}
                title={t("Withdraw Amount")}
                data={
                    <>

                        <form onSubmit={formikwithdraw.handleSubmit} >

                            <div>
                                <div style={{ padding: 30 }}>
                                    <InputfieldCom
                                        autoFocus={false}
                                        value={formikwithdraw.values.email}
                                        onChngeterm={(e) => formikwithdraw.setFieldValue("email", e.target.value)}
                                        error={formikwithdraw.touched.email && Boolean(formikwithdraw.errors.email)}
                                        helperText={formikwithdraw.touched.email && formikwithdraw.errors.email}
                                        icon={<Close />}
                                        type="text"
                                        variant="outlined"
                                        label=""
                                        placeholder="Email"
                                    />

                                    <InputfieldCom
                                        autoFocus={false}
                                        value={formikwithdraw.values.amount}
                                        onChngeterm={(e) => formikwithdraw.setFieldValue("amount", e.target.value)}
                                        error={formikwithdraw.touched.amount && Boolean(formikwithdraw.errors.amount)}
                                        helperText={formikwithdraw.touched.amount && formikwithdraw.errors.amount}
                                        type="number"
                                        variant="outlined"
                                        label=""
                                        placeholder="Amount"
                                        step="0.01"
                                    />

                                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "5px" }}>
                                        <ButtonMD variant="contained" title={t("Continue")} width="60%" type="submit" borderColor="orange" backgroundColor="orange" borderRadius="10px" disabled={loading} />
                                    </div>

                                </div>
                            </div>

                        </form>

                    </>
                }
            />

            <ModalSuccess
                open={opensuccess}
                onClose={() => setOpensuccess(false)}
                title="Success"
            // subheading={`User ${userdetails.status == "unblock" ? "block" : "unblock"} Successfully`}
            />

            <ToastContainer />
        </>
    )
}

export default Wallet;