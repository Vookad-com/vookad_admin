'use client';
import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orders from './Orders';

import Boiler from '../boiler';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { setDate } from 'redux/orders';
import { callordersDB } from 'components/helpers/getOrders';

export default function Order() {
  const value = useSelector(state => state.orders?.date ?? "2023-12-28T00:04:20.135+00:00");
  const dispatch = useDispatch();
  const handleChange = React.useCallback((newValue) => {
    const dateObject = new Date(newValue);
    dispatch(setDate(dateObject.toISOString()));
  }, [value]);
  const refresh = async () =>{
    callordersDB(value);
  }
  return (
    <Boiler title={'Orders'}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <div style={{  display: 'flex', justifyContent: 'space-between' }} >
                    <LocalizationProvider style={{
                      display:'inline'
                    }} dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Date of Order"
                        value={dayjs(value)}
                        onChange={handleChange}
                      />
                      </DemoContainer>
                    </LocalizationProvider>
                    <button style={{display: 'inline'}} onClick={refresh}>
                      Refetch
                    </button>
                    </div>
                  <Orders />
                </Paper>
              </Grid>
        </Container>
    </Boiler>
  );
}
