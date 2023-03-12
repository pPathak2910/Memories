import React from 'react'
import {Avatar, Button, Paper, Typography, Container} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles'

const Dialogbox = ({textMessage, buttonMessage, onClick, variant="h5"}) => {
    const classes = useStyles();
    
    return (
        <Container component="main" maxWidth="xs">
           <Paper className={classes.paper} elevation ={3}>
               <Avatar className={classes.avatar}>
                   <LockOutlinedIcon/>
               </Avatar>

               <Typography variant={variant} style={{textAlign:"center"}}>{textMessage}</Typography>
               
               <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick = {onClick}>
                    {buttonMessage}
               </Button>
           </Paper>
        </Container>
    )
}

export default Dialogbox