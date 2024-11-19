import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CreateInstance from './CreateInstance';
import { useNavigate } from 'react-router';
import ModalWindow from './ModalWindow';
import JoinInstance from './JoinInstance';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import AvatarComponent from './AvatarComponent';
import UserContext from '../contexts/user';
import { Card } from '@mui/material';

const drawerWidth = 240;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 330,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function NavBar(props) {

  const { window } = props;
  const { user } = useContext(UserContext)
  const navigateTo = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { t } = useTranslation()

  const appVersion = import.meta.env.VITE_APP_VERSION
  const devMode = import.meta.env.DEV

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogoClick = () => {
    navigateTo('/')
  };

  const appLogo =
    <Typography
    variant="h6"
    component="div"
    sx={{pr:1, cursor: 'pointer', display: 'block', my: 2}}
    onClick={handleLogoClick}
    translate='no'
    >
      Tunne-app
    </Typography> 

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: 3, textAlign: 'center' }}>
      {appLogo}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => setJoinModalOpen(true)}>
            <ListItemText primary={t('instance_join')}/>
          </ListItemButton>
        </ListItem>
        { user &&
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => setCreateModalOpen(true)}>
              <ListItemText primary={t('instance_create')}/>
            </ListItemButton>
          </ListItem>
        }
      </List>
      <div style={{height:'100%', flexGrow: '100%', justifySelf: 'end'}}>
      </div>
        <div style={{width:'100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <LanguageSelector small/>
        </div>

    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' , height: 70}}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {appLogo}
            { appVersion | devMode &&
              <Card sx={{mr:1, px:0.5, py:0.25, display: 'flex', justifyContent: 'center', backgroundColor: 'error.main'}}>
                <Typography color='white' variant='body2' translate='no'>
                {appVersion? `Ver. ${appVersion}` : 'Development Mode'}
                </Typography>
              </Card>
            }

            {/* Pad the space between the Logo and the buttons */}
          <Box
            sx={{flexGrow: 1, display: {sm: 'block'}}}
          >
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button sx={{ color: '#fff' }} onClick={() => setJoinModalOpen(true)}>
                {t('instance_join')}
              </Button>
              { user &&
                <Button sx={{ color: '#fff'}} onClick={()=> setCreateModalOpen(true)}>
                {t('instance_create')}
              </Button>
              }
          </Box>
          <AvatarComponent/>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
      <ModalWindow isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)}>
        <JoinInstance onClose={()=> setJoinModalOpen(false)}/>
      </ModalWindow>
      <ModalWindow isOpen={createModalOpen} onClose={()=> setCreateModalOpen(false)}>
        <CreateInstance onClose={()=> setCreateModalOpen(false)}/>
      </ModalWindow>
    </Box>
  );
}

export default NavBar;