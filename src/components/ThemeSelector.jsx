import { MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import UserContext from "../contexts/user";
import { Trans, useTranslation } from "react-i18next";

function ThemeSelector({}) {

    const { t } = useTranslation();
    const { preferences, changeTheme } = useContext(UserContext)
    const [selectedTheme, setSelected] = useState(preferences.theme)

    const handleChange = (event) => {
        setSelected(event.target.value)
        changeTheme(event.target.value)
    }

    return (
        <Select
          value={selectedTheme}
          onChange={handleChange}
        >
            <MenuItem value={'light'}>
                {t('light')}
            </MenuItem>
            <MenuItem value={'dark'}>
                {t('dark')}
            </MenuItem>
        </Select>
    )
    
}

export default ThemeSelector;