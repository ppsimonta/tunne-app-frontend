import { Box, Button, CircularProgress, Divider, IconButton, Input, MenuItem, Pagination, Paper, Select, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import UserContext from "../contexts/user";
import OverviewView from "../components/OverviewView";
import ResultView from "../components/ResultView";
import ClipboardText from "../components/ClipboardText";
import DownloadCSV from "../components/DownloadCSV";
import InstanceContext from "../contexts/instances";
import CropSquareIcon from '@mui/icons-material/CropSquare';
import GridViewIcon from '@mui/icons-material/GridView';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TvIcon from '@mui/icons-material/Tv';
import ModalWindow from "../components/ModalWindow";

function AnalyticsPage() {

    const {id} = useParams()
    const {t} = useTranslation()
    const navigateTo = useNavigate()
    const { user } = useContext(UserContext)
    const { getInstanceById, getRoleByInstanceId, getParticipants, getResponsesByInstanceId } = useContext(InstanceContext)
    
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [instanceData, setInstanceData] = useState()
    const [joinedUserIds, setJoinedUserIds] = useState([])
    const [responses, setResponses] = useState([])
    const [viewMode, setViewMode] = useState('overview')
    const [role, setRole] = useState()
    

    useEffect(() => {

        const fetchData = async () => {

            try {
                const instance = await getInstanceById(id)
                
                setRole(await getRoleByInstanceId(id))
                setInstanceData(instance)
                

                try {
                    const participants = await getParticipants(id)
                    const responses = await getResponsesByInstanceId(id)
                    setJoinedUserIds(participants)
                    setResponses(responses)
                } catch (error) {
                    
                }

            } catch (error) {
                console.log(error)
                setInstanceData(null)
            }
            }

        fetchData();
        
        return () => {

        };
    }, [user]);

    if (instanceData === undefined) {
        // Display loading bar when the data is not yet loaded
        return (
                <Stack direction='row' justifyContent='center'>
                    <CircularProgress />
                </Stack>
        )
    }

    if (instanceData === null) {
        // If the instance data is not found, display a warning screen
        return (
                <Stack direction='column' alignItems='center'>
                    <Typography variant='body1' textAlign='center'>
                        {t('no_data_available')}
                    </Typography>
                </Stack>
        )
    }

    if (role !== 'owner') {
        // Show a warning screen for users other than the owner
        return (
            <Stack direction='column' alignItems='center'>
                <Typography variant='body1' textAlign='center'>
                    {t('access_denied')}
                </Typography>
            </Stack>
        )
    }

    // Display the analytics page if all checks pass
    return (
        <Box sx={{}}>
            <Typography variant="h4">
                {t('analytics')}
            </Typography>
            <Paper sx={{padding: 3, mb:2}}>
                <Typography variant="h4"  sx={{ fontStyle: "italic", fontWeight: 500 }}>
                        {instanceData.name}
                </Typography>
                <Stack direction='row' display='flex' justifyContent='space-between' sx={{my:2}}>
                    <Box>
                        <ClipboardText size="small">
                            {instanceData.random_id}
                        </ClipboardText>
                    </Box>
                    <Box>
                        <Typography variant="body1">
                            {`${joinedUserIds.length} ${t(`participants`, {count: joinedUserIds.length})}`}
                        </Typography>
                        <Typography variant="body1">
                            {`${responses.length} ${t(`responses`, {count: responses.length})}`}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={{ xs: 1, sm: 2 }} sx={{mb: 2}} direction='row'>
                    <Select
                    value={viewMode}
                    onChange={(event) => setViewMode(event.target.value)}
                    fullWidth
                    >
                        <MenuItem value='overview'>
                            {t('overview')}
                        </MenuItem>
                        <MenuItem value='answers'>
                            {t('answers')}
                        </MenuItem>
                    </Select>
                    <Button variant='outlined' onClick={() => setInviteModalOpen(true)}>
                        {t('invite_participants')}
                    </Button>
                    <DownloadCSV instanceId={id}/>
                </Stack>

                <Button variant='outlined' onClick={() => navigateTo(`/body/${id}`)}>
                    <TvIcon sx={{mr: 1}}/>
                        {t('projector_mode')}
                </Button>
                <Tooltip title={t('projector_mode_description')}>
                    <HelpOutlineIcon sx={{color: 'gray', ml: 1}}/>
                </Tooltip>
            </Paper>
                                 
                {viewMode == 'overview' &&            
                    <OverviewView/>
                }

                {viewMode == 'answers' &&  
                <IndividualAnswerView
                    instanceId={id}
                    answers={responses}
                />
                }

            <ModalWindow isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
                <InviteAdmin instanceId={id} onClose={()=> setInviteModalOpen(false)}/>
            </ModalWindow>
        </Box>
    )
}

function IndividualAnswerView({instanceId, answers}) {

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [answerView, setAnswerView] = useState('single')

    useEffect(() => {

        const fetchData = async () => {
            // Get the survey answers for the given instance and user
            const responseIds = answers.map(item => (item.id))
            console.log("Response IDs: ", answers)
            console.log("Selected: ", selectedIndex)
            console.log("Selected actual: ", answers[selectedIndex])
            
        }

        fetchData();
        
        return () => {

        };
    }, [selectedIndex]);

    return (
        <>
            <Stack direction='row' justifyContent='center'>
                <IconButton
                onClick={() => setAnswerView('single')}
                >
                    <CropSquareIcon color={answerView == 'single' ? 'primary' : 'gray'}/>
                </IconButton>
                <IconButton
                onClick={() => setAnswerView('all')}
                >
                    <GridViewIcon color={answerView == 'all' ? 'primary' : 'gray'}/>
                </IconButton>
            </Stack>
            {answerView == 'single' &&
                <>
                <Stack direction='row' justifyContent='center' sx={{pb:2}}>
                    <Pagination
                     count={answers.map(item => (item.id)).length}
                     page={selectedIndex + 1}
                     onChange={(event, value) => setSelectedIndex(value - 1)}
                    >
                    </Pagination>
                </Stack>
                <Paper sx={{p: 2}}>
                    <IndividualAnswerWrapper responseId={answers[selectedIndex]}/>
                </Paper>
                </>
            }

            {answerView == 'all' &&
                <>
                {answers.map((item, index) => {
                    return (
                            <Paper key={index} sx={{p: 2, mt: 2}}>
                                <Stack direction='row' justifyContent='center'>
                                    <Typography variant="h4">{`${index + 1}/${answers.map(item => (item.id)).length}`}</Typography>
                                </Stack>
                                <Divider sx={{my: 3}}/>
                                <IndividualAnswerWrapper responseId={item}/>
                            </Paper>
                    )
                })}
                </>
            }
        </>
    )
}

function IndividualAnswerWrapper({responseId}) {

    const { getAnswersByResponseId } = useContext(InstanceContext)
    const [data, setData] = useState()

    useEffect(() => {

        const fetchData = async () => {
            setData()
            try {
                setData(await getAnswersByResponseId(responseId))
            } catch (error) {
                setData(null)
            }
        }

        fetchData();
        
        return () => {

        };
    }, [responseId]);

    // Display loading bar when the data is not yet loaded
    if (data === undefined) {
        return (
            <Stack direction='row' justifyContent='center'>
                <CircularProgress />
            </Stack>
        )
    }

    return (
        <ResultView data={data}/>
    )
    
}

function InviteAdmin({ instanceId, onClose }) {

    const { t } = useTranslation();
    const {user} = useContext(UserContext)
    const { promoteToOwner } = useContext(InstanceContext)
    const [inputText, setInputText] = useState()
    const [description, setDescription] = useState()

    const handleSend = async () => {

        try {
            await promoteToOwner(instanceId, inputText)
            onClose()
        } catch (error) {
            console.log(error)
            setDescription(error.message)
        }
    }

    const handleInput = (event) => {
        const newText = event.target.value
        setInputText(newText)
    }

    return (
        <>
        <Typography variant="h6" component="h2">
            {t('invite_participants')}
          </Typography>
          <Typography sx={{ my: 2}}>
           {t('invite_admin_description')}
          </Typography>
          <Stack direction='column' spacing={2} justifyContent='center'>
            <Input onInput={handleInput}></Input>
            <Button onClick={handleSend}>
                {t('continue')}
            </Button>
          </Stack>

          {description &&
            <Typography color="gray" sx={{ mt: 6 }}>
                {description}
            </Typography>}
        </>
    )
}

export default AnalyticsPage;