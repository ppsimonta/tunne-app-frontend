import { useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"

function FreeformField({title, onContinue}) {

    const {t} = useTranslation();
    const [inputText, setInputText] = useState('')

    const handleInput = (event) => {
        setInputText(event.target.value)
    }

    const handleContinue = () => {     
        onContinue('freeformData', {title: title, value: inputText}, true)
        setInputText('')
    }

    return (
        <>
        <h1 className="text-center font-bold text-xl mb-3">
            {t(title)}
        </h1>
        <Box sx={{px:2}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
            <TextField
            sx={{mb:2, maxWidth: 500}}
            fullWidth
            multiline
            onChange={handleInput}
            value={inputText}
            >
            </TextField>
            <Button
            fullWidth
            variant="contained"
            sx={{maxWidth: 200}}
            onClick={handleContinue}
            disabled={inputText.trim() == ''}
            >
                {t('continue')}
            </Button>
        </div>
        </Box>
        </>
    )
}

export default FreeformField;