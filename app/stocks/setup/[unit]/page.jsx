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
import client from 'graphql/config';
import { getChefs } from 'graphql/queries';
import { useState } from 'react';
import { newChef } from 'graphql/mutation';

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

function Stores({params}) {
  const [open, setOpen] = React.useState(false);

  // store creating stuff
  const [pickup, setPickup] = React.useState();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [building, setBuilding] = useState('');

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

    const formData = {
      name: name,
      phone: phone,
      address: {
        landmark: landmark,
        area: area,
        building: building,
      },
      displayname: displayName,
      location: pickup,
      pincode: pincode,
    };
    try {
      const {data:{newchef}} = await client.mutate({
        mutation: newChef,
        variables:{chef:formData,}
      });
      setOpen(false);
      fetchStores();
      router.push(`/stocks/unit/${newchef._id}/`);
    } catch (error) {
      console.error(error);
      alert("try again");
    }
  }

  function searchit(e){
    setQuery(e.target.value)
    if(e.target.value!=''){
      const fuse = new Fuse(stores, {
          keys: ['name', 'pincode', 'phone']
      })
      setDispStores(fuse.search(e.target.value).map(i => i.item));
    } else{
      setDispStores(stores);
    }
  }
  async function fetchStores(){
    const {data:{getchefs:allchefs}} = await client.mutate({
      mutation: getChefs
    })
    let data = allchefs.map((ele)=> {
      return {
        ...ele,
        path: `/stocks/unit/${ele._id}/`,
      }
    })
    setStores(data)
    setDispStores(data)
  }
  React.useEffect(()=>{
    
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
                    <StyledTableCell align="left">Chef</StyledTableCell>
                    <StyledTableCell align="left">Phone</StyledTableCell>
                    <StyledTableCell align="left">Pincode</StyledTableCell>
                    <StyledTableCell align="center">Info</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {dispStores.map((row) => (
                    <StyledTableRow key={row.name}>
                    <StyledTableCell align="left" component="th" scope="row">
                        {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="left" component="th" scope="row">
                        {row.phone}
                    </StyledTableCell>
                    <StyledTableCell align="left" component="th" scope="row">
                        {row.pincode}
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
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Phone"
                type='number'
                placeholder='90781014920'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Display Name"
                placeholder='Chef Sushma'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Pincode"
                type='number'
                placeholder='753014'
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <br />
              <h3>Address</h3>
              <TextField
                required
                id="outlined-required"
                label="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                label="Building"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
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