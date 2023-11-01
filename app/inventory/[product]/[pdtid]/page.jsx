'use client';
import * as React from 'react';
import { useRouter } from 'next/router'
// import { usePathname } from 'next/navigation';
import Boiler from '../../../boiler';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { FormControl } from '@mui/material';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

import Appbar from '../appbar';

import FullFeaturedCrudGrid from './datagrid';
import MultiFile from './file';

import { useQuery } from '@apollo/client';
import { getinventoryItem } from 'graphql/queries';
// import { typesense } from '../../../../typesense/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { editItems } from 'graphql/mutation';
import { storage } from '../../../../firebase/config';

const Add = ({ params }) => {
    const type = params.product;
    const docID = params.pdtid;

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const checkboxes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const checkboxRefs = checkboxes.reduce((acc, checkboxName) => {
      acc[checkboxName] = React.useRef(false);
      return acc;
    }, {});

    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const handleCheckboxChange = (checkboxName) => {
      const checkboxRef = checkboxRefs[checkboxName];
      checkboxRef.current = !checkboxRef.current;

      if (checkboxRef.current) {
        setSelectedOptions([...selectedOptions, checkboxName]);
      } else {
        setSelectedOptions(selectedOptions.filter((option) => option !== checkboxName));
      }
    };

    const [name, setName] = React.useState('')
    const [descrip, setDesc] = React.useState(``)
    const [rows, setRows] = React.useState([]);
    const [fileData, setFiles] = React.useState([]);
    const [delload, setDelLoad] = React.useState([]);

    const {loading: loadingApi , error, data, client } = useQuery(getinventoryItem, {
      variables: { getInventoryItemId: docID },
    })
    if (error)
      console.error(error);

    const buttonSx = {
      ...(success && {
        bgcolor: green[500],
        '&:hover': {
          bgcolor: green[700],
        },
      }),
    };

    const handleSubmit = async ()=>{
      setSuccess(false);
      setLoading(true);
      console.log(rows);
      await checkDeletion();
      let arr = await upload(fileData);
      try {
        let response = await client.mutate({
          mutation:editItems,
          variables:{
            obj: {
              _id:docID,
              name,
              description: descrip,
              family: [type],
              tags:selectedOptions,
              gallery: [...arr.map(e => {
                    return {
                    id: e.id,
                    url: e.url,
                    name: e.name,
                  }})],
              category: rows.map(e=>{
                return {id:e.id, price: e.price, name: e.name };
              })
            }
          }
        });
      } catch (error) {
        console.error(error)
      }
      setFiles(arr);
      setLoading(false);
      setSuccess(true);
      setTimeout(()=>{setSuccess(false);}, 5000)
    }

    const checkDeletion = async () => {
      delload.forEach(async e => {
        let delObj = ref(storage, `inventory/${type}/${docID}/${e}`);
        await deleteObject(delObj);
      });
    }

    const upload = (marr)=>{
      return new Promise(async function(resolve, reject){
        let list = [];
        marr.forEach(e => {
          list.push(
            new Promise(async function(resolve, reject){
              if(e.file){
                let imgRef = ref(storage,`inventory/${type}/${docID}/${e.id}`);
                let response = await uploadBytes(imgRef, e.file);
                let downloadUrl = await getDownloadURL(response.ref);
                e.file = null;
                delete e.file;
                resolve({
                  ...e,
                  url:downloadUrl,
                });
              } else {
                resolve({...e});
              }
            })
          );
        });
        let values = await Promise.all(list);
        resolve(values);
        reject(marr);
      })

    }

    const handleDel = (e) => {
      let arr = [...fileData];
      let i = parseInt(e.currentTarget.id);
      // console.log(fileData.length)
      try {
        if (!arr[i].file){
          setDelLoad([...delload, arr[i].id]);
        }
        arr.splice(i, 1);
        setFiles([...arr]);
      } catch (error) {
        console.log(error);
        // console.log("jhol mal");
      }
    }

    React.useEffect(()=>{
      if (!loadingApi && !error) {
        const { getInventoryItem :doc } = data;
        setName(doc.name);
        setDesc(doc.description);
        setRows(doc.category);
        setFiles(doc.gallery);
        setSelectedOptions(doc.tags);
        checkboxes.forEach((checkboxName) => {
          const isChecked = doc.tags.includes(checkboxName);
          checkboxRefs[checkboxName].current = isChecked;
        });
      }
    },[loadingApi]);

    return (
      <Boiler title={type.charAt(0).toUpperCase()
        + type.slice(1)}>
        <Appbar type={type} />  
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
                    <Input id="my-input" aria-describedby="my-helper-text" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                  </FormControl>
                  <FormControl sx={{ p: 2 }}>
                    <TextField
                      id="standard-multiline-flexible"
                      label="Product Description"
                      variant="standard"
                      multiline
                      sx={{ p: 1 }}
                      maxRows={6}
                      value={descrip}
                      onChange={(e)=>{setDesc(e.target.value)}}></TextField>
                  </FormControl>
                  <div>
                    <ul style={{display:"flex", justifyContent:"space-evenly", listStyle:'none'}}>
                    {checkboxes.map((checkboxName) => (
                      <li key={checkboxName}>
                        <Checkbox
                          id={checkboxName}
                          onChange={() => handleCheckboxChange(checkboxName)}
                          checked={selectedOptions.includes(checkboxName)}
                        />
                        <label htmlFor={checkboxName}>{checkboxName}</label>
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      Category
                    </Typography>
                    <FullFeaturedCrudGrid data={rows} changer={setRows}>
                    </FullFeaturedCrudGrid>
                  </div>
                  <br />
                  <div sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Gallery
                    </Typography>
                    <MultiFile data={fileData} func={setFiles} handleDel={handleDel} />
                  </div>
                  <Fab
                    aria-label="save"
                    color="primary"
                    sx={buttonSx}
                    onClick={handleSubmit}
                  >
                    {success ? <CheckIcon /> : <SaveIcon />}
                  {loading ? (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        top: -6,
                        position: 'absolute',
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  ):null}
                  </Fab>
                </Paper>
              </Grid>
            </Grid>
          </Container>
      </Boiler>
    )
  }


  
export default Add;