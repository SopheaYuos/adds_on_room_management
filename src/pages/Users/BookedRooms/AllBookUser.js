import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
    DataGrid,
    gridPaginatedVisibleSortedGridRowIdsSelector,
    gridSortedRowIdsSelector,
    GridToolbarContainer,
    gridVisibleSortedRowIdsSelector,
    useGridApiContext,
} from '@mui/x-data-grid';
import { Button } from '@mui/material';
import loginApi from '../../../api/loginApi';

const columns = [
    {
        field: 'first',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        width: 140,
        sortable: false,
    },
    {
        field: 'last',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        width: 140,
    },
    {
        field: 'action',
        headerName: 'Action',
        sortable: false,
        width: 200,
        renderCell: (params) => {
            const onClick = (e) => {
                e.stopPropagation(); // don't select this row after clicking
                const api = params.api;
                const thisRow = {};

                api
                    .getAllColumns()
                    .filter((c) => c.field !== '__check__' && !!c)
                    .forEach(
                        (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
                    );

                return alert(JSON.stringify(thisRow, null, 4));
            };

            return (
                <div>
                    <Button variant="contained" onClick={onClick}>Click</Button>
                    <Button variant="contained" onClick={onClick}>Click</Button>
                </div>

            );
        },
    },
];

const rows = [
    {
        id: 1,
        first: 'Jane',
        last: 'Carter',
    },
    {
        id: 2,
        first: 'Jack',
        last: 'Smith',
    },
    {
        id: 3,
        first: 'Gill',
        last: 'Martin',
    },
];

const getRowsFromCurrentPage = ({ apiRef }) =>
    gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

const getUnfilteredRows = ({ apiRef }) =>
    gridSortedRowIdsSelector(apiRef);

const getFilteredRows = ({ apiRef }) =>
    gridVisibleSortedRowIdsSelector(apiRef);

// const ExportIcon = createSvgIcon(
//     <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
//     'SaveAlt',
// );

const CustomToolbar = () => {
    const apiRef = useGridApiContext();

    const handleExport = (options) =>
        apiRef.current.exportDataAsCsv(options);

    const buttonBaseProps = {
        color: 'secondary',
        size: 'medium',
        startIcon: <DashboardIcon></DashboardIcon>,
    };

    return (
        <GridToolbarContainer>
            <Button
                {...buttonBaseProps}
                onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
            >
                Current page rows
            </Button>
            <Button
                {...buttonBaseProps}
                onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
            >
                Filtered rows
            </Button>
            <Button
                {...buttonBaseProps}
                onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
            >
                Unfiltered rows
            </Button>
        </GridToolbarContainer>
    );
};
export default function StylingHeaderGrid() {
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const x = {
                    user_id: "e20181297",
                    password: "67890"

                };
                console.log('here2')
                const response = await loginApi.login(x);
                setData(response);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);
    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '.MuiDataGrid-columnHeader': {
                    backgroundColor: 'rgba(255, 7, 0, 0.55)',
                },
                '.MuiDataGrid-columnHeaderTitle': {
                    color: 'white'
                },

                '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus,.css-1e2bxag-MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                '.MuiDataGrid-columnSeparator, .MuiDataGrid-iconSeparator': {
                    display: 'none',
                },
                '&.MuiDataGrid-root': {
                    border: 'none',
                },
            }}
        >
            <div>
                {/* <div> */}
                {/* <h2>Doing stuff with data</h2>
                    {data.map(item => (<div>{item.responsibler.name}</div>))}
                </div> */}

            </div>
            <DataGrid disableSelectionOnClick components={{ Toolbar: CustomToolbar }} rows={rows} columns={columns} showCellRightBorder={true} showColumnRightBorder={false} />
        </Box >
    );
}