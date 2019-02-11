import { 
    FB_ATTEMPTING , 
    FB_LOGIN_FAILED , 
    FB_LOGIN_SUCCESS ,
    REFRESH_PROFILE
} from '../actions/types';

const INITAL_STATE = { loading : false , profile : null , token : null };

export default (state = INITAL_STATE , action) => {
    switch(action.type)
    {
        case FB_ATTEMPTING :
            return {...INITAL_STATE , loading : true };
        
        case FB_LOGIN_FAILED :
            return { loading : false , token : null };

        case FB_LOGIN_SUCCESS:    
            return{loading:false,token:action.payload.token,profile:action.payload.profile};
        
        case REFRESH_PROFILE:
            return{...state , profile : action.payload.profile }    

        default: return state;

    }
};