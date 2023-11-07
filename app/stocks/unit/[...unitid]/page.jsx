'use client';

import React, { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Switch } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


// components things
import Appbar from '../../setup/appbar';
import Boiler from '../../../boiler';
import { GridSearchIcon } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { useQuery } from '@apollo/client';
import { getMenu } from 'graphql/queries';
import { editmenu } from 'graphql/mutation';
import client from 'graphql/config';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'stock', label: 'Stock', minWidth: 100 },
];

function Store({params}){

    const [storeid] = React.useState(params.unitid[0]);
    const [chef, setChef] = useState("Loading");
    const [type, setType] = React.useState(params.unitid[1]?params.unitid[1]:'menu')
    const [querystr, setQuery] = React.useState('');
    const [items,setItems] = React.useState(null);

    const handleStatus = async (menuid) => {
      try {
        let menuItems = [...items];
        let item = menuItems.findIndex(e => e._id === menuid);
        const {data: { editMenu : { enable } }} = await client.mutate({
          mutation: editmenu,
          variables: {
            chefId: storeid,
            inventoryid: menuid,
            enable: !menuItems[item].enable,
          }
        });
        menuItems[item].enable = enable;
        setItems(menuItems);
      } catch (error) {
        console.error(error);
      }
    }

    const {loading, error, data, refetch } = useQuery(getMenu, {
      variables: { getchefId:storeid },
    })
    useEffect(()=>{
      if(!loading && !error){
        let inventoryitems = [];
        for(let i=0; i < data.inventoryItems.length; i++){
          let e = {...data.inventoryItems[i]};
          e["enable"] = false;
          let item = data.getMenu.find( ele => {
            return ele.inventoryid == e._id;
          });
          if(item){
            e.enable = item.enable;
          }
          inventoryitems.push(e);
        }
        setItems(inventoryitems);
      }
    },[loading])
    if (error) return `Error! ${error}`;

    // })
    
    return (
        <Boiler title={`Hi! ${data?.getchef?.displayname}` ?? "Hello! Chef"}>
            <Appbar type="store" id={storeid} >
            </Appbar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', width: "100%", justifyContent: 'flex-end',  alignItems: 'flex-end', mr: 1, my: 1.5 }}>
                <GridSearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" label="Search" value={querystr} onChange={(e)=>{setQuery(e.target.value)}} variant="standard" />
              </Box>
              {loading?"Loading":<Excel data={items} handleStatus={handleStatus}></Excel>}
            </Container>
        </Boiler>
    )
  }
  
const Excel = ({data, handleStatus})=>{

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return(
      <Paper sx={{ width: '80%', overflow: 'hidden', margin: '1em auto', maxWidth:800 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map( (ele, key) => <Row row={ele} handleStatus={handleStatus} key={key}></Row>)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data && data.length? data.length: 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    )
}

const Row = ({ row, handleStatus })=>{

return (
  <TableRow
    key={row._id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      {row.name}
    </TableCell>
    <TableCell align="right"><Switch checked={row.enable}  onChange={()=>{handleStatus(row._id)}}  inputProps={{ 'aria-label': 'controlled' }} color="warning" /></TableCell>
  </TableRow>
)
}



export default Store;