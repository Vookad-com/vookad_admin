'use client';
import * as React from 'react';
// import { usePathname } from 'next/navigation';
import Link from 'next/link'
import Boiler from '../boiler';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import EditIcon from '@mui/icons-material/Edit';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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

const Stock = () => {
    const type = "Stock";

    return (
      <Boiler title={type.charAt(0).toUpperCase()
        + type.slice(1)}>
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
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead >
                        <TableRow className='tableName'>
                          <TableCell><b style={{'fontSize':18,}} >Dessert (100g serving)</b></TableCell>
                          <TableCell align="right"><b style={{'fontSize':18,}} >Calories</b></TableCell>
                          <TableCell align="right"><b style={{'fontSize':18,}} >Fat&nbsp;(g)</b></TableCell>
                          <TableCell align="right"><b style={{'fontSize':18,}} >Carbs&nbsp;(g)</b></TableCell>
                          <TableCell align="right"><b style={{'fontSize':18,}} >Protein&nbsp;(g)</b></TableCell>
                          <TableCell align="right"><b style={{'fontSize':18,}} >Edit</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            <TableCell align="right"><Link href={`#`}><EditIcon /></Link></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
      </Boiler>
    )
  }
  
export default Stock;