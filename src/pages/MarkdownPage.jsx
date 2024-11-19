import { Box, Paper, Stack, Typography } from "@mui/material"
import ReactMarkdown from 'react-markdown'

function MarkDownPage({markdown}) {

    return (
        <Paper sx={{p:3}}>
                <Stack spacing={2}>
                    <ReactMarkdown
                    components={{
                        h1(props) {
                            const {node, ...rest} = props
                            return <Typography variant="h4" {...rest}/>
                        },
                        h2(props) {
                            const {node, ...rest} = props
                            return <Typography variant="h5" {...rest}/>
                        },
                        h3(props) {
                            const {node, ...rest} = props
                            return <Typography variant="h6" {...rest}/>
                        },
                        p(props) {
                            const {node, ...rest} = props
                            return <Typography variant="body1" style={{overflowWrap: 'break-word'}} {...rest}/>
                        },
                        ul(props) {
                            const {node, ...rest} = props
                            return <Typography variant="ul" style={{overflowWrap: 'break-word'}} {...rest}/>
                        },
                    }}
                    >
                        {markdown}
                    </ReactMarkdown>
                </Stack>
        </Paper>
    )
}

export default MarkDownPage