import { Card, Stack, Typography } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function ClipboardText({children, size = 'small'}) {

    let variant;
    let letterSpacing;

    switch (size) {
        case 'small':
            variant = 'h5'
            letterSpacing = 4
            break;
        case 'medium':
            variant = 'h3'
            letterSpacing = 7
            break;
        case 'large':
            variant = 'h2'
            letterSpacing = 10
            break;
    }

    const [isCopied, setIscopied] = useState(false)

    const unsecuredCopyToClipboard = (text) => { const textArea = document.createElement("textarea"); textArea.value=text; document.body.appendChild(textArea); textArea.focus();textArea.select(); try{document.execCommand('copy')}catch(err){toast(`Could not copy to clipboard.\n\n${err}`)}document.body.removeChild(textArea)};

        /**
         * Copies the text passed as param to the system clipboard
         * Check if using HTTPS and navigator.clipboard is available
         * Then uses standard clipboard API, otherwise uses fallback
        */
    const copyToClipboard = (content) => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(content);
        } else {
            unsecuredCopyToClipboard(content);
        }
    };

    const handleClick = () => {
        copyToClipboard(children)
        setIscopied(true)
        toast('Copied code to clipboard.')
    }

    return (
        <>
        <Card sx={{p:1, display: 'flex', justifyContent: 'center', cursor: 'pointer', backgroundColor: isCopied? 'success.main' : ''}} onClick={handleClick}>
        <Stack direction='row' display='flex' alignItems='center'>
            <Typography id="modal-modal-title" variant={variant} sx={{letterSpacing: letterSpacing, fontWeight: 100, mr: 1}}>
            {children}
            </Typography>
            <ContentCopyIcon/>
        </Stack>
        </Card>
        <Toaster/>
        </>
    )
}

export default ClipboardText;