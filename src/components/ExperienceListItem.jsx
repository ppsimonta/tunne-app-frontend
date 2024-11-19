import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Stack } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ExperienceListItem({ children, id, showControls = false, onClick, onEdit }) {

  const handleClick = () => {
    onClick(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  return (
    <Card sx={{ mt: 1 }}>
      <Stack direction='row'>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Typography variant="h6" component="div">
              {children}
            </Typography>
          </CardContent>
        </CardActionArea>

        {showControls &&
        <>
        <Button onClick={handleEdit}>
            <EditIcon/>
        </Button>
        {/*<Button>
            <DeleteIcon/>
        </Button>*/}
        </>
        }
        </Stack>
    </Card>
  );
}

export default ExperienceListItem;
