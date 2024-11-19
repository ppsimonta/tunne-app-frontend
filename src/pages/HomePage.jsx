import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import ListView from "../components/ListView"
import { useContext, useEffect, useState } from "react"
import UserContext from "../contexts/user"
import { useTranslation } from "react-i18next";
import InstanceContext from "../contexts/instances";
import { useNavigate } from "react-router";
import ModalWindow from "../components/ModalWindow";
import JoinInstance from "../components/JoinInstance";

function HomePage() {

    const { instances, getInstancesByUser, addInstances } = useContext(InstanceContext)
    const { user } = useContext(UserContext);
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const navigateTo = useNavigate();
    const { t } = useTranslation();
    
    useEffect(() => {

        const fetchData = async () => {
            try {
                await getInstancesByUser()
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
        console.log("Refreshed HomePage")
    }, [user]);

    const handleClick = (id) => {
        navigateTo(`/instance/${id}`)
    }

    return (
    <>
    <Typography variant="h4">
        {t('home')}
    </Typography>
        {instances?
            <>
            {instances.length > 0?
                
                <ListView items={instances} onItemClick={handleClick}/>
            :
                <>
                    <Stack direction='column' alignItems='center'>
                        <Typography variant='h6' textAlign='center'>
                            {t('instances_empty')}
                        </Typography>
                        <Typography color='gray' textAlign='center'>
                            {t('instances_empty_description')}
                        </Typography>
                        <Button variant='contained' sx={{ maxWidth: 250, mt:3 }} onClick={() => setJoinModalOpen(true)}>
                            {t('instance_join')}
                        </Button>
                    </Stack>
                    
                    <ModalWindow isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)}>
                        <JoinInstance onClose={()=> setJoinModalOpen(false)}/>
                    </ModalWindow>
                    </>
            }
            </>
        :
            <Stack direction='row' justifyContent='center'>
                <CircularProgress />
            </Stack>
        }
    </>
    )
}
export default HomePage