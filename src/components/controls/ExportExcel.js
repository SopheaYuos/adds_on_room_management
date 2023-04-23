import React, { useState } from 'react';
import * as ExcelJS from 'exceljs';
import { Button } from '@mui/material';

const ExcelGenerator = () => {
    const [headerColor, setHeaderColor] = useState('FFC7E4FE');
    const [numHeaders, setNumHeaders] = useState(11);


    const onChange = (e) => {
        setHeaderColor(e.target.value);
    }
    const generateExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('My 1', {
            pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true }
        });
        // Add header to worksheet
        const header = [
            '#',
            'Start Datexxxxxxxx',
            'end_date',
            'sub_room_id',
            'number_of_people',
            'event_type',
            'status',
            'is_cancel',
            'description',
            'took_key',
            'return_key',
        ].slice(0, numHeaders);
        sheet.addRow(['THIS IS TITLE'])
        sheet.mergeCells('A1:K1')
        //set the start content body
        const startContentRow = 3;
        sheet.getRow(startContentRow);
        sheet.addRow(header);
        sheet.getRow(startContentRow + 1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff' + headerColor.substring(1, headerColor.length) },
            };
            cell.font = {
                name: 'Calibri',
                color: { argb: 'ffffffff' },
                size: 12,
                bold: true,
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            }

        });

        // Add data to worksheet
        const data = [
            [
                '1',
                new Date('2021-10-01'),
                new Date('2021-10-02'),
                123,
                10,
                'Meetingsdafsdfasdfdsfadsfsdfdfasdfadfeadsfadsfadf',
                'Confirmed',
                false,
                'Some description',
                true,
                false,
            ],
            [
                '2',
                new Date('2021-11-01'),
                new Date('2021-11-02'),
                456,
                20,
                'Conference',
                'Pending',
                true,
                'Some other description',
                false,
                true,
            ],
        ];

        data.forEach((row) => {
            sheet.addRow(row);
        });

        // Set column widths
        sheet.columns.forEach((column, index) => {
            if (header[index].length <= 2) {
                column.width = 4;
            }
            else {
                column.width =
                    header[index].length < 10 ? 12 : header[index]?.length + 10;
            }
        });

        sheet.getRow(5);
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                if (rowNumber > startContentRow) {

                    cell.style.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true,
                }
            });


        });

        // Generate buffer from workbook
        workbook.xlsx
            .writeBuffer()
            .then((buffer) => {
                // Save Excel file
                const blob = new Blob(
                    [buffer],
                    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
                ); const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.xlsx';
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div>
                <label>Header Color: </label>
                <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => onChange(e)}
                />
            </div>
            {/* <div>
                <label>Number of Headers: </label>
                <input
                    type="number"
                    value={numHeaders}
                    onChange={(e) => setNumHeaders(parseInt(e.target.value))}
                />
            </div> */}
            <Button variant="outlined" onClick={generateExcel}>Generate Excel</Button>
        </div>
    );
};

export default ExcelGenerator;
