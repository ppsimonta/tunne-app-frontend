import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { Button, Input, Paper, Stack, Typography } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';

const SocketIoTest = () => {
    const [roomName, setRoomName] = useState('');
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [emojiCounts, setEmojiCounts] = useState({});

    const emojiOptions = [
        { emoji: '😨', value: 'fear' },
        { emoji: '😠', value: 'anger' },
        { emoji: '😀', value: 'joy' },
        { emoji: '😢', value: 'sadness' },
        { emoji: '🤢', value: 'disgust' },
        { emoji: '😲', value: 'surprise' },
        { emoji: '😐', value: 'neutral' }
    ];

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

        return () => {
            socket.off('emoji_reaction');
            socket.off('past_reactions');
        };
    }, [emojiCounts]);

    const handleJoinRoom = () => {
        socket.emit('createRoom', roomName);
        socket.emit('joinRoom', roomName);
        setJoinedRoom(true);
    };

    const handleLeaveRoom = () => {
        socket.emit('leaveRoom', roomName);
        setEmojiCounts({});
        setJoinedRoom(false);
        clearInterval(timerRef.current);
    };

    const handleSendMessage = (message) => {
        socket.emit('emoji_reaction', roomName, message);
    };

    return (
        <>
            <Stack direction='column' alignItems='center'>
                <Paper sx={{ width: 400, p: 2 }}>
                    <Stack direction='column' spacing={2}>
                        {joinedRoom ?
                            <Button variant='contained' onClick={handleLeaveRoom}>Leave Room</Button>
                            :
                            <>
                                <Input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="Room Name"
                                />
                                <Button variant='contained' onClick={handleJoinRoom}>Join Room</Button>
                            </>
                        }
                    </Stack>
                </Paper>

                {joinedRoom &&
                    <>
                        <Paper elevation={2} sx={{ width: 400, mt: 2, p: 2 }}>
                            <Stack direction='row' spacing={1} justifyContent='left' sx={{ mb: 2 }}>
                                <AddReactionIcon color='secondary' />
                                <Typography color='secondary'>Live Emotion Sharing</Typography>
                            </Stack>
                            <Stack direction='row' spacing={2} justifyContent='left' useFlexGap flexWrap="wrap" sx={{ height: 100, overflowY: 'scroll' }}>
                                {emojiOptions.map(({ emoji, value }) => (
                                    <Typography key={value} sx={{ cursor: "pointer" }} variant='h4' onClick={() => handleSendMessage(value)}>{emoji}</Typography>
                                ))}
                            </Stack>
                        </Paper>
                    </>
                }
            </Stack>
        </>
    );
};

export default SocketIoTest;
