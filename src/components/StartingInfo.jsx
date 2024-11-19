import ModalWindow from "./ModalWindow";
import { useContext, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import UserContext from "../contexts/user";
import Footer from "./Footer";

import content from '../privacy_policy.md'
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function StartingInfo() {

    const extractLastDateFromString = (paragraph) => {
        // Regular expression to match a date in the format "DD.MM.YYYY"
        const regex = /(\d{1,2})\.(\d{1,2})\.(\d{4})/g;
    
        let lastMatch = null;
        let match;
        // Loop through all matches and store the last one
        while ((match = regex.exec(paragraph)) !== null) {
            lastMatch = match;
        }
    
        if (!lastMatch) {
            throw new Error('No date found in the paragraph');
        }
    
        const day = parseInt(lastMatch[1], 10);
        const month = parseInt(lastMatch[2], 10) - 1; // Months are 0-indexed in JavaScript
        const year = parseInt(lastMatch[3], 10);
    
        // Create a new Date object with the extracted components
        const dateObject = new Date(year, month, day);
    
        return dateObject;
    }

    const {t} = useTranslation();
    const [ModalOpen, setModalOpen] = useState(true);
    const { preferences, acceptPrivacyPolicy } = useContext(UserContext)

    const privacyPolicyDate = extractLastDateFromString(content)
    const lastAcceptedDaysAgo = Math.ceil((new Date(privacyPolicyDate) - new Date(preferences.privacyPolicyAccepted)) / (1000 * 3600 * 24))

    const handleClose = () => {
        setModalOpen(false)
        acceptPrivacyPolicy()
    }

    if (privacyPolicyDate >= new Date(preferences.privacyPolicyAccepted)) {
        return(
            <ModalWindow isOpen={ModalOpen} customStyle={{minWidth: 350}}>
                <Stack alignItems='center' spacing={2}>
                    <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                        {t('privacy_policy_description')}
                    </Typography>
                    <Footer/>
                    { preferences.privacyPolicyAccepted != 0 &&
                    <Alert sx={{whiteSpace: 'pre-line'}} severity="info">
                        {t('privacy_policy_changed_days_ago', {count: lastAcceptedDaysAgo, days: t('days', {count: lastAcceptedDaysAgo})})}
                    </Alert>
                    }
                    <Button onClick={handleClose}>
                        {t('privacy_policy_accept')}
                    </Button>
                </Stack>
            </ModalWindow>
        )
    }

    return
}

export default StartingInfo;