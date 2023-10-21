"use client"

// Next Things
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Fuse from 'fuse.js';

// Mui Things
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LaunchIcon from '@mui/icons-material/Launch';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// App Components
import Boiler from '../../../boiler';
import Appbar from '../appbar';

// firebase things
import { database } from '../../../../firebase/config';
import { collection, addDoc, getDocs, setDoc, doc, query, where } from "firebase/firestore"; 
import MapInput from './mapInput';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.hover,
    color: theme.palette.common.black,
    fontSize: 24,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


function Stores({params}) {
  const [open, setOpen] = React.useState(false);

  // store creating stuff
  const [pickup, setPickup] = React.useState();
  const [unit, setUnit] = React.useState('');

  // displaying stuff
  const [stores, setStores] = React.useState([]);
  const [dispStores, setDispStores] = React.useState([]);
  const [querystr, setQuery] = React.useState('');
  const theme = useTheme();
  const router = useRouter();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createObj = async ()=>{
    const docRef = await addDoc(collection(database, `store`),{name:unit, type:params.unit, lng: pickup[0], lat: pickup[1],});
    addDoc(collection(database,`store/${docRef.id}/logs`), {'type':'genesis'});
    const inventory = await getDocs(collection(database, `inventory`));
    inventory.forEach(async type =>{
      let items = await getDocs(collection(database, `inventory`, type.id, `stack`));
      items.forEach(async pdt => {
        await setDoc(doc(collection(database,`store/${docRef.id}/${type.id}`),`${pdt.id}`), {quantity: 0, static: doc(database, `inventory/${type.id}/stack/${pdt.id}`)});
      })
    })
    setOpen(false);
    // await typesense.collections('inventory').documents().create({
    //   id: docRef.id,
    //   name: 'not edited',
    //   descrip: 'not edited',
    //   type: props.type,
    //   cover: 'not edited',
    // });
    router.push(`/stocks/unit/${docRef.id}/`);
  }

  function searchit(e){
    setQuery(e.target.value)
    if(e.target.value!=''){
      const fuse = new Fuse(stores, {
          keys: ['name']
      })
      setDispStores(fuse.search(e.target.value).map(i => i.item));
    } else{
      setDispStores(stores);
    }
  }

  React.useEffect(()=>{
    async function fetchStores(){
      const q = query(collection(database, 'store'), where('type','==',params.unit));
      const storesDB = await getDocs(q);
      let data = storesDB.docs.map((ele)=> {
        return {
          name:ele.data().name,
          path: `/stocks/unit/${ele.id}/`,
        }
      })
      setStores(data)
      setDispStores(data)
    }
    fetchStores();
  },[])

  return (
    <Boiler title={params.unit.charAt(0).toUpperCase()
      + params.unit.slice(1)}>
        <Appbar />
        <Box sx={{ display: 'flex', width: "100%", justifyContent: 'space-evenly',  alignItems: 'flex-end', mr: 1, my: 1.5 }}>
        <Button variant="contained" onClick={handleClickOpen} endIcon={<AddIcon />}>
          Add
        </Button>
          <div style={{ display: 'flex', justifyContent: 'flex-end',  alignItems: 'flex-end', mr: 1, my: 1.5 }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="Search" value={querystr} onChange={searchit} variant="standard" />
          </div>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell align="left">Location</StyledTableCell>
                    <StyledTableCell align="center">Info</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {dispStores.map((row) => (
                    <StyledTableRow key={row.name}>
                    <StyledTableCell align="left" component="th" scope="row">
                        {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center"><Link href={row.path}><LaunchIcon /></Link></StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Confirm creating new store?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make a new {params.unit} unit
              <Box sx={{
                  '& .MuiTextField-root': { m: 2 },
                }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Warehouse-Location"
                  placeholder='Baripada Storage'
                  value={unit}
                  onChange={(e)=>{setUnit(e.target.value)}}
                />
                <br />
                <MapInput settingMap={setPickup} />
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Disagree
            </Button>
            <Button onClick={createObj} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
    </Boiler>
  );
}

export default Stores;