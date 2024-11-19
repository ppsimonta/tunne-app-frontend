import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { t } from 'i18next';

function StepperView({steps, progress = 0, onContinue}) {

  const [activeStep, setActiveStep] = useState(progress);
  const { t } = useTranslation();

  const handleNext = () => {
    onContinue();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (activeStep == 2) {
    
  }

  return (
    <Paper sx={{padding: 3}}>
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">
                    {t('last_step')}
                  </Typography>
                ) : null
              }
            >
              {t(step.label)}
            </StepLabel>
            <StepContent>
              <Typography>{t(step.description)}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? t('finish') : t('continue')}
                  </Button>
                  {/* <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    <Trans>
                      back
                    </Trans>
                  </Button> */}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep >= steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
              {steps.length > 0?
                t('all_steps_done')
                :
                t('no_data_available')
              }
          </Typography>
        </Paper>
      )}
    </Box>
    </Paper>
  );
}

export default StepperView;