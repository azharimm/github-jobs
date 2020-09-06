import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import useFetch from './hooks/useFetch';
import Jobs from './components/Jobs';
import JobsPagination from './components/JobsPagination';

function App() {
    const [params, setParams] = useState({});
    const [page, setPage] = useState(1);
    const { jobs, loading, error, hasNextPage } = useFetch(params, page);

    return (
        <Container className="my-4">
            <h1 className="mb-4">Github Jobs</h1>
            {loading && <h1>Loading..</h1>}
            {error && <h1>Something Went Wrong! Please Try Again.</h1>}
            {jobs.map(job => {
                return <Jobs key={job.id} job={job}/>
            })}
            <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
        </Container>
    );
}

export default App;
