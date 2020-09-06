import React from 'react';
import { Container } from 'react-bootstrap'
import useFetch from './hooks/useFetch'

function App() {
    const { jobs, loading, error } = useFetch()

    return (
        <Container>
            { loading && <h1>Loading..</h1>}
            { error && <h1>Something Went Wrong! Please Try Again.</h1>}
            <h1>{ jobs.length }</h1>
        </Container>
    );
}

export default App;
