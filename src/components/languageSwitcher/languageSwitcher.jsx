import { Avatar, Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import flag_eng from "../../Assets/flag_eng.png";
import flag_spanish from "../../Assets/flag_spanish.png";
import { useTranslation } from "react-i18next";
import { Check, Language } from "@mui/icons-material";
import close from "../../Assets/close.png";

const styleaddsuccess = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FFFFFF',
    outline: "none",
    boxShadow: 0,
    // p: 4,
    borderRadius: 3
};

function LanguageSwitcher({ content }) {
    const { t, i18n } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setIsActive(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsActive(false);
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
        handleCloseModal(); // Close modal after selection
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

    return (
        <>
            <Box sx={{ ml: 2, orderRadius: "10px" }}>
                <Box
                    onClick={handleOpenModal}
                    sx={{
                        cursor: "pointer",
                        width: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "white",
                        backgroundColor: "transparent",
                        fontFamily: "Rubik",
                        opacity: 1,
                        // borderRadius: "10px",
                        // padding: "5px 10px",
                        border: `2px solid ${isActive ? "transparent" : "transparent"}`,
                        color: `${isActive ? "#F5BC01" : "gray"}`, // Change the border color when active
                    }}
                >
                    {/* <Avatar variant="square" src={currentFlag.src} sx={{ width: 30, height: 20 }} />
                    <Typography sx={{ marginLeft: 1 }}>{currentFlag.label}</Typography> */}
                    <Language sx={{}} />
                    <Typography sx={{ marginLeft: 1, pl: 1, fontWeight: "medium", fontSize: "14px" }}>{t("Change Language")}</Typography>
                </Box>
            </Box>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box width={{ xs: 350, md: 400, lg: 400, xl: 400 }} height="auto" sx={styleaddsuccess}>
                    <Grid container spacing={0}  >
                        <Grid xs={12} align="right" pt={2} pr={2}>
                            <img src={close} alt="..." style={{ cursor: "pointer", alignSelf: "center", width: "5vh" }} onClick={handleCloseModal} />
                        </Grid>
                    </Grid>

                    <Box align="center" p={2}>
                        {/* <TypographyMD variant='paragraph' label= {t("Select Language")}   /> */}
                        <Typography align="center" variant='paragraph' color="#000000" marginLeft={0} fontFamily="Rubik" fontSize="16px" fontWeight={450}  >
                            {t("Select Language")}
                        </Typography>
                        <Box mt={2}>
                            <Button
                                fullWidth
                                onClick={() => changeLanguage('en')}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    marginBottom: 1,
                                    // backgroundColor: i18n.language === 'en' ? "rgba(0, 0, 0, 0.1)" : "transparent",
                                    color: "gray",
                                    textTransform: "capitalize"
                                }}
                            >
                                <Grid container spacing={0}>
                                    <Grid xs={6}>
                                        <Stack direction="row">
                                            <Avatar variant="square" src={flag_eng} sx={{ width: 30, height: 30 }} />
                                            <Typography sx={{ marginLeft: 1 }}>English</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid xs={6} align="right">
                                        {i18n.language === 'en' && <Check sx={{ alignSelf: "end", marginLeft: 2 }} />}
                                    </Grid>
                                </Grid>

                            </Button>
                            <Button
                                fullWidth
                                onClick={() => changeLanguage('es')}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    // backgroundColor: i18n.language === 'es' ? "rgba(0, 0, 0, 0.1)" : "transparent",
                                    color: "gray",
                                    textTransform: "capitalize"
                                }}
                            >
                                <Grid container spacing={0}>
                                    <Grid xs={6}>
                                        <Stack direction="row">
                                            <Avatar variant="square" src={flag_spanish} sx={{ width: 30, height: 30 }} />
                                            <Typography sx={{ marginLeft: 1 }}>Spanish</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid xs={6} align="right">
                                        {i18n.language === 'es' && <Check sx={{ alignSelf: "end", marginLeft: 2 }} />}
                                    </Grid>
                                </Grid>
                            </Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </>
    )
}

export default LanguageSwitcher;
