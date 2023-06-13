import { Card, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import DonutChart from "./DonutChart";
import ColumnChart from "./ColumnChart";
import BookedRoom from "./BookedRoom";
import RequestApprove from "./RequestApprove";
import Keys from "./keyS";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ImageUploader from "../../components/uploadImage/uploadImage";
function Dashboard() {

    return (
        <div >
            <ImageUploader />
            <Stack justifyContent="flex-end" alignItems="flex-end" sx={{ marginRight: "30px", marginTop: -1.5, paddingBottom: 1, fontWeight: 500 }} direction={"row"}>
                <Stack><CalendarMonthIcon /></Stack>
                <Stack>Monday, 4th September</Stack>
            </Stack>
            <Stack spacing={0.5} padding={0} >
                <Card elevation={2} sx={{ height: "300px" }}>
                    <Stack direction={"row"} spacing={0.5} >
                        <Card sx={{ width: '25%' }} elevation={2}><RequestApprove /> </Card>
                        <Card sx={{ width: '60%' }} elevation={2}><ColumnChart /> </Card>
                        <Card sx={{ width: '15%' }} elevation={2}> <Keys /> </Card>

                    </Stack>
                </Card>
                <Card elevation={2} sx={{ height: "250px" }}>
                    <Stack spacing={1} direction="row" >
                        <Card elevation={2} sx={{ width: '40%' }} ><DonutChart /></Card>
                        <Card elevation={2} sx={{ width: '60%' }}><BookedRoom /></Card>
                    </Stack>
                </Card>



            </Stack>
        </div>

    )
}
export default Dashboard;