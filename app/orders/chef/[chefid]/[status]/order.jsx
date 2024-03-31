import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { Button, Paper } from '@mui/material';
import { useCallback } from 'react';
import client from 'graphql/config';
import { setToPickup } from 'graphql/mutation';

export default function Order({order, expanded, handler, refetch, notify, params: {status} }){
    const items = useSelector(state => state.inventory.items);

    const getCategory = (item, catid)=>{
        if(item != null){
            let category = item.category.find(ele => ele._id===catid);
            if(category)
                return category.name;
        }
        return catid;
    }

    const handlePickup = useCallback(async ()=>{
        let result = await client.mutate({
            mutation:setToPickup,
            variables:{
                orderid: order._id
            }
        });
        if(result){
            refetch();
        } else{
            notify(true);
        }
    });
    
    return (
        // <TableRow
        //     key={"oggy"}
        //     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        // >
        <Accordion key={order._id} expanded={expanded === order._id} onChange={handler(order._id)}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                OrderId : {order._id}
            </Typography>
            {
                status === "pending" && <Typography sx={{ width: '33%', flexShrink: 0 }}>
                <Button onClick={handlePickup} variant="contained">
                    Ready for pickup
                </Button>
            </Typography>
            }
            </AccordionSummary>
            <AccordionDetails>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right"> type</TableCell>
                        <TableCell align="right">quantity</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {order.items.map((row) => {
                        let item = items[`pdt${row.pdtid}`];

                        return (<TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {item?item.name:row._id}
                        </TableCell>
                        <TableCell align="right">{getCategory(item, row.catid)}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        </TableRow>)
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    // </TableRow>
    );
 }