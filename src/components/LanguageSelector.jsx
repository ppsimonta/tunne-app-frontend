import { Button, ButtonGroup, MenuItem, Select, Stack } from "@mui/material"
import { useState } from "react";
import { useTranslation } from "react-i18next"

const languages = [
    {
        code: 'fi',
        name: 'Suomi',
        featured: true
    },
    {
        code: 'sv',
        name: 'Svenska',
        featured: true
    },
    {
        code: 'en',
        name: 'English',
        featured: true
    },
    {
        code: 'ja', 
        name: '日本語'
    },
    {
        code: 'eo',
        name: 'Esperanto'
    }
]

function LanguageSelector({small = false}) {

    const { i18n } = useTranslation();

    const handleSelect = (event) => {
        i18n.changeLanguage(event.target.value);
    }

    if (small) {
        return (
            <ButtonGroup
            orientation="horizontal"
            variant="text"
            >
            {
                languages.map((language, index) => {
                    if (language.featured) {
                        return (
                            <Button key={index} sx={{px:2}} onClick={() => i18n.changeLanguage(language.code)}>
                                {language.code}
                            </Button>
                        )
                    }
                }
                )
            }
            </ButtonGroup>
        )
    }

    return (
        <Select
        value={i18n.language}
        onChange={handleSelect}
        >
            {languages.map((language, index) => {
            return (
                <MenuItem key={index} value={language.code}>
                    {language.name}
                </MenuItem>
            )
            })

            }
        </Select>
    )
}

export default LanguageSelector