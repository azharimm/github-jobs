import { useReducer, useEffect } from 'react';
import axios from 'axios';

const INITIAL_STATE = {
    jobs: [],
    loading: false,
    error: false,
    hasNextPage: false
};

const ACTIONS = {
    MAKE_REQUEST: 'MAKE_REQUEST',
    GET_DATA: 'GET_DATA',
    ERROR: 'ERROR',
    UPDATE_HAS_NEXT_PAGE: 'UPDATE_HAS_NEXT_PAGE'
};

const BASE_URL = 'https://jobs.github.com/positions.json';
const allowOriginProxy = 'https://cors-anywhere.herokuapp.com';

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.MAKE_REQUEST:
            return { loading: true, jobs: [] };
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, jobs: action.payload.jobs };
        case ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                jobs: []
            };
        case ACTIONS.UPDATE_HAS_NEXT_PAGE:
            return {...state, hasNextPage: action.payload.hasNextPage}
        default:
            return state;
    }
};

const useFetch = (params, page) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        dispatch({ type: ACTIONS.MAKE_REQUEST });
        axios
            .get(allowOriginProxy + '/' + BASE_URL, {
                cancelToken: cancelToken.token,
                params: { markdown: true, page, ...params }
            })
            .then((res) => {
                dispatch({
                    type: ACTIONS.GET_DATA,
                    payload: { jobs: res.data }
                });
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
            });
        
        const cancelToken2 = axios.CancelToken.source();
        axios
            .get(allowOriginProxy + '/' + BASE_URL, {
                cancelToken: cancelToken2.token,
                params: { markdown: true, page: page + 1, ...params }
            })
            .then((res) => {
                dispatch({
                    type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
                    payload: { hasNextPage: res.data.length !== 0 }
                });
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
            });

        return () => {
            cancelToken.cancel();
            cancelToken2.cancel();
        };
    }, [params, page]);

    return state;
};

export default useFetch;
