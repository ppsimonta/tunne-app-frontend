import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import UserContext from '../contexts/user';
import Login from './Login';
import ModalWindow from './ModalWindow';
import { t } from 'i18next';

function AvatarComponent() {
    
    const { t } = useTranslation();
    const {user, logOut} = useContext(UserContext);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigateTo = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };
    
      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };

      useEffect(() => {
        return () => {

        };
    }, [user]);

    const settings = [
        <>
          <MenuItem onClick={()=> navigateTo("/dashboard")}>
              {t('dashboard')}
          </MenuItem>
        </>,
        <>
        {user? 
          <MenuItem onClick={() => logOut()}>
              {t('log_out')}
          </MenuItem>
          :
          <MenuItem onClick={() => setLoginModalOpen(true)}>
            {t('log_in')}
          </MenuItem>
        }
        </>
    ];

    return (
        
        <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            {user? 
              <Avatar alt={user._json.name} src={user._json.picture} />
              :
              <Avatar>
                <PersonIcon/>
              </Avatar>
            }
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting, index) => (
            <div key={index} onClick={handleCloseUserMenu}>
              {setting}
            </div>
          ))}
        </Menu>
        {loginModalOpen && 
        <ModalWindow customStyle={{minWidth: 350}} isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
          <Login onClose={() => setLoginModalOpen(false)}/>
        </ModalWindow>
        }
      </Box>
    )


}

export default AvatarComponent