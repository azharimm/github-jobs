import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import useFetch from './hooks/useFetch';
import Jobs from './components/Jobs';
import JobsPagination from './components/JobsPagination';
import JobsForm from './components/JobsForm';

function App() {
    const [params, setParams] = useState({});
    const [page, setPage] = useState(1);
    const { jobs, loading, error, hasNextPage } = useFetch(params, page);

    const handleParamsChange = (e) => {
        const param = e.target.name;
        const value = e.target.value;

        setPage(1);
        setParams(prevParams => {
            return {...prevParams, [param]: value}
        })
    }

    return (
        <Container className="my-4">
            <h1 className="mb-4">Github Jobs</h1>
            <JobsForm params={params} onParamsChange={handleParamsChange} />
            {jobs.length > 0 && <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} /> }
            {loading && <center><h3>Loading..</h3></center>}
            {error && <center><h3>Something Went Wrong! Please Try Again.</h3></center>}
            {jobs.map(job => {
                return <Jobs key={job.id} job={job}/>
            })}
            {jobs.length > 0 && <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} /> }
        </Container>
    );
}

export default App;
