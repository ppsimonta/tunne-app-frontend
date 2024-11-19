import { Rating } from "@mui/material"
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useState } from "react";

function SmileyRating({defaultValue = 0, locked = false, onRatingChange}) {

    const [value, setValue] = useState(defaultValue)

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
          color: theme.palette.action.disabled,
        },
    }));

    const iconAdditionalStyle = {
        fontSize: '2rem'
    }
  

    const customIcons = {
        1: {
            icon: <CircleIcon sx={iconAdditionalStyle} color="error" />,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <CircleIcon sx={iconAdditionalStyle} color="error" />,
            label: 'Dissatisfied',
        },
        3: {
            icon: <CircleIcon sx={iconAdditionalStyle} color="warning" />,
            label: 'Neutral',
        },
        4: {
            icon: <CircleIcon sx={iconAdditionalStyle} color="success" />,
            label: 'Satisfied',
        },
        5: {
            icon: <CircleIcon sx={iconAdditionalStyle} color="success" />,
            label: 'Very Satisfied',
        },
    };

    function IconContainer(props) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    IconContainer.propTypes = {
        value: PropTypes.number.isRequired,
    };

    return (
        <StyledRating
        name="highlight-selected-only"
        value={value}
        readOnly={locked}
        IconContainerComponent={IconContainer}
        getLabelText={(value) => customIcons[value].label}
        highlightSelectedOnly
        onChange={(event, newValue) => {
        setValue(newValue);
        onRatingChange(newValue)
        }}
    />
    )
}

export default SmileyRating;