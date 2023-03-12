import React, {useState, useEffect} from "react";
import useStyles from './styles';
import FileBase from 'react-file-base64';
import {TextField, Button, Typography, Paper} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux'; 
import {createPost, updatePost} from "../../actions/posts";
import { useHistory } from "react-router-dom";

const Form = ({currentId, setCurrentId}) => {
    const classes = useStyles();
    const[postData, setPostData] = useState({title: '', message: '', tags: [], selectedFile: ''});
    const dispatch = useDispatch();
    const post = useSelector((state) => currentId ? state.posts.posts.find((post) => post._id === currentId) : null)
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();

    useEffect(()=>{
       if(post) setPostData(post);
    },[post])

    const handleSubmit = (event) => {
       event.preventDefault(); 
       
       if(currentId){ // update post
          dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
       }else{
          dispatch(createPost({...postData, name: user?.result?.name}, history));
       }

       clear();
    }

    if(!user?.result?.name){
      return(
         <Paper className={classes.paper} elevation={6}>
            <Typography variant="h6" align="center">
               Please Sign In to create your own memories and like, comment on other's memories.
            </Typography> 
         </Paper>
      )
    }

    const clear = ()=>{
        setCurrentId(null);
        setPostData({title: '', message: '', tags: [], selectedFile: ''});
    }

    return (
        <Paper className={classes.paper} elevation={6}>
          <form autoComplete="off" noValidate className={`${classes.form} ${classes.root}`} onSubmit={handleSubmit}>
            <Typography variant ="h6">{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
            <TextField name="title" variant="outlined" label="Title" fullWidth value = {postData.title} onChange={(event) => setPostData({...postData, title: event.target.value})}/>
            <TextField name="message" variant="outlined" label="Message" fullWidth value = {postData.message} onChange={(event) => setPostData({...postData, message: event.target.value})}/>
            <TextField name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value = {postData.tags} onChange={(event) => setPostData({...postData, tags: event.target.value.split(",")})}/>
            
            <div className={classes.fileInput}>
               <FileBase type="file" multiple={false} onDone={({base64}) => setPostData({...postData, selectedFile: base64})}/>
            </div>

            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
            <Button className={classes.buttonSubmit} variant="contained" color="secondary" size="small" onClick ={clear} fullWidth>Clear</Button>
          </form> 
        </Paper>
    )
}

export default Form;