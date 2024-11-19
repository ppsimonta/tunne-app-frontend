import SmileyFaces from "../components/SmileyFaces"
import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useParams } from "react-router-dom"
import InstanceContext from "../contexts/instances"
import BodypartColorPicker from "../components/BodypartColorPicker"
import { Button, CircularProgress, LinearProgress, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import ModalWindow from "../components/ModalWindow"
import bodypartTutorialAnimation from '../assets/bodypart-tutorial.gif'
import UserContext from "../contexts/user"
import RatingQuestion from "../components/questionnaire/RatingQuestion"
import RadioButtonGroup from "../components/questionnaire/RadioButtonGroup"
import FreeformField from "../components/questionnaire/FreeformField"
import BodyQuestion from "../components/questionnaire/BodyQuestion"

function SurveyPage() {

    const {id} = useParams()
    const { t } = useTranslation()
    const { user, preferences } = useContext(UserContext)
    const { getInstanceById, getProgressById, saveSurveyAnswers, sendAnswers } = useContext(InstanceContext)

    const [progress, setProgress] = useState(null)
    const [activePage, setActivePage] = useState(0)
    const [answerData, setAnswerData] = useState({})
    const [pages, setPages] = useState()
    const [instance, setInstance] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
        }
        
        console.log("Rendering SurveyPage")
        fetchData()

        // Constantly check if the user has reached the end of the survey
        if (pages && pages.length > 0 && activePage >= pages.length) {
            finishSurvey()
        }

    }, [activePage, t, progress]);

    const setupPages = (survey, surveyProgress) => {
        const questionBundle = [];
        // Add all the questions from the step to the survey
        for (const [index, question] of survey.steps[surveyProgress].questions.entries()) {
    
            let questionConstructor = [];
    
            // Optional heading for questions where info can be given
            if (question.heading) {
                questionConstructor.push(
                    <h1 key={`heading-${index}`} className="text-center font-bold text-xl mt-5 mb-3">{question.heading}</h1>
                )
            }
            
            switch(question.type) {
                case 'smiley':
                    questionConstructor.push(
                        <SmileyFaces key={`smiley-${index}`} onSelect={handleEmoji}/>
                    )
                    break;
                case 'bodypart':
                    questionConstructor.push(
                        <Fragment key={`bodypart-${index}`}>
                            <Tutorial label='bodypart'>
                                <img src={bodypartTutorialAnimation} style={{maxHeight: '40vh', objectFit: 'contain'}} loading="lazy"/>
                                <Typography>
                                    {t('tutorial_bodypart')}
                                </Typography>
                            </Tutorial>
    
                            <BodyQuestion key={`bodypart-${index}`} onCircleChange={handleCircles} onContinue={advancePage}/>
                        </Fragment>
                    )
                    break;
                case 'rating':
                    questionConstructor.push(
                        <RatingQuestion key={`rating-${index}`} title={question.title} onContinue={handleGenericAnswer}/>
                    )
                    break;
                case 'radio':
                    questionConstructor.push(
                        <RadioButtonGroup key={`radio-${index}`} title={'question_age'} options={["0-18", "18-24", "25-34", "35-44", "45-54", "55-65", "65+"]} onContinue={handleGenericAnswer}/>
                    )
                    break;
                case 'freeform':
                    questionConstructor.push(
                        <FreeformField key={`freeform-${index}`} title={question.title} onContinue={handleGenericAnswer}/>
                    )
                    break;
                case 'info':
                    questionConstructor.push(
                        <Fragment key={`info-${index}`}>
                            <h1 className="text-center text-l mb-10">
                                {question.title}
                            </h1>
                            <div className="w-full flex justify-center">
                                <Button
                                  sx={{maxWidth: 200}}
                                  onClick={advancePage}
                                  variant="contained"
                                  fullWidth
                                  >
                                    {t('continue')}
                                </Button>
                            </div>
                        </Fragment>
                    )
                    break;
            }
    
            // Push a 'page' to the survey
            questionBundle.push(questionConstructor)
        }
    
        // Render the question bundle with unique keys
        return questionBundle.map((question, index) => (
            <div key={`questionBundle-${index}`}>
                {question}
            </div>
        ));
    }
    

    const advancePage = () => {

        if (activePage === pages.length - 1) {
            console.log("Last page reached")
            setActivePage(-1)
        }

        setActivePage(activePage + 1)
    }

    const finishSurvey = async () => {
        // This updates the survey and also gets the old answers along with the just now entered ones
        const updatedSurvey = saveSurveyAnswers(Number(id), answerData)
        console.log("Survey Answers", updatedSurvey.answers)

        if (progress == instance.questions.steps.length - 1) {
            // If we're on the last step of the questionnaire, send the answers
            await sendAnswers(instance.id, updatedSurvey.answers)
        }

        navigate(`/instance/${id}`)
    }

    const handleEmoji = async (data) => {
        data.step = instance.questions.steps[progress].label
        data.datetime = new Date(Date.now())
        
        if (!answerData.emojiData) {
            setAnswerData({...answerData, emojiData: []})
        }
        setAnswerData(
            {
                ...answerData,
                emojiData: answerData.emojiData? [...answerData.emojiData, data] : [data]
            }
        )

        advancePage()
    }

    const handleCircles = async (data) => {
        const bodySpotData = data.map(item => ({
            timestep: progress,
            hex_color: item.colour,
            x_position: item.x,
            y_position: item.y,
            size: item.size,
            body_part: item.id
        }));

        setAnswerData(
            {
            ...answerData,
            circleData: bodySpotData
            }
        )
    }

    const handleGenericAnswer = async (key, data, advanceOnInvoke) => {
        // Give a key for the question type and store the data
        if (!answerData[key]) {
            setAnswerData({...answerData, [key]: []})
        }
        setAnswerData(
            {
                ...answerData,
                [key]: answerData[key]? [...answerData[key], data] : [data]
            }
        )

        console.log(
            {
                ...answerData,
                [key]: answerData[key]? [...answerData[key], data] : [data]
            }
        )
        
        if (advanceOnInvoke) {
            advancePage()
        }
    }

    
    // Handle any cases where the questionnaire is empty
    return (
        <>
        <LinearProgress
            variant="determinate"
            value={100 * activePage / pages.length}
            sx={{mb:1}}
        >

        </LinearProgress>
        {pages[activePage]}
        </>
    )
}
export default SurveyPage

function Tutorial({children, label}) {

    const {t} = useTranslation()
    const { preferences, doNotShowAgain } = useContext(UserContext)
    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(false)
        doNotShowAgain(label)
    }

    if (!preferences.doNotShowAgain[label]) {
        return (
            <ModalWindow isOpen={open} onClose={handleClose} customStyle={{minWidth: 300}}>
                <Stack direction='column' spacing={2}>
                    {children}
                    <Button variant="contained" onClick={handleClose}>
                        {t('continue')}
                    </Button>
                </Stack>
            </ModalWindow>
        )
    }
}