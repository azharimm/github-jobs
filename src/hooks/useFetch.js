import { useReducer, useEffect } from 'react';
import axios from 'axios';

const INITIAL_STATE = {
    jobs: [],
    loading: true
};

const ACTIONS = {
    MAKE_REQUEST: 'MAKE_REQUEST',
    GET_DATA: 'GET_DATA',
    ERROR: 'ERROR'
};

const BASE_URL = 'https://jobs.github.com/positions.json';
const herokuProxy = 'https://cors-anywhere.herokuapp.com';

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
            .get(herokuProxy + '/' + BASE_URL, {
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

        return () => {
            cancelToken.cancel();
        };
    }, [params, page]);

    return state;
};

export default useFetch;
