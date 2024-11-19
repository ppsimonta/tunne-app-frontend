import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

function Footer({sticky = false}) {

    const navigateTo = useNavigate();;
    const { t } = useTranslation();

    return (
        <Box sx={sticky? { position: 'fixed', bottom: 0, left: 0, right: 0 } : {}}>
            <BottomNavigation
            showLabels
            onChange={(event, newValue) => {
                switch(newValue) {
                    case 0:
                        navigateTo('/privacy_policy')
                        break;
                }
            }}
            >
            <BottomNavigationAction label={t('privacy_policy')}/>
            </BottomNavigation>
        </Box>
    )
}

export default Footer;