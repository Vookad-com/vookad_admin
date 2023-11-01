import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import InventoryIcon from '@mui/icons-material/Inventory';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import NatureIcon from '@mui/icons-material/Nature';
import BlenderIcon from '@mui/icons-material/Blender';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import MediationIcon from '@mui/icons-material/Mediation';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Link from 'next/link';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

export default function Sidebar(props){

    const drawerSt = props.drawerVar;

    const [open, setOpen] = React.useState(true);
    const [openStock, setStockOpen] = React.useState(true);
    const [openApp, setAppOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
      };
    const handleClick3 = () => {
        setAppOpen(!openApp);
      };
    const handleClick2 = () => {
        setStockOpen(!openStock);
      };

      const mainListItems = (
        <React.Fragment>
          <Link href="/">  
            <ListItemButton>
                <ListItemIcon>
                <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link href={`/orders`}>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </Link>
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
          <ListItemButton onClick={handleClick3}>
            <ListItemIcon>
              <PhoneAndroidIcon />
            </ListItemIcon>
            <ListItemText primary="App Stuff" />
              {openApp ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openApp} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
              <Link href="/app/banner/">
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <ViewCarouselIcon />
                    </ListItemIcon>
                    <ListItemText primary="Banner" />
                </ListItemButton>
              </Link>
              </List>
            </Collapse>
          <ListItemButton onClick={handleClick2}>
            <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Inventory" />
              {openStock ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
              <Link href="/inventory/menu/">
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <RestaurantMenuIcon />
                    </ListItemIcon>
                    <ListItemText primary="Menu" />
                </ListItemButton>
              </Link>
              <Link href="/inventory/package/">
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <NatureIcon />
                  </ListItemIcon>
                  <ListItemText primary="Package" />
                </ListItemButton>
              </Link>  
              <Link href="/inventory/products/">  
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <BlenderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItemButton>
              </Link>    
              </List>
            </Collapse>
          <ListItemButton onClick={handleClick2}>
            <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Stock" />
              {openStock ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStock} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
              <Link href="/stocks/setup/">
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <MediationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Setup" />
                </ListItemButton>
              </Link>
              <Link href="/stocks/">
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ApartmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Storage Unit" />
                </ListItemButton>
              </Link>  
              </List>
            </Collapse>  
        </React.Fragment>
      );
      
    const secondaryListItems = (
        <React.Fragment>
          <ListSubheader component="div" inset>
            Saved reports
          </ListSubheader>
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
          </ListItemButton>
        </React.Fragment>
      );    

    return(
        <Drawer variant="permanent" open={drawerSt}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={props.toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
    );
}  ;
