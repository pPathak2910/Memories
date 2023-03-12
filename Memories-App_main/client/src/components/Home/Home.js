import React from 'react'
import {Container, Grow, Grid, AppBar, TextField, Button, Avatar, Paper, Typography, CircularProgress} from '@material-ui/core';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import {useDispatch} from 'react-redux';
import {getPosts, getPostsBySearch} from '../../actions/posts';
import {useState, useEffect} from 'react';
import Pagination from '../Pagination';
import { mergeClasses } from '@material-ui/styles';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Dialogbox from '../../utility/Dialogbox';

function useQuery(){
    return new URLSearchParams(useLocation().search)       
}

const Home = () => {
    const dispatch = useDispatch();
    const [currentId, setCurrentId] = useState(null);
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1; // if you don't have page you must be on the first one
    const searchQuery = query.get('searchQuery');
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([])
    const [redirect, setRedirect] = useState(query.get("redirect"))

    const searchPost = () => {
      if(search.trim() || tags){
        // dispatch -> fetch search post

        dispatch(getPostsBySearch({search, tags: tags.join(',')})) // can't pass array so join and pass string
        history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`) // needed on client side for sharing purposes (share current URL to friends, colleagues etc)
      }else{
        history.push('/'); // searched for nothing, redirect back
      } 
    }

    const handleKeyPress = (event) => {
        if(event.keyCode === 13){
            // search for post, event.keyCode is 13 for enter key
            searchPost();
        }
    }

    const handleAdd = (tag) => setTags([...tags, tag]) 
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag!==tagToDelete)) 

    if(redirect){
      return (
        <Dialogbox textMessage={'You are already logged in'} buttonMessage={'Okay'} onClick = {()=>setRedirect(false)}/>
      )
    }

    return(
        <Grow in>
            <Container maxWidth="xl">
                <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                       <AppBar className={classes.appBarSearch} position="static" color="inherit">
                         <TextField 
                           name="search" 
                           variant="outlined" 
                           label="Search Memories"
                           onKeyPress={handleKeyPress}
                           fullWidth
                           value={search}
                           onChange={(event)=>setSearch(event.target.value)}/>    
                           <ChipInput
                             style={{margin: '10px 0'}}
                             value={tags}
                             onAdd={handleAdd}
                             onDelete={handleDelete}
                             label="Search Tags"
                             variant="outlined"
                           />  
                           <Button onClick={searchPost} className={classes.searchButton} color="primary" variant="contained">Search</Button> 
                       </AppBar>
                       
                        <Form currentId={currentId} setCurrentId={setCurrentId}/> 
                        {(!searchQuery && !tags.length) && (
                           <Paper elevation={6} className={classes.pagination}> 
                             <Pagination page={page}/> 
                           </Paper> 
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home