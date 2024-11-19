import { Box, Button, Card, CircularProgress, FormControl, IconButton, Input, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import ObjectInspector from "./ObjectInspector"

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InstanceContext from "../contexts/instances";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import UserContext from "../contexts/user";

function QuestionEditView({data}) {

    const {t} = useTranslation()
    const {id} = useParams()
    const { getRoleByInstanceId, getInstanceById, modifySurvey } = useContext(InstanceContext)
    const { user } = useContext(UserContext)

    const [instance, setInstance] = useState()
    const [role, setRole] = useState({})
    const [steps, setSteps] = useState([])
    
    const [error, setError] = useState()

    const noTitleQuestions = ['smiley', 'bodypart', 'radio']

    useEffect(() => {
        const fetchData = async () => {
            try {        
                const thisInstance = await getInstanceById(Number(id))
                setRole(await getRoleByInstanceId(id))
                setInstance(thisInstance)
                
                setSteps(thisInstance.questions.steps || [])
            } catch (error) {
                setInstance(null)
            }
        }
        
        fetchData()
    }, [user]);

    const handleSave = async () => {
        try {
            const instance = await getInstanceById(Number(id))
            await modifySurvey(instance.id, {questions: { steps: steps}}) 
            setError(null)
        } catch (error) {
            setError(error)
        }
        
    }

    const addStep = (item) => {
        setSteps([
            ...steps,
            {
                label: '',
                questions: []
            }
        ])
    }

    const addQuestion = (index) => {
        setSteps(steps.map((step, i) => {
            if (i == index) {
                return {
                    ...step,
                    questions: [
                        ...step.questions,
                        {
                            type: '',
                            title: '',
                            heading: '',
                        }
                    ]
                }
            }
            return step
        }))
    }

    const deleteQuestion = (index) => {
        setSteps(steps.map((step, i) => {
            if (i == index) {
                return {
                    ...step,
                    questions: [...step.questions].slice(0, -1)
                }
            }
            return step
        }))
    }

    const editStep = (index, kindOfEdit, value) => {
        setSteps(steps.map((step, i) => {
            if (i == index) {
                return {
                    ...step,
                    [kindOfEdit]: value
                }
            }
            return step
        }))
    }

    const editQuestion = (stepIndex, questionIndex, kindOfEdit, value) => {

        setSteps(steps.map((step, i) => {
            if (i == stepIndex) {
                return {
                    ...step,
                    questions: 
                    
                    step.questions.map((question, i) => {

                        if (i == questionIndex) {    
                            return {
                                ...question,
                                [kindOfEdit]: value
                            }
                        }
                        return question
                    })
                }
            }
            return step
        }))
    }

    if (instance === undefined) {
        // Display loading bar when the data is not yet loaded
        return (
                <Stack direction='row' justifyContent='center'>
                    <CircularProgress/>
                </Stack>
        )
    }

    if (instance === null) {
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

    return (
        <>
        <Paper sx={{p:1}}>

            {steps.length > 0 && steps.map((item, stepIndex) =>
                <Card key={stepIndex} sx={{mb:2, p:1}} elevation={2}>
                    <Typography sx={{mb:2}} color='gray'>
                        {`Step ${stepIndex + 1}`}
                    </Typography>
                    <Input
                      fullWidth
                      placeholder={`Step ${stepIndex + 1}`}
                      value={steps[stepIndex].label || ''}
                      onChange={(event) => editStep(stepIndex, 'label', event.target.value)}
                    >
                    </Input>

                    {steps[stepIndex].questions.map((item, questionIndex) => 
                        <Card key={questionIndex} sx={{my:2, p:1}} elevation={3}>
                            <Stack direction='column'>
                                <Typography sx={{mb:2}} color='gray'>
                                    {`Question ${questionIndex + 1}`}
                                </Typography>
                                <FormControl fullWidth>
                                <InputLabel id='type'>Type</InputLabel>
                                <Select
                                    value={steps[stepIndex].questions[questionIndex].type || ''}
                                    onChange={(event) => editQuestion(stepIndex, questionIndex, 'type', event.target.value)}
                                    labelId="type"
                                    id='type'
                                    label="Type"
                                >
                                    <MenuItem value='smiley'>
                                        Emoji
                                    </MenuItem>
                                    <MenuItem value='bodypart'>
                                        Body Spot
                                    </MenuItem>
                                    <MenuItem value='radio'>
                                        Age
                                    </MenuItem>
                                    <MenuItem value='rating'>
                                        Rating
                                    </MenuItem>
                                    <MenuItem value='freeform'>
                                        Freeform
                                    </MenuItem>
                                    <MenuItem value='info'>
                                        Information
                                    </MenuItem>
                                </Select>
                                </FormControl>

                                <TextField
                                  multiline
                                  placeholder="Title (Optional)"
                                  value={steps[stepIndex].questions[questionIndex].heading || ''}
                                  onChange={(event) => editQuestion(stepIndex, questionIndex, 'heading', event.target.value)}
                                >
                                </TextField>

                                { !noTitleQuestions.includes(steps[stepIndex].questions[questionIndex].type) &&
                                <TextField
                                  multiline
                                  placeholder={steps[stepIndex].questions[questionIndex].type == 'info'? 'Text' : 'Question'}
                                  value={steps[stepIndex].questions[questionIndex].title || ''}
                                  onChange={(event) => editQuestion(stepIndex, questionIndex, 'title', event.target.value)}
                                >
                                </TextField>
                                }
                            </Stack>
                        </Card>
                        )
                    }

                    <IconButton onClick={() => addQuestion(stepIndex)}>
                        <AddIcon/>
                    </IconButton>
                    <IconButton disabled={steps[stepIndex].questions.length < 1} onClick={() => deleteQuestion(stepIndex)}>
                        <RemoveIcon/>
                    </IconButton>

                </Card>
            )}

        <Button onClick={() => addStep()}>
            Add step
        </Button>
        <Button disabled={steps.length < 1} onClick={() => setSteps([...steps].slice(0, -1))}>
            Remove step
        </Button>

        </Paper>

        <Stack direction='column' alignItems='center' sx={{mt:2}}>
            <Button
            fullWidth
            color={error === null? 'success' : 'primary'}
            variant="contained"
            onClick={handleSave}
            >
                {error === null? 'Saved' : 'Save'}        
            </Button>
            { error &&
                <Typography sx={{mt:2}} color='error'>{error.message}</Typography>
            }
        </Stack>
        </>
    )
}

export default QuestionEditView