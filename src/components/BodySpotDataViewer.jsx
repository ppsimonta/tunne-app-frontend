import { Slider, Stack, Typography } from "@mui/material";
import BodypartColorPicker from "./BodypartColorPicker";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

function BodySpotDataViewer({data}) {

    const { t } = useTranslation();

    const [circleData, setCircleData] = useState([])
    const [timeStepCount, setTimeStepCount] = useState(0)
    const [sliderValue, setSliderValue] = useState(0)

    const handleSlider = (event, newValue) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
        }
    };

    const valueLabelFormat = (value) => {
      
        if (value == 0) {
            return t('before_the_experience')
        }

        if (value == timeStepCount) {
            return t('after_the_experience')
        }
      
        return t('during_the_experience');
    }

    useEffect(() => {

        if (data) {
            data.map(function(item, index) {

                if (item.timestep > timeStepCount ) {
                    setTimeStepCount(item.timestep);
                }
                })

            const mappedData = data.map(item => ({
                timestep: item.timestep,
                colour: item.hex_color,
                x: item.x_position,
                y: item.y_position,
                size: item.size,
                id: item.body_part
            }));
            
            setCircleData(mappedData)
        }
        
        return () => {

        };
    }, [timeStepCount, data]);

    if (circleData.length > 0)
        return (
            <>
                <div className="body-spot-viewer">
                    <BodypartColorPicker circleData={
                        circleData.map(function(circle, index) {

                        if (circle.timestep == sliderValue ) {
                            return circle;
                        }
                            return {}
                        })}
                        hidePicker
                    />
                    <Stack direction='row' display='flex' justifyContent='center'>
                    <Slider
                        onChange={handleSlider}
                        defaultValue={0}
                        valueLabelDisplay="auto"
                        valueLabelFormat={valueLabelFormat}
                        shiftStep={1}
                        step={1}
                        marks
                        min={0}
                        max={timeStepCount}
                        sx={{maxWidth: '75%'}}
                    />
                    </Stack>
                </div>

                <div className="body-spot-viewer-print" style={{display: 'none'}}>
                    <Stack direction='row' justifyContent='center'>
                        {[...new Set(circleData.map(circle => (circle.timestep)))].map((item, index) => (
                            <div key={index}>
                                <Typography variant="body1">{item + 1}</Typography>
                                <BodypartColorPicker circleData={
                                    circleData.map(function(circle, index) {

                                    if (circle.timestep == item ) {
                                        return circle;
                                    }
                                        return {}
                                    })}
                                    hidePicker
                                />
                        </div>
                        ))}
                </Stack>
                </div>
            </>
        )
    else {
        return (
            <Stack direction='row' justifyContent='center'>
                <Typography sx={{py:20}}>
                    {t('no_data_available')}
                </Typography>
            </Stack>
        )
    }
}

export default BodySpotDataViewer;