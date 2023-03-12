import {AUTH, LOGOUT} from '../constants/actionTypes';

const authReducer = (state = {authData: null}, action) => {
    const type = action.type;
    const payload = action.payload;

    if(type === AUTH){
        localStorage.setItem('profile', JSON.stringify({...action?.data})) 
        return {...state, authData: action?.data}   
    }else if(type === LOGOUT){
        localStorage.clear();
        return {...state, authData: null}   
    }

    return state;
}

export default authReducer;