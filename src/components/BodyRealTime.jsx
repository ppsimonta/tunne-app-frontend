import React, { useContext, useEffect, useState } from 'react';
import BodypartColorPicker from './BodypartColorPicker'; 
import { useParams } from 'react-router';
import { Stack, Typography } from '@mui/material';
import InstanceContext from '../contexts/instances';
import { useTranslation } from 'react-i18next';

export default function BodyRealTime() {

  const { id } = useParams();
  const { t } = useTranslation();
  const { getRandomBodyDataByInstanceId, getInstanceById } = useContext(InstanceContext);
  
  const [timesteps, setTimesteps] = useState([]);
  const [circleData, setCircleData] = useState([]);

  const fetchNewData = async () => {
    try {
      const newBodyPart = await getRandomBodyDataByInstanceId(id);
      console.log(newBodyPart);
      
      setCircleData(prevData => [
        ...prevData, 
        {
          id: newBodyPart.body_part,       
          colour: newBodyPart.hex_color,   
          x: newBodyPart.x_position,       
          y: newBodyPart.y_position,       
          size: newBodyPart.size,   
          timestep: newBodyPart.timestep       
        }
      ]);
    } catch (error) {
      console.error('Error fetching new body data:', error);
    }
  };

  // UseEffect to fetch new data
  useEffect(() => {
    
    const fetchInstance = async () => {
      const instance = await getInstanceById(id);
      setTimesteps(instance.questions.steps.map(step => step.label));
    }
    
    const intervalId = setInterval(fetchNewData, 5000);
    fetchInstance();
    
    return () => clearInterval(intervalId);
  }, []);

  // UseEffect to clear old data
  useEffect(() => {
    // Keep only the last 20 data points
    if (circleData.length > 20) {
      setCircleData(prevData => prevData.slice(1));
    }
  }, [circleData]);

  return (
    <div>
      <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', zIndex: 1, position: 'relative' }}>Vastaajien tunteet</Typography>
      <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', zIndex: 1, position: 'relative'  }}>Feelings in the responses</Typography>
      
      <Stack direction='row' justifyContent='center' alignItems='center'>
        {timesteps.map((item, index) => (
          <div key={index}>
          <Typography variant="body1">{t(item)}</Typography>
          <BodypartColorPicker 
            onCircleChange={setCircleData}
            hidePicker
            circleData={
              circleData.map(function(circle) {
                if (circle.timestep == index ) {
                  return circle;
                }
                return {}
              })}
          />
          </div>
        ))}
    </Stack>  
    </div>
  );
}
