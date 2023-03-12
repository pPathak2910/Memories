import React from 'react';
import {useState, useEffect} from "react";
import Post from './Post/Post'
import useStyles from './styles';
import {useSelector} from 'react-redux';
import {Grid, CircularProgress, Paper, Typography, Container, Button, Avatar} from '@material-ui/core'
import {useLocation} from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useHistory} from 'react-router-dom';
import Dialogbox from '../../utility/Dialogbox';

function useQuery(){
    return new URLSearchParams(useLocation().search)       
}

const Posts = ({setCurrentId}) => {
    const {posts, isLoading} = useSelector((state) => state.posts);
    const classes = useStyles();
    const query = useQuery();
    const history = useHistory();

    if(!posts.length && !isLoading){
        return (
            <Dialogbox textMessage={'No posts found'} buttonMessage={'Okay'} onClick={()=>history.push('/')}/>
        )
    }

    return (
        isLoading?
        <div className={classes.loadingPaper}>
            <CircularProgress size="7em"/>
        </div> : (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {posts.map((post) => (
                   <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
                      <Post post={post} setCurrentId={setCurrentId}/>
                   </Grid> 
                ))}
            </Grid>
        )
    )
}

export default Posts;