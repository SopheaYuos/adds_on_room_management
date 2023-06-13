import { useEffect, useState } from "react";
import equipmentRoom from "../../api/equipmentRoom";
import urlEncodeDecode from "../../helper/urlEncodeDecode";
import useTable from "../../components/useTable";
import { Paper, TableBody, TableCell, TableRow } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { Info, MeetingRoom, MeetingRoomRounded } from "@mui/icons-material";
import { groupBy } from "lodash-es";

const headCells = [
    { id: "no", label: "No" },
    { id: "item_name", label: "Item Name" },
    { id: "quantity", label: "Quantity" },
    { id: "sub_room_name", label: "Sub Room Name"}
];
export default function ViewRoomDetail(){
    console.log(urlEncodeDecode.decodeURL('id'));
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({
        fn: (items) => {
            return items;
        },
    });
    const [subRoomGroup, setSubRoomGroup] = useState([1,2]);
    const {id, room_type, room_name, room_image_url} = urlEncodeDecode.decodeURL('id');
    useEffect(() => {
        const fetchequipmentRoom = async()=>{
            const res = await equipmentRoom.getRoomEquipmentById(id);
            setSubRoomGroup(Object.keys(groupBy(res.data.data, 'sub_room_name')));
            // console.log(Object.keys(group),  'group');
            setRecords(res.data.data)
        }
        fetchequipmentRoom();
    }, []);
    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
        useTable(records, headCells,filterFn);
    return (
        <Paper className="roomdetails__container">
            <Paper>
                <div className="roomdeatails__header">
                    
                            
                    <div>
                        <img src={room_image_url || "assets/fall-back-image.png"} height={100} />

                        <div className="roomdetails__content">
                            <h2>{room_name}</h2>
                            <h5>{room_type}</h5>
                        </div>
                    </div>
                    <div className="subroom__content">{subRoomGroup.map((sr) => (
                        <div >{sr}</div>
                    ))
                    }</div>
                </div>
               

            </Paper>
            <div className="table__equipment">
                <Paper >
                    <TblContainer>
                        <TblHead />
                        <TableBody>
                            {recordsAfterPagingAndSorting().map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{item.equipment_name}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{item.quantity_in_room}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{item.sub_room_name || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>





                    </TblContainer>
                    <TblPagination />
                </Paper>
            </div>
        </Paper>
    )
}