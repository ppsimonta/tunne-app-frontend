import { Button, Input, Typography } from "@mui/material"
import { useContext, useState } from "react";
import InstanceContext from "../contexts/instances";
import UserContext from "../contexts/user";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";

function JoinInstance({ onClose }) {

    const { t } = useTranslation();
    const {user} = useContext(UserContext)
    const { instances, joinInstance } = useContext(InstanceContext)
    const [inputText, setInputText] = useState()
    const [description, setDescription] = useState()

    const handleJoinClick = async () => {

        try {
            await joinInstance(inputText)
        } catch (error) {
            setDescription(error.message)
        }
    }

    const handleInput = (event) => {
        const newText = event.target.value
        setInputText(newText)
    }

    return (
        <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('instance_join')}
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2}}>
           {t('instance_join_description')}
          </Typography>
          <Stack direction='column' spacing={2} justifyContent='center'>
            <Input onInput={handleInput}></Input>
            <Button onClick={handleJoinClick}>
                {t('join')}
            </Button>
          </Stack>

          {description &&
            <Typography color="gray" sx={{ mt: 6 }}>
                {description}
            </Typography>}
        </>
    )
}

export default JoinInstance