'use client';
import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orders from './Orders';

import Boiler from '../boiler';

export default function Order() {
  return (
    <Boiler title={'Orders'}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
        </Container>
    </Boiler>
  );
}
