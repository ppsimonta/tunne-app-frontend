import { Box, Divider, MenuItem, Paper, Select, Slider, Step, StepContent, StepLabel, Typography } from "@mui/material";
import BodypartColorPicker from "./BodypartColorPicker";
import { Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ObjectInspector from "./ObjectInspector";
import { useParams } from "react-router";
import { PieChart } from '@mui/x-charts/PieChart';
import { Trans, useTranslation } from "react-i18next";
import UserContext from "../contexts/user";
import { t } from "i18next";
import BodySpotDataViewer from "./BodySpotDataViewer";
import InstanceContext from "../contexts/instances";

function OverviewView() {

    const {t} = useTranslation()
    const {id} = useParams()
    const [data, setData] = useState()
    const { user } = useContext(UserContext)
    const { getOverviewByInstanceId } = useContext(InstanceContext)

    useEffect(() => {

        const fetchData = async () => {
            const data = await getOverviewByInstanceId(id)
            setData(await getOverviewByInstanceId(id))
            }

        fetchData();
        
        return () => {

        };
    }, []);

    return (
        <Paper sx={{padding: 3}}>

            <Typography variant="h5" sx={{mb: 1}}>
                {t('body_colors')}
            </Typography>
            <BodySpotDataViewer data={data? data.circleData: []} />
            
            <Divider sx={{my: 3}}/>

            <Box sx={{mb: 5}}>
            <Typography variant="h5" sx={{mb: 1}}>
                {t('chart')}
            </Typography>
            <ChartView data={data? data.emojiData: []}/>
            </Box>

            <Divider sx={{my: 3}}/>
            <Typography variant="h5" sx={{mb: 1}}>
                {t('average_age')}
            </Typography>
            {data &&
                <Typography variant="h5">
                    {data.averageAge ? Number.parseFloat(data.averageAge).toFixed(1) : t('no_data_available')}
                </Typography>
            }
            
        </Paper>
    )
}

function ChartView({data}) {

    /*const data = [
        { value: 5, label: 'A' },
        { value: 10, label: 'B' },
        { value: 15, label: 'C' },
        { value: 20, label: 'D' },
      ];
    */
      
      const size = {
        width: 400,
        height: 200,
      };

      const [chartData, setChartData] = useState([])
      const { t } = useTranslation()

      useEffect(() => {

        const setupChart = async () => {

            let emotions = {};
            for (const item of data) {
                if (!emotions[item.emotion]) {
                    emotions[item.emotion] = 1
                } else {
                    emotions[item.emotion]++
                }
            }
            
            const newChartData = Object.keys(emotions).map((item) => {
                    return { value: emotions[item], label: t(item) };
            })
            
            setChartData(newChartData)
            }

        setupChart();
        
        return () => {

        };
    }, [t, data]);

    return (
        <PieChart
            series={[
                {
                data: chartData,
                },
            ]}
            height={200}
        />
    )
}

export default OverviewView;