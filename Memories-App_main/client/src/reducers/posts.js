import {FETCH_ALL, CREATE, FETCH_POST, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, COMMENT} from '../constants/actionTypes';

export default (state = {isLoading: true, posts:[]}, action) => {
    const type = action.type;
    const payload = action.payload;
    const data = payload?.data;

    if(type==START_LOADING){
        return {...state, isLoading: true} 
    }else if(type==END_LOADING){
        return {...state, isLoading: false} 
    }else if(type === FETCH_ALL){
        return {
            ...state,
            posts: data,
            currentPage: payload.currentPage,
            numberOfPages: payload.numberOfPages
        }
    }else if(type === CREATE){
        return {...state, posts: [...state.posts, data]}
    }else if(type === UPDATE || type === LIKE){
        return {...state, posts: state.posts.map((post) => post._id === payload._id ? payload : post)}
    }else if(type === DELETE){
        return {...state, posts: state.posts.filter((post) => post._id !== payload)}
    }else if(type === FETCH_BY_SEARCH){
        return {...state, posts: payload}
    }else if(type === FETCH_POST){
        return {...state, post: payload}
    }else if(type === COMMENT){
        return {
          ...state, 
          posts: state.posts.map((post) => {
            if(post._id === payload._id) return payload;

            return post;
          })
        }
    }

    return state;
}