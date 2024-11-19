import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import toast, {Toaster} from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { Stack } from '@mui/material';
import ClipboardText from './ClipboardText';
import InstanceContext from '../contexts/instances';

export default function CreateInstance({ onClose }) {
    
    const { t } = useTranslation();
    const { createInstance } = useContext(InstanceContext);
    const [showCode, setShowCode] = useState();

    

    const handleCreate = async () => {

        const nameInput = document.getElementById('name').value;
        if (nameInput.trim() == "") {
            toast('Name cannot be empty')
            return;
        }

        try {
          setShowCode(await createInstance(nameInput))
          toast('Instance created')
        } catch (error) {
          console.log(error)
          toast('Error creating instance')
        }
    }

    const handleContinue = () => {
      onClose()
    }
    
    

    return (
      <>
        
          <Toaster/>
            {
            showCode? 

            // Show all this if the code has been generated and the instance is ready
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 , mb: 2}}>
                {t('instance_create_success')}
              </Typography>
              <Box sx={{mb: 4}}>
                <ClipboardText size='large'>
                  {showCode}
                </ClipboardText>
              </Box>
            <Button fullWidth onClick={handleContinue}>
              {t('continue')}
            </Button>
            </>

            :

            // By default show the creation modal with the input
            <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {t('instance_create')}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 , mb: 2}}>
              {t('instance_create_description')}
            </Typography>
            {/* <input type="text" id="name" name="name" /> */}
            <Stack direction='column' spacing={2} justifyContent='center'>
            <Input id='name' name='name'/>
            <Button onClick={handleCreate}>
              {t('create')}
            </Button>
            </Stack>
            </>
            }
        
      </>
    );
}
