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
import { ApolloClient } from '@apollo/client';
import client from 'graphql/config';
import { createItem } from 'graphql/mutation';

const pages = ['Products', 'Add'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

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
      const { data: { inventoryAdd: {_id} }} = await client.mutate({
        mutation: createItem,
        variables:{
          family: props.type
        }
      })
      router.push(`/inventory/${props.type}/${_id}`);
    }

    return(
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Link href={'/inventory/' + props.type}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {'Product'}
                    </Button>
                  </Link>
                  <Button
                      onClick={handleClickOpen}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {'Add'}
                  </Button>
                  <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"Confirm creating new product?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This will create product in both databases
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
              </Box>

            </Toolbar>
          </Container>
        </AppBar>
    );
};