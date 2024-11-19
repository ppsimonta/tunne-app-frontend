import { useTranslation } from "react-i18next";
import BodypartColorPicker from "../BodypartColorPicker";
import { Button, Card, Input, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function BodyQuestion({onCircleChange, onContinue}) {

    const {t} = useTranslation();
    const [circles, setCircles] = useState([])
    const [inputs, setInputs] = useState([])

    const handleCircles = (circles) => {
        setCircles(circles)
        onCircleChange(circles)
    }

    const handleContinue = () => {
        onContinue()
    }

    useEffect(() => {
        // Create an input for each unique color in the circles array
        const newInputs = [...new Set(circles.map((c) => c.colour))]
                        .map((item, index) => {
                            return {
                                colour: item, 
                                description: inputs[index]? inputs[index].description : '' // Keep the previous description if it exists when deleting a circle
                            }
                        })
    
        setInputs(newInputs)
        console.log(newInputs)
    }
    , [circles])

    return (
        <>
            <h1 className="text-center font-bold text-xl mb-3">
                {t('question_bodypart_color')}
            </h1>
            <BodypartColorPicker onCircleChange={handleCircles}/>

            {/*

            Have the user describe each color they selected
            only appearing once per color

            Feature only cosmetic, no backend functionality

            {circles.length > 0 &&
                    // Display circle explanation inputs
                    <Paper sx={{p:2}}>
                    <div className='flex justify-center'>
                        <Typography>
                            {t('question_description_bodypart')}
                        </Typography>
                    </div>

                    {[...new Set(circles.map((c) => c.colour))].map((item, index) => {
                        return (
                            <Card key={index} className='flex justify-between p-2' sx={{pt: 2}}>
                                <div className="w-5 h-5 p-2 mt-2 rounded-full shadow-md mr-3" style={{backgroundColor: item}}></div>
                                <Input
                                 fullWidth
                                 value={inputs[index]? inputs[index].description : ''}
                                 onChange={(e) => {
                                        const newInputs = [...inputs]
                                        newInputs[index].description = e.target.value
                                        setInputs(newInputs)
                                    }}
                                >
                                </Input>
                            </Card>
                        )
                    })}
                    
                <div className="w-full flex justify-center">
                    <Button
                    sx={{width: '96%', mt: 1.5,}}
                    onClick={handleContinue}
                    variant="contained"
                    disabled={inputs.some((i) => i.description.trim() == '')}
                    >
                        {t('continue')}
                    </Button>
                </div>

                    </Paper>
                }

            */}

                <div className="w-full flex justify-center">
                    <Button
                    sx={{width: '96%', mt: 1.5,}}
                    onClick={handleContinue}
                    variant="contained"
                    disabled={circles.length == 0}
                    >
                        {t('continue')}
                    </Button>
                </div>
        </>
    )
}

export default BodyQuestion;