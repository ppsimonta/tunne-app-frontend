import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Button, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function DownloadCSV({instanceId}) {

    const {t} = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    
      // Setup axios base URL
      axios.defaults.baseURL = import.meta.env.VITE_API_URL
      axios.defaults.withCredentials = true
    
      
    const handleDownload = async () => {
        setIsLoading(true);
      
        try {
          const response = await axios.post('/instances/downloadCSV', { instance_id: instanceId });
          const csvData = response.data; 

          const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `Instance${instanceId}Data.csv`);
        } catch (error) {
          console.error('Error downloading CSV', error);

        } finally {
          setIsLoading(false);
        }
      };

  return (
    <Button variant='outlined' onClick={handleDownload}>
      {isLoading?
          <CircularProgress />
          :
          <>
          {t('download_csv')}
          <FileDownloadIcon/>
          </>
      }
  </Button>
  );
};

export default DownloadCSV;
