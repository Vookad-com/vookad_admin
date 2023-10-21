import React, { useEffect } from 'react'
import Files from 'react-files'
import Image from 'next/image'
import { Draggable } from "react-drag-reorder";
import {
  randomId
} from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

const MultiFile = (props) => {

  const fileData = props.data;
  const setFiles = props.func;

  const ArrangeBox = React.useCallback(() =>{

    const getChangedPos = async (currentPos, newPos) => {
      let arr = fileData;
      [arr[currentPos], arr[newPos]]= await [arr[newPos], arr[currentPos]];
      setFiles(arr);
    };

    return(
      <Grid container spacing={1} sx={{ m: 2, mx: 'auto', }}>
        <Draggable onPosChange={getChangedPos}>
          {fileData.map((e,i) => 
          <Grid key={e.id} style={{width :"100%", margin : "auto",}} item xs={3}>
            <Image src={e.url} width={140} height={140} alt={e.name} />
            <Button variant="contained" id={i} style={{cursor:'pointer', margin: "auto",}} onClick={props.handleDel} startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Grid>)}
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
  }

  const handleError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  // React.useEffect(()=>{
  //   alert("buddy");
  //   setDrag()
  // }, [fileData])

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
// data={fileData} func={setFiles} handleDel={handleDel}
// MultiFile.defaultProps = {
//   data: [],
//   func : function(){},
//   handleDel : function(){},
// }  

export default MultiFile;