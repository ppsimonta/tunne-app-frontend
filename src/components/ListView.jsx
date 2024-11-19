import { useEffect, useState } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import ExperienceListItem from './ExperienceListItem';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const dummy = {
        data:[
            {
                id: 0,
                name: "Alpha",
            },
            {
                id: 1,
                name: "Bravo",
            },
            {
                id: 2,
                name: "Charlie",
            },
        ]
    }


function ListView({items, editMode = false, onItemClick, onItemEdit}) {

    const { t } = useTranslation()
    const [data, setData] = useState(items)

    useEffect(() => {
        setData(items)
        return () => {

        };
    }, [items, data]);

    const handleClick = (id) => {
        onItemClick(id)
    }

    const handleEdit = (id) => {
        onItemEdit(id)
    }

    if (data) {
        return (
            <>
                {data.length > 0?
                    (
                        data.map((item, index) => {
                            return (
                            <ExperienceListItem
                              showControls={editMode}
                              key={index}
                              id={item.id}
                              onClick={handleClick}
                              onEdit={handleEdit}
                            >
                                {item.name}
                            </ExperienceListItem>
                            )
                        })
                    )
                :
                    <>
                    <Stack direction='column' alignItems='center'>
                        <Typography variant='body1' textAlign='center'>
                            {t('no_data_available')}
                        </Typography>
                    </Stack>
                    </>
                }
            </>
        );
    }

    return (
        <Stack direction='row' justifyContent='center'>
                <CircularProgress />
        </Stack>
    )
    
}

export default ListView;