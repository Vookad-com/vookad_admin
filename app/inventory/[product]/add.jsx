'use client';
// import { usePathname } from 'next/navigation';
import Boiler from '@/app/boiler';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { FormControl } from '@mui/material';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

import FullFeaturedCrudGrid from './datagrid';
import MultiFile from './file';


const Product = ({ params }) => {
    const type = params.product;
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
                  <FormControl sx={{ p: 2 }}>
                    <InputLabel htmlFor="my-input">Product Name</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                  </FormControl>
                  <FormControl sx={{ p: 2 }}>
                    <TextField
                      id="standard-multiline-flexible"
                      label="Product Description"
                      variant="standard"
                      multiline
                      sx={{ p: 1 }}
                      maxRows={6}
                    />
                  </FormControl>
                  <div sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      Category
                    </Typography>
                    <FullFeaturedCrudGrid>
                    </FullFeaturedCrudGrid>
                  </div>
                  <div sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Gallery
                    </Typography>
                    <MultiFile />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
      </Boiler>
    )
  }
  
export default Product;