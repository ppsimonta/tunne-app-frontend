import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { t, use } from 'i18next';
import socket from '../socket';
import { useContext } from 'react';
import InstanceContext from "../contexts/instances";
import { useParams } from 'react-router-dom';


const SmileyFaces = ({ onSelect, step }) => {

  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [roomName, setRoomName] = useState('');

  const [share, setShare] = useState(true);

  const { id } = useParams()
  const { getInstanceById } = useContext(InstanceContext)

  useEffect(() => {
    const fetchInstanceAndJoinRoom = async () => {
      try {
        const instance = await getInstanceById(Number(id)); 
        const randomId = instance.random_id;
        setRoomName(randomId);

        socket.emit('joinRoom', roomName); 
      } catch (error) {
        console.error('Error fetching instance data:', error);
      }
    };

    fetchInstanceAndJoinRoom();

    return () => {
      if (roomName) {
        socket.emit('leaveRoom', roomName);
      }
    };
  }, [id, getInstanceById, roomName]); 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
    onSelect({ emotion: option });

    if (share) {
      socket.emit('emoji_reaction', roomName, option);
    }
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t('question_emoji_picker')}
      </h1>
      {/*
      <Stack direction='row' justifyContent='center' useFlexGap flexWrap="wrap" spacing={1}>
        <Typography variant='body1' className="text-l">
          {t('question_emoji_description')}
        </Typography>
        <FormGroup>
          <FormControlLabel control={
            <Checkbox
             checked={share} 
             onChange={(e) => setShare(e.target.checked)}
            />
            } label={t('question_emoji_share')} />
        </FormGroup>
      </Stack>
      */}
      <div className="flex flex-wrap justify-center mt-4">
        <Stack direction='row' justifyContent='center' useFlexGap flexWrap="wrap">
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('fear')}>😨</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('anger')}>😠</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('joy')}>😀</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('sadness')}>😢</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('disgust')}>🤢</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('surprise')}>😲</Typography>
          <Typography sx={{cursor: "pointer"}} variant='h1' onClick={() => handleOptionClick('neutral')}>😐</Typography>
        </Stack>
      </div>
    </div>
  );
};



export default SmileyFaces;