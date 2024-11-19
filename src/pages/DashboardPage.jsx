import { Box, Button, Divider, FormControlLabel, FormGroup, Paper, Stack, Switch, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import UserContext from "../contexts/user"
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { useNavigate } from "react-router";
import ThemeSelector from "../components/ThemeSelector";
import InstanceContext from "../contexts/instances";
import ModalWindow from "../components/ModalWindow";
import ListView from "../components/ListView";
import Footer from "../components/Footer";

function DashboardPage() {

    const { user } = useContext(UserContext);
    const { getOwnedInstances, leaveAllInstances } = useContext(InstanceContext);
    const [data, setData] = useState();
    const navigateTo = useNavigate();
    const {t} = useTranslation();
    
    useEffect(() => {

        const fetchData = async () => {
            setData(await getOwnedInstances());
            console.log(user)
        }

        fetchData();
        
        return () => {

        };
    }, [user]);

    const handleClick = (id) => {
        navigateTo(`/instance/${id}/analytics`)
    }

    const handleEdit = (id) => {
        navigateTo(`/instance/${id}/edit`)
    }

    const profileItems = [
        {
            title: 'my_account',
            category: 'management',
            element:
            <>
                    <Typography color='gray'>{`Email: ${user? user._json.email : ''}`}</Typography>
                    <Typography color='gray'>{`ID: ${user? user.id : ''}`}</Typography>
            </>
        },
        {
            title: 'my_instances',
            category: 'management',
            element:
            <>
                <Paper sx={{p:1, overflowY: "scroll", maxHeight: '15rem'}}>
                    <ListView editMode items={data} onItemClick={handleClick} onItemEdit={handleEdit}/>
                </Paper>
            </>
        }
    ]

    const settingsItems = [
        {
            title: 'language',
            category: 'general',
            element:
            <>
                <LanguageSelector/>
            </>
        },
        {
            title: 'theme',
            category: 'appearance',
            element:
            <>
                <ThemeSelector/>
            </>
        },
        {
            title: 'data',
            category: 'data',
            element:
            <>
                <ResetButtons/>
            </>
        },
        {
            title: 'experimental',
            category: 'development',
            element:
            <>
                <DevButtons/>
            </>
        },
    ]

    const dashBoardItems = [
        {
            category: 'profile',
            items: profileItems
        },
        {
            category: 'settings',
            items: settingsItems
        },
    ]

    return (
    <>
            <Typography variant="h4">
                {t('dashboard')}
            </Typography>
            {
                dashBoardItems.map((item, index) => {
                        if (!user && item.category == 'profile') {
                            return
                        }
                        return (
                            <div key={index}>
                                <Box sx={{p:1}}>
                                    <Typography variant="h5">
                                        {t(item.category)}
                                    </Typography>
                                    <Box sx={{p:1}}>
                                    {dashBoardItems[index].items.map(function(item, index) {
                                                return (
                                                    <Box key={index} sx={{mb:5}}>
                                                        <Typography>
                                                            {t(item.title)}
                                                        </Typography>
                                                        {item.element}
                                                    </Box>
                                                );
                                            }
                                        )
                                        }
                                    </Box>
                                </Box>
                                {index != dashBoardItems.length-1 && <Divider sx={{mb:5}}/>}
                            </div>
                        )
                    }                
                )
            }
        <Footer/>
    </>
    )
}

function ResetButtons() {

    const [infoText, setInfoText] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [confirmAction, setConfirmAction] = useState()
    const { leaveAllInstances } = useContext(InstanceContext)
    const { user } = useContext(UserContext)
    const { t } = useTranslation()

    const leaveInstances = async () => {
        await leaveAllInstances()
    }
    
    const deleteCache = () => {
        localStorage.clear()
        window.location.reload();
    }

    const openConfirmation = async (text, action) => {
        setInfoText(text);
        setConfirmAction(() => async () => {
            await action(); // Execute the action only if confirmed
            setShowModal(false); // Close the modal after action is executed
        });
        setShowModal(true);
    };

    return (
        <>
            <ModalWindow isOpen={showModal} onClose={() => setShowModal(false)}>
                <Stack direction='column'>
                    <Typography sx={{mb:2}}>
                        {infoText.description}
                    </Typography>
                    <Stack direction='row' spacing={2}>
                        <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setShowModal(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={confirmAction}
                        >
                            {infoText.confirmation}
                        </Button>
                    </Stack>
                </Stack>
            </ModalWindow>
            <Stack direction='row' spacing={2}>
                <Button
                variant="outlined"
                color="error"
                onClick={() => openConfirmation(
                    {
                        description: t("instances_leave_all_warning"),
                        confirmation: t("instances_leave_all")
                    }, 
                    leaveInstances
                    )}
                >
                    {t('instances_leave_all')}
                </Button>
                <Button
                variant="outlined"
                color="error"
                onClick={() => openConfirmation(
                    {
                        description: t('delete_cache_warning'),
                        confirmation: t("delete_cache")
                    },
                    deleteCache
                    )}
                >
                    {t('delete_cache')}
                </Button>
            </Stack>
        </>
    )
}

function DevButtons() {

    const { t } = useTranslation()
    const { preferences, changeDebug } = useContext(UserContext)

    return (
        <FormGroup>
        <FormControlLabel control={
         <Switch
            checked={preferences && preferences.debug || false}
            onClick={() => changeDebug(!preferences.debug)}
         />
         }
         label={t('debug_mode')}
        />
        </FormGroup>
    )
}

export default DashboardPage