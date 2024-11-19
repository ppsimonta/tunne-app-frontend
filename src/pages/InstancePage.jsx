import { useNavigate, useParams } from "react-router"
import StepperView from "../components/StepperView"
import InstanceContext from "../contexts/instances";
import { useContext, useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box, Button, Container, Input, Paper, Stack, Typography } from "@mui/material";
import ResultView from "../components/ResultView";
import { useTranslation } from "react-i18next";
import UserContext from "../contexts/user";
import FeedIcon from '@mui/icons-material/Feed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Bubbles from "../components/Bubbles";
import socket from "../socket";

function InstancePage() {

    const { getInstanceById, getProgressById, getAnswersById, joinInstance } = useContext(InstanceContext)
    const { user } = useContext(UserContext)
    const navigateTo = useNavigate();
    const { id } = useParams()
    const { t } = useTranslation();
    const [view, setView] = useState(0)

    const [instance, setInstance] = useState(null)
    const [progress, setProgress] = useState(null)
    const [answers, setAnswers] = useState(null)

    useEffect(() => {
        const fetchData = async () => {

            const thisInstance = await getInstanceById(Number(id))
            setInstance(thisInstance)

            setProgress(await getProgressById(Number(id)))
            setAnswers(await getAnswersById(Number(id)))

            // Automatically join the instance when they visit the page
            try {
                await joinInstance(thisInstance.random_id)
                console.log(`Joined this instance as ${user.id}`)
            } catch (error) {
                console.log('Failed to join. Already joined?')
            }
        }

        fetchData()
        
        return () => {

        };
    }, [user]);

    const handleContinue = () => {
        navigateTo(`/instance/${id}/survey`)
    };

    if (instance == null || progress == null) {
        return
    }

    return (
    <>
        <Box sx={{position: "relative", zIndex: 1}}>
            <Typography variant="h4">
                {instance.name}
            </Typography>

            <Box sx={{p:1}}>
                {view == 0 &&
                    <>
                        <Typography variant="h5">
                            {t('survey')}  
                        </Typography>
                        <StepperView steps={instance.questions? instance.questions.steps : []} progress={progress} onContinue={handleContinue}/>
                    </>
                }

                {view == 1 &&
                    <>
                        <Typography variant="h5">
                            {t('my_answers')}
                        </Typography>
                        
                        {answers && 
                        <Paper sx={{p:3}}>
                            <ResultView data={answers}/>
                        </Paper>
                        }
                    </>
                }
            </Box>
        </Box>
        
        <BubbleConnector room={instance.random_id}/>

        <Box sx={{height:60}}/>

        <Box sx={{ position: 'fixed', zIndex: 1, bottom: 0, left: 0, right: 0 }}>
            <BottomNavigation
            value={view}
            showLabels
            onChange={(event, newValue) => {setView(newValue)}}
            >
            <BottomNavigationAction label={t('feed')} icon={<FeedIcon/>}/>
            <BottomNavigationAction label={t('my_answers')} icon={<PsychologyIcon/>}/>
            </BottomNavigation>
        </Box>
    </>
    )
}
export default InstancePage

function BubbleConnector({ room }) {

    const { preferences } = useContext(UserContext);
    const [emojiCounts, setEmojiCounts] = useState({});
    const [bubbles, setBubbles] = useState([]);

    const debug = preferences.debug;
    const joinedRoom = socket.connected;

    useEffect(() => {
        socket.connect();
        handleJoinRoom(room);
    }, []);

    // Update bubbles
    useEffect(() => {
        socket.connect();

        socket.on('emoji_reaction', (data) => {
            const { emoji, count } = data;
            setEmojiCounts((prevEmojiCounts) => ({
                ...prevEmojiCounts,
                [emoji]: count
            }));
        });

        socket.on('past_reactions', (emojiCounts) => {
            setEmojiCounts(emojiCounts);
        });

        // Lookup table for emoji colors
        const emojiColors = {
            fear: 'rgba(0, 0, 255, 0.7)',
            anger: 'rgba(255, 0, 0, 0.7)',
            joy: 'rgba(255, 255, 0, 0.7)',
            sadness: 'rgba(0, 0, 128, 0.7)',
            disgust: 'rgba(0, 128, 0, 0.7)',
            surprise: 'rgba(128, 0, 128, 0.7)',
            neutral: 'rgba(128, 128, 128, 0.7)'
        };

        // Convert emoji counts to bubbles with their respective colors
        setBubbles(
            Object.keys(emojiCounts).map((emoji) => {
                return {color: emojiColors[emoji], amount: emojiCounts[emoji]}
            })
        )

        return () => {
            socket.off('emoji_reaction');
            socket.off('past_reactions');
        };
    }, [emojiCounts]);

    const handleJoinRoom = (roomName) => {
        socket.emit('createRoom', roomName);
        socket.emit('joinRoom', roomName);
    };

    const handleLeaveRoom = (roomName) => {
        socket.emit('leaveRoom', roomName);
        setEmojiCounts({});
    };

    return (
        <>
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
            <Bubbles colors={bubbles}/>
        </Box>
        { debug &&
            <Paper elevation={2} sx={{mx: 1, p:2, position: "relative", zIndex: 1}}>
                <Typography>
                    {
                        joinedRoom
                            ? `Connected to: ${room}`
                            : 'Not connected to room'
                    }
                </Typography>

                <div>
                    {Object.entries(emojiCounts).map(([emoji, count]) => (
                        <div key={emoji}>
                            {emoji}: {count}
                        </div>
                    ))}
                </div>  
            </Paper>
        }
        </>
    );
};
