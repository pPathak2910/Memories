import React, {useState, useRef} from 'react';
import {Typography, TextField, Button} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import useStyles from './styles';
import {commentPost} from '../../actions/posts'

const CommentSection = ({post}) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const commentsRef = useRef();

    const handleClick = async() => {
       const finalComment = `${user.result.name}: ${comment}`
       const newComments = await dispatch(commentPost(finalComment, post._id))     
       
       setComments(newComments)
       setComment('') 

       commentsRef.current.scrollIntoView({behaviour: 'smooth'}) 
    }

    return (
        <div>
            <div className = {classes.commentsOuterContainer}>
                <div className = {classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments.map((comment, idx) => {
                       const arr = comment.split(':')
                       const userName = arr[0]
                       const text = arr[1]

                       return( 
                        <Typography key = {idx} gutterBottom variant="subtitle1">
                            <strong>{userName}</strong>{text}
                        </Typography>
                       )
                    })}
                    <div ref={commentsRef}></div> {/*scroll to this specific div since its at the end of messages (auto scroll down when adding new message)*/}
                </div>

                {user && (
                    <div style={{width: '70%'}}>
                        <Typography gutterBottom variant="h6">Write a Comment</Typography> 

                        <TextField
                        fullWidth
                        rows={4}
                        variant="outlined"
                        label="Comment"
                        multiline
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        />
                        
                        <Button style={{marginTop: '10px'}} fullWidth disabled={!comment} variant="contained" color="primary" onClick={handleClick}>
                        Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection