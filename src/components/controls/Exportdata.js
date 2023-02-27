import React from 'react';
import Button from '@mui/material/Button';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { Tooltip } from '@mui/material';

const Exportdata =([ excelData, filename]) => {
    
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws}, SheetNames: ['data']};
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    }
    return (
        <>
        <Tooltip title="Excel Export">
        <Button variant='contained'
                onClick={(e) => Exportdata(filename)} color="primary"
                style={{ cursor: "pointer", fontSize: 14}}
                >Excel Export
                </Button>
        </Tooltip>
        
        </>
    )
}
export default Exportdata;

