import { Box, Button } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useState } from "react";
import SmileyRating from "../SmileyRating";

function RatingQuestion({title, onContinue}) {

    const {t} = useTranslation();
    const [value, setValue] = useState(0)

    const handleContinue = () => {     
        onContinue('ratingData', {title: title, value: value}, true)
    }

    return (
        <>
        <h1 className="text-center font-bold text-xl mb-3">
            {t(title)}
        </h1>
        <Box sx={{px:2}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
            <SmileyRating onRatingChange={(newValue) => setValue(newValue)}/>
            <Button
            fullWidth
            variant="contained"
            sx={{maxWidth: 200, mt:2}}
            onClick={handleContinue}
            disabled={!value}
            >
                {t('continue')}
            </Button>
        </div>
        </Box>
        </>
    )
}

export default RatingQuestion;