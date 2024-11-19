import { Box, Typography } from "@mui/material";

function renderObject(obj) {
    return Object.entries(obj).map(([key, value]) => {
        if (typeof value === "object") {
            return (
                <Box ml={2} key={key}>
                    <Typography variant="body1" component="p">{key}</Typography>
                    <Box ml={2}>
                        {renderObject(value)}
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box ml={2} key={key}>
                    <Typography variant="body2" component="p">{`${key}: ${value}`}</Typography>
                </Box>
            );
        }
    });
}

function ObjectInspector({object = {info: "Empty object"}}) {

return (renderObject(object))
}

export default ObjectInspector;