import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import useFetch from './hooks/useFetch';
import Jobs from './components/Jobs';

function App() {
    const [params, setParams] = useState({});
    const [page, setPage] = useState(1);
    const { jobs, loading, error } = useFetch(params, page);

    return (
        <Container>
            {loading && <h1>Loading..</h1>}
            {error && <h1>Something Went Wrong! Please Try Again.</h1>}
            {jobs.map(job => {
                return <Jobs key={job.id} job={job}/>
            })}
        </Container>
    );
}

export default App;
