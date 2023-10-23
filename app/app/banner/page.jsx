'use client';
import React, { useEffect, useRef } from 'react'
import Files from 'react-files'
import Image from 'next/image'
import { Draggable } from "react-drag-reorder";
import {
  randomId
} from '@mui/x-data-grid-generator';
import DeleteIcon from '@mui/icons-material/Delete';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { green } from '@mui/material/colors';

import Boiler from '../../boiler';
import { useQuery } from '@apollo/client';
import { banner } from 'graphql/queries';
import { editbanner } from 'graphql/mutation';

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../../firebase/config';

export default function Banner() {

    const [loading, setLoading] = React.useState(false);
    const [fileData, setFiles] = React.useState([]);
    const [delload, setDelLoad] = React.useState([]);
    const [success, setSuccess] = React.useState(false);
    const routes = useRef([]);

    const {loading: loadingApi , error, data, client } = useQuery(banner, {
      variables: { bannerId: "656466326565303339333533" },
    })

    const buttonSx = {
      ...(success && {
        bgcolor: green[500],
        '&:hover': {
          bgcolor: green[700],
        },
      }),
    };

    useEffect(()=>{
      if(!loadingApi && !error){
        routes.current = data.banner.gallery.map(e=>e.route);
        setFiles(data.banner.gallery ?? []);
      }
    }, [loadingApi])

    const handleDel = (e) => {
        let arr = [...fileData];
        let i = parseInt(e.currentTarget.id);
        // console.log(fileData.length)
        try {
          if (!arr[i].file){
            setDelLoad([...delload, arr[i].id]);
          }
          arr = arr.map((e,i) => {return {...e, route: routes.current[i]}})
          routes.current.splice(i,1);
          arr.splice(i, 1);
          setFiles([...arr]);
        } catch (error) {
          console.log(error);
          // console.log("jhol mal");
        }
      }

      const checkDeletion = async () => {
        delload.forEach(async e => {
          try {
            let delObj = ref(storage, `banner/656466326565303339333533/${e}`);
            await deleteObject(delObj);
          } catch (error) {
            console.error(error);
          }
        });
      }
  
      const upload = (marr)=>{
        return new Promise(async function(resolve, reject){
          let list = [];
          marr.forEach(e => {
            list.push(
              new Promise(async function(resolve, reject){
                if(e.file){
                  let imgRef = ref(storage,`banner/656466326565303339333533/${e.id}`);
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

      const handleSubmit = async ()=>{
        setSuccess(false);
        setLoading(true);
        await checkDeletion();
        let arr = await upload(fileData);
        try {
          let response = await client.mutate({
            mutation:editbanner,
            variables:{
              carouselId: "656466326565303339333533",
              payload:[...arr.map((e,i) => {
                return {
                id: e.id,
                url: e.url,
                name: e.name,
                route: routes.current[i],
              }})],
            }
          });
          routes.current = [response.data.carousel.gallery.map(e=>e.route)];
          setFiles(response.data.carousel.gallery ?? []);
        } catch (error) {
          console.error(error)
        }
        setLoading(false);
        setSuccess(true);
        setTimeout(()=>{setSuccess(false);}, 5000)
      }

  return (
    <Boiler title={'Banner'}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography>
                      Use 16:9 imgs and compress it before upload for better speed!
                    </Typography>
                    <MultiFile data={fileData} routes={routes} func={setFiles} handleDel={handleDel} />
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
        </Container>
    </Boiler>
  );
}

const MultiFile = (props) => {

    const fileData = [...props.data];
    const setFiles = props.func;
    var routes = props.routes;



    const ArrangeBox = React.useCallback(() =>{
  
      const getChangedPos = async (currentPos, newPos) => {
        let arr = fileData;
        [arr[currentPos], arr[newPos]]= [arr[newPos], arr[currentPos]];
        [routes.current[currentPos], routes.current[newPos]]= [routes.current[newPos], routes.current[currentPos]];
        setFiles(arr);
      };
  
      return(
        <Grid container spacing={1} sx={{ m: 1, mx: 'auto', }}>
          <Draggable onPosChange={getChangedPos}>
            {fileData.map((e,i) => 
              <Card key={e.id}sx={{ width: 250, margin:1 }}>
                    <CardActionArea>
                        <CardMedia
                        component="img"
                        height="140"
                        image={e.url}
                        alt="No image"
                        />
                        <CardContent>
                            <TextField onChange={(e)=>{
                              routes.current[i] = e.target.value;
                            }} defaultValue={e.route ?? ""}  label="url" variant="standard" />
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button id={i} onClick={props.handleDel} size="small">Delete</Button>
                    </CardActions>
                </Card>
            )}
          </Draggable>
        </Grid>  
      )
    
    }, [fileData]);
  
    const handleChange = (files) => {
      setFiles([...fileData, ...files.map((e)=> {
        return(
          {
            id: `${randomId()}.${e.extension}`,
            url: e.preview.url,
            name: e.name,
            file: e,
          }
        )
      })]);
      routes.current = [...routes.current, ...files.map(e=> "")];
    }
  
    const handleError = (error, file) => {
      console.log('error code ' + error.code + ': ' + error.message)
    }
  
    return (
      <div className="files">
        <Files
          className='files-dropzone'
          onChange={handleChange}
          onError={handleError}
          accepts={['image/*']}
          multiple
          maxFileSize={10000000}
          minFileSize={0}
          clickable>
          Drop files here or click to upload
        </Files>
        <ArrangeBox fileData={fileData}/>
      </div>
    )
  }