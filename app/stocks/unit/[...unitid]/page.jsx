'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { load } from '../../../../redux/inventory';
import Fuse from 'fuse.js';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';


// components things
import Appbar from '../../setup/appbar';
import Boiler from '../../../boiler';
import { collection, getDoc, getDocsFromCache, getDocs, doc, onSnapshot, updateDoc, addDoc } from 'firebase/firestore';
import { database } from "../../../../firebase/config"
import { GridSearchIcon } from '@mui/x-data-grid';
import { Container } from '@mui/material';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'stock', label: 'Stock', minWidth: 100 },
  { id: 'price', label: 'Price per 1kg', minWidth: 100 },
];

function Store({params}){

    const [storeid] = React.useState(params.unitid[0]);
    const [store, setStore] = React.useState(null)
    const [type, setType] = React.useState(params.unitid[1]?params.unitid[1]:'vegetables')
    const [querystr, setQuery] = React.useState('');

    const router = useRouter();
    // const [Items, setItems] = React.useState([])
    const inventory = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const disPatcher = (type, arr) => dispatch(load({type, arr}));
    
    React.useEffect(()=>{
      let store;
      const firebaseStuff = async() => {
        const storeRef = doc(database, `store`, storeid)
        store = await getDoc( storeRef)
        setStore(store)
        // let data = await getDocs(collection(database, `inventory/${type}/stack`))
        // setItems(data)
        if(!inventory.vegetables){
          let veggies = onSnapshot(collection(database, `store/${store.id}/vegetables`), snapshot=>{
            let bgArr = [...snapshot.docs.map(async (ele)=>{
                          let name;
                          if(!inventory.vegetables){
                            let item = await getDoc(ele.data().static)
                            name = item.data().name;
                          } else{
                            name = inventory.vegetables[ele.id].name
                          }
                          let stock = ele.data().quantity;
                          let price = ele.data().price;
                          return {name, stock, price,ref: `store/${store.id}/vegetables/${ele.id}`,}
                        }
                        )
          ]
          Promise.all(bgArr).then( val => {
            disPatcher('vegetables', val);
          });
          });
          let fruits = onSnapshot(collection(database, `store/${store.id}/fruits`), snapshot=>{
            let bgArr = [...snapshot.docs.map(async (ele)=>{
                          let name;
                          if(!inventory.fruits){
                            let item = await getDoc(ele.data().static)
                            name = item.data().name;
                          } else{
                            name = inventory.fruits[ele.id].name
                          }
                          let stock = ele.data().quantity;
                          let price = ele.data().price;
                          return {name, stock, price,ref: `store/${store.id}/fruits/${ele.id}`}
                        }
                        )
          ]
          Promise.all(bgArr).then( val => {
            disPatcher('fruits', val);
          });
          });
          let beverages = onSnapshot(collection(database, `store/${store.id}/beverages`), snapshot=>{
            let bgArr = [...snapshot.docs.map(async (ele)=>{
                          let name;
                          if(!inventory.beverages){
                            let item = await getDoc(ele.data().static)
                            name = item.data().name;
                          } else{
                            name = inventory.beverages[ele.id].name
                          }
                          let stock = ele.data().quantity;
                          let price = ele.data().price;
                          return {name, stock, price,ref: `store/${store.id}/beverages/${ele.id}`}
                        }
                        )
          ]
          Promise.all(bgArr).then( val => {
            disPatcher('beverages', val);
          });
          });
        };
      };
      firebaseStuff();
      const searchParams = new URLSearchParams(window.location.search)
    },[])
    // })
    
    return (
        <Boiler title={store?store.data().name:""}>
            <Appbar type="store" id={storeid} >
            </Appbar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', width: "100%", justifyContent: 'flex-end',  alignItems: 'flex-end', mr: 1, my: 1.5 }}>
                <GridSearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" label="Search" value={querystr} onChange={(e)=>{setQuery(e.target.value)}} variant="standard" />
              </Box>
              <Excel srch={querystr} type={type}></Excel>
            </Container>
        </Boiler>        
    )
  }
  
const Excel = (props)=>{

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    let data;
    if(props.srch!=''){
      const fuse = new Fuse(useSelector(state => state.inventory[props.type]), {
          keys: ['name', 'stock']
      })
      data = fuse.search(props.srch).map(i => i.item);
    } else{
      data = useSelector(state => state.inventory[props.type])
    }
    // React.useEffect(()=>{
      
    // }, [])


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
            {data && data.map( (ele, key) => <TableRow hover role="checkbox" tabIndex={-1} ><TableItem data={ele}></TableItem></TableRow>)}
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

const TableItem = (props) =>{

  const theme = useTheme();
  const [unit, setUnit] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const pdt = props.data;
  const [price, setPrice] = React.useState(pdt.price);
  const stockUpdate = async () => {
    let items = pdt.ref.split("/");
    await updateDoc(doc(database, pdt.ref), {
      quantity: Number(pdt.stock)+Number(unit),
      price: Number(price),
    });
    console.log(items[0], items[1]);
    await addDoc(collection(database, items[0], items[1], 'logs'),{
      timeStamp: Date.now(),
      objRef:pdt.ref,
      objName: pdt.name,
      currentPrice: price,
      from: pdt.stock,
      to: Number(pdt.stock)+Number(unit)
    });
    setUnit(0)
    setOpen(false);
    setToggle(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return(
    <>
      <TableCell onClick={()=>setOpen(true)} align={'left'}>
        {pdt.name}
      </TableCell>
      <TableCell align={'left'}>
        {pdt.stock}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Update Stock"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Product: ${pdt.name}`}
            <br />
            {`Estimated Stock: ${Number(pdt.stock)+Number(unit)}`}
            <Box sx={{
                '& .MuiTextField-root': { m: 2 },
              }}>
              <TextField
                required
                id="outlined-required"
                label="Quantity"
                type='number'
                placeholder='45'
                value={unit}
                onChange={(e)=>{setUnit(e.target.value)}}
              />
            </Box>
            <Box sx={{
                '& .MuiTextField-root': { m: 2 },
              }}>
              <TextField
                required
                id="outlined-required"
                label="Price per kg/ltr"
                type='number'
                placeholder='45'
                value={price}
                onChange={(e)=>{setPrice(e.target.value)}}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={stockUpdate}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
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
        message="Item Updated"
        key={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />  
      </TableCell>
      <TableCell align={'left'}>
        {pdt.price}
      </TableCell>
    </>
  );
}



export default Store;