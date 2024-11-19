import React, { useEffect, useState, useContext } from 'react';
import socket from '../socket';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router';
import InstanceContext from '../contexts/instances';
import Bubbles from './Bubbles';

const FullScreenBubbleView = () => {

    const { id } = useParams();
    const { getInstanceById } = useContext(InstanceContext);

    const [emojiCounts, setEmojiCounts] = useState({});
    const [bubbles, setBubbles] = useState([]);

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
        const fetchInstanceAndJoinRoom = async () => {
            try {
                const instance = await getInstanceById(Number(id));
                socket.emit('createRoom', instance.random_id);
                socket.emit('joinRoom', instance.random_id);

                socket.emit('joinRoom', roomName);
            } catch (error) {
                console.error('Error fetching instance data:', error);
            }
        };

        fetchInstanceAndJoinRoom();
    }, []);

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

    return (
        <>
        <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', zIndex: 1, position: 'relative' }}>Vastaajien tunteet</Typography>
        <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', zIndex: 1, position: 'relative'  }}>Feelings in the responses</Typography>
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
            <Bubbles colors={bubbles} />
        </Box>
        </>
    );
};

export default FullScreenBubbleView;
