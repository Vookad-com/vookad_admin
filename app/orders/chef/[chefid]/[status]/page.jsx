"use client"
import * as React from 'react';
import { Box, Button, Container, Snackbar } from "@mui/material"
import Boiler from "app/boiler"
import Appbar from "app/stocks/setup/appbar"
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import EditIcon from '@mui/icons-material/Edit';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Order from "./order"
import { getOrdersbyChef } from 'graphql/queries';
import { gql, useQuery } from '@apollo/client';
import client from 'graphql/config';
import { useSelector } from 'react-redux';
import { fetchInventoryAsObj } from 'components/helpers/getInventoryItems';

export default function ChefOrders({params:{chefid, status}}){

    const [expanded, setExpanded] = React.useState(false);
    const [toggle, setToggle] = React.useState(false);
    const {loading, error, data, refetch } = useQuery(getOrdersbyChef, {
        variables: { chefId:chefid, status },
      })
      
      const handleChange = (panel) => (event, isExpanded) => {
          setExpanded(isExpanded ? panel : false);
        };
    
    React.useEffect(()=>{
        if(!loading && !error){
            fetchInventoryAsObj(data);
        }
    }, [loading, data, error])

    if(loading || error){
        return <Boiler title={"Today's Orders"}>
                <Appbar type="store" id={chefid} >
                </Appbar>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            >
                            <p>{loading.valueOf()}</p>
                            <p>{error && error.message}</p>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Boiler>
    }
    
    return (
        <Boiler title={"Today's Orders"}>
            <Appbar type="store" id={chefid} >
            </Appbar>
            <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    }}
                    onClose={(event, reason)=>{
                    if (reason === 'clickaway') {
                        return;
                    }
                
                    setToggle(false);
                    }}
                    open={toggle}
                    autoHideDuration={3000}
                    message="Retry Again"
                    key={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    }}
                />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        >
                        <Button onClick={()=>refetch()} >Refetch</Button>    
                        {
                             data.orders != null?data.orders.map(
                                order => (<Order order={order} expanded={expanded} params={{status,chefid}} notify={setToggle} refetch={refetch} handler={handleChange}/>)
                            ):<div>No Orders currently</div>
                        }    
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Boiler>
    )
};