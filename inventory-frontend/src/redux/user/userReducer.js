import { FETCH_USER_FAILURE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from "./userTypes"

const initialState = {
    loading: false,
    user: {},
    error: ""
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: ""
            }
        
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                user: {},
                error: action.payload
            }
        
        default: return state
    }
}

export default userReducer