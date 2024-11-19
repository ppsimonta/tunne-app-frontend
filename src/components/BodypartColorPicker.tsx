import React, { useEffect } from 'react'
import { useState } from 'react'
import { CirclePicker } from 'react-color';
import './styles.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModalWindow from './ModalWindow.jsx';
import { ChestIcon, HeadIcon, LeftArmIcon, LeftFootIcon, LeftHandIcon, LeftLegIcon, LeftShoulderIcon, RightArmIcon, RightFootIcon, RightHandIcon, RightLegIcon, RightShoulderIcon, StomachIcon } from './Icons';
import UndoIcon from '@mui/icons-material/Undo';;
import { Button, Card, Input, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Circle {
    colour: string;
    x: number;
    y: number;
    size: number;
    id: string;
}

export default function BodypartColorPicker({circleData, hidePicker = false, onSelect, onCircleChange = (data) => {}}) {

    const {t} = useTranslation();
    const [circles, setCircles] = useState<Circle[]>([]);
    const [color, setColor] = useState('#fff');
    const [selectedPart, setSelectedPart] = useState(false);
    const [selectedPartName, setSelectedPartName] = useState('');
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [colorModalOpen, setColorModalOpen] = useState(false);

    useEffect(() => {
        if (circleData) {
            setCircles(circleData)
        }
        return () => {

        };
    }, [circleData]);

    const bodyParts = {
        head: { 
            x: 13 + Math.random() *30,
            y: 15 + Math.random() *50
        }, 
        leftShoulder: {
            x: 6 + Math.random() * 12,
            y: 10 + Math.random() * 15
        }, 
        rightShoulder: {
            x: 22 + Math.random() * 19,
            y: 10 + Math.random() * 15
        }, 
        leftArm: {
            x: 24 + Math.random() * 5,
            y: 15 + Math.random() * 55
        },
        rightArm: {
            x: 15 + Math.random() * -2,
            y: 15 + Math.random() * 60
        },
        chest: {
            x: 18 + Math.random() * 55,
            y: 10 + Math.random() * 25
        },
        stomach: {
            x: 7 + Math.random() * 60,
            y: 10 + Math.random() * 70
        },
        leftLeg: {
            x: 19 + Math.random() * 10,
            y: 30 + Math.random() * 200
        },
        rightLeg: {
            x: 15 + Math.random() * 10,
            y: 30 + Math.random() * 200
        },
        leftHand: {
            x: 10 + Math.random() * 17,
            y: 12 + Math.random() * 19
        },
        rightHand: {
            x: 10 + Math.random() * 17,
            y: 12 + Math.random() * 19
        },
        leftFoot: {
            x: 8 + Math.random() * 15,
            y: 12 + Math.random() * 19
        },
        rightFoot: {
            x: 8 + Math.random() * 14,
            y: 8 + Math.random() * 17
        }

     }

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        console.log('Selected Color: ', newColor.hex, 'Selected Part: ', selectedPartName)

        const newCircles = [
            ...circles, 
            {
                colour: newColor.hex,
                x: mousePosition.x,
                y: mousePosition.y,
                size: 8,
                id: selectedPartName
            }
        ]
        setCircles(newCircles)

        setSelectedPart(false);
        onCircleChange(newCircles);
    }

    const handleUndo = () => {
        const newCircles = [...circles];
        newCircles.pop();
        setCircles(newCircles);
        onCircleChange(newCircles);
    }

    const handleMouseMove = (event) => {
        const boundingRect = event.target.getBoundingClientRect();
        const x = event.clientX - boundingRect.left;
        const y = event.clientY - boundingRect.top;
        setMousePosition({x, y});
        console.log('Mouse Position: ', mousePosition)
    }

   
    const handleClick = (id: string) => {
        setColorModalOpen(true);
        setSelectedPart(true);
        setSelectedPartName(id);
    }
    
    const handleClose = () => {
        setSelectedPart(false);
    }
    
    return (
        <>
            <div onClick={handleMouseMove} className="body">
                <HeadIcon onClick={() => handleClick('head')}>    
                    {circles.map((circle, index) => {
                        if (circle.id === 'head') {
                        return (
                            <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour}/>
                        )
                        }
                    })}
                </HeadIcon>
                <LeftShoulderIcon onClick={() => handleClick('leftShoulder')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'leftShoulder') {
                        return (
                            <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                        )
                        }
                    })}
                </LeftShoulderIcon>
                <RightShoulderIcon onClick={() => handleClick('rightShoulder')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'rightShoulder') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </RightShoulderIcon>
                <LeftArmIcon onClick={() => handleClick('leftArm')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'leftArm') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </LeftArmIcon>
                <RightArmIcon onClick={() => handleClick('rightArm')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'rightArm') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </RightArmIcon>
                <ChestIcon onClick={() => handleClick('chest')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'chest') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </ChestIcon>
                <StomachIcon onClick={() => handleClick('stomach')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'stomach') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </StomachIcon>
                <LeftLegIcon onClick={() => handleClick('leftLeg')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'leftLeg') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </LeftLegIcon>
                <RightLegIcon onClick={() => handleClick('rightLeg')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'rightLeg') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </RightLegIcon>
                <RightHandIcon onClick={() => handleClick('rightHand')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'rightHand') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </RightHandIcon>
                <LeftHandIcon onClick={() => handleClick('leftHand')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'leftHand') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </LeftHandIcon>
                <LeftFootIcon onClick={() => handleClick('leftFoot')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'leftFoot') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    
                    })}
                </LeftFootIcon>
                <RightFootIcon onClick={() => handleClick('rightFoot')}>
                    {circles.map((circle, index) => {
                        if (circle.id === 'rightFoot') {
                            return (
                                <circle key={index} cx={circle.x} cy={circle.y} r={circle.size} fill={circle.colour} />
                            )
                        }
                    })}
                </RightFootIcon>
            </div>

            {!hidePicker &&
                // Color picker is not hidden
                <>
                <Stack direction='row' justifyContent='center'>
                    <Button disabled={circles.length < 1} onClick={handleUndo}>
                        <UndoIcon sx={{mr:1}}/>
                        {t('undo')}
                    </Button>
                </Stack>

                {selectedPart &&
                    // Color picker is active
                    <ModalWindow isOpen={colorModalOpen} onClose={() => setColorModalOpen(false)} customStyle={{minWidth: '100%', pb: 6, mt: -10, boxShadow: 24, top: '100%'}}>
                        <div className='flex justify-center'>
                        <CirclePicker color={color} onChange={handleColorChange} />
                        </div>
                    </ModalWindow>
                }
                </>
            }
        </>
    )
}
