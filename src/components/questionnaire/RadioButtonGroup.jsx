import { useState } from "react"
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from "@mui/material"
import { useTranslation } from "react-i18next"

function RadioButtonGroup({title, options, onContinue}) {

    const {t} = useTranslation();
    const [value, setValue] = useState("");

    const handleContinue = () => {     
        onContinue('radioData', {title: title, value: value}, true)
        setValue(0)
    }

    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
        <>
            <h1 className="text-center font-bold text-xl mb-3">
                {t(title)}
            </h1>
            <Box sx={{px:2}}>
                <Stack direction='column' alignItems='center'>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
                        <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                        >
                    {
                        options.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))
                    }
                </RadioGroup>
            </FormControl>
            <Button
            fullWidth
            variant="contained"
            sx={{maxWidth: 200, mt:2}}
            onClick={handleContinue}
            disabled={!value}
            >
                {t('continue')}
            </Button>
            </Stack>
        </Box>
      </>
    );
}

export default RadioButtonGroup;