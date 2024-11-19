import { Box, Divider, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { useParams } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import BodySpotDataViewer from "./BodySpotDataViewer";
import SmileyRating from "./SmileyRating";

function ResultView({data}) {

    // I can't deal with different names for the same thing
    if (data && data.ageData) {
        data.radioData = data.ageData
    }

    console.log("ResultView", data)

    const { t } = useTranslation();
    const TimeString = (datetime) => {
        const date = new Date(datetime)
        return date.toLocaleTimeString('en-GB')
    }

    const steps = {
        before: t('before_the_experience'),
        during: t('after_the_experience'),
        after: t('after_the_experience')
    }

    const emojis = {
        fear: "😨",
        anger: "😠",
        joy: "😀",
        sadness: "😢",
        disgust: "🤢",
        surprise: "😲",
        neutral: "😐"
    }

    if (!data) {
        return null
    }

    return (
            <>
                {data.emojiData &&
                    <>
                    <Typography variant="h5" sx={{mb: 1}}>
                        {t('emotion_timeline')}
                    </Typography>
                    <Stack direction='row' justifyContent='center'>
                        <div>
                            {data && data.emojiData && data.emojiData.map((feeling, index) => (
                            <div key={index}>
                                    {(index == 0 || feeling.step != data.emojiData[index - 1].step) ?
                                        <Typography variant="overline">{t(feeling.step)}</Typography> /* Show if the first index or a different timestep*/
                                    :
                                        <Box sx={{my:-2, ml: 3, width: '0.05rem', height: '3rem'}} bgcolor='text.primary'></Box> /* Otherwise show a vertical line */
                                    }
                                <Box>
                                    <Stack
                                    direction="row"
                                    alignItems="center" 
                                    sx={{mt:2, mb: 2}}>
                                        <Typography sx={{mr: 1}} variant="overline">{TimeString(feeling.datetime)}</Typography>
                                        <Typography variant='h4'>{emojis[feeling.emotion]}</Typography>
                                        <Typography sx={{ml: 1}} variant='button'>{t(feeling.emotion)}</Typography>
                                    </Stack>
                                </Box>
                            </div>
                            ))}
                        </div>
                    </Stack>
                    <Divider sx={{mt: 3, mb: 3}}/>
                    </>
                }

                {data.circleData && data.circleData.length > 0 && 
                    <>
                    <Typography variant="h5" sx={{mb: 1}}>
                        {t('body_colors')}
                    </Typography>
                    <BodySpotDataViewer data={data.circleData}/>
                    <Divider sx={{mt: 3, mb: 3}}/>
                    </>
                }

                {data.freeformData && data.freeformData.length > 0 &&
                    <>
                        <Typography variant="h5" sx={{mb: 1}}>
                            {t('freeform_questions')}
                        </Typography>
                        {data.freeformData.map((item, index) => (
                                <Box key={index} sx={{ml:2, mb:2}}>
                                    <Typography variant="h6">
                                        {t(item.title)}
                                    </Typography>
                                    <Typography sx={{ml:2}} variant="body1">
                                        {item.value}
                                    </Typography>
                                </Box>
                        ))}
                        <Divider sx={{mt: 3, mb: 3}}/>
                    </>
                }

                {data.ratingData && data.ratingData.length > 0 &&
                    <>
                        <Typography variant="h5" sx={{mb: 1}}>
                            {t('rating_questions')}
                        </Typography>
                        {data.ratingData.map((item, index) => (
                                <Box key={index} sx={{ml:2, mb:2}}>
                                    <Typography variant="h6">
                                        {t(item.title)}
                                    </Typography>
                                    <SmileyRating defaultValue={Number(item.value)} locked/>
                                </Box>
                        ))}
                    </>
                }

                {data.radioData && data.radioData.length > 0 &&
                    <>
                        <Typography variant="h5" sx={{mb: 1}}>
                            {t('radio_questions')}
                        </Typography>
                        {data.radioData.map((item, index) => (
                                <Box key={index} sx={{ml:2, mb:2}}>
                                    <Typography variant="h6">
                                        {t('question_age')}
                                    </Typography>
                                    <Typography sx={{ml:2}} variant="body1">
                                        {item.value}
                                    </Typography>
                                </Box>
                        ))}
                    </>
                }
            </>
    );
}

export default ResultView;
