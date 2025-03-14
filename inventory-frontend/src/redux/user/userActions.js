import api from "../../api"
import { FETCH_USER_FAILURE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from "./userTypes"

export const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST
    }
}

export const fetchUserSuccess = (user) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: user
    }
}

export const fetchUserFailure = (error) => {
    return {
        type: FETCH_USER_FAILURE,
        payload: error
    }
}

export const fetchUser = (userId) => {
    return (dispatch) => {
        dispatch(fetchUserRequest)
        api.get(`/api/user/${userId}/`)
        .then((response) => {
            const user = response.data
            dispatch(fetchUserSuccess(user))
        })
        .catch((error) => {
            const errorMsg = error.msg
            dispatch(fetchUserFailure(errorMsg))
        })
    }
}