import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useRouter } from 'next/navigation';

import { database } from '../../../firebase/config';
// import { typesense } from '../../../typesense/config';
import { collection, addDoc } from "firebase/firestore"; 

const pages = ['Products', 'Add'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const setup = ['source','warehouse', 'retail']
const unit = ['vegetables','fruits', 'beverages']

export default function Appbar(props){

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const router = useRouter();

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const createObj = async ()=>{
      setOpen(false);

      // const docRef = await addDoc(collection(database, `inventory/${props.type}/stack`),{name:"not edited"});
      // await typesense.collections('inventory').documents().create({
      //   id: docRef.id,
      //   name: 'not edited',
      //   descrip: 'not edited',
      //   type: props.type,
      //   cover: 'not edited',
      // });
      // router.push(`/inventory/${props.type}/${docRef.id}`);
    }

    return(
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {props.type=='store'?(
                    unit.map(ele => {
                      return (<Link key={ele} href={`/stocks/unit/${props.id}/${ele}`}>
                        <Button
                          onClick={handleCloseNavMenu}
                          sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                          {ele}
                        </Button>
                      </Link>)
                    })
                  ):(setup.map(ele => {
                    return (<Link key={ele} href={`/stocks/setup/${ele}`}>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        {ele}
                      </Button>
                    </Link>)
                  }))}
              </Box>

            </Toolbar>
          </Container>
        </AppBar>
    );
};