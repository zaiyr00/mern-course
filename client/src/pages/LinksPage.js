import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import Loader from "../components/Loader";
import LinkedList from "../components/LinkedList";

const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const {loading, request} = useHttp();
    const { token } = useContext(AuthContext);

    const fetchLinks = useCallback(async () => {
       try {
           const fetched = await request('/api/link', 'GET', null, {
               Authorization: `Bearer ${token}`
           })
           debugger
           setLinks(fetched);
       } catch (e) {}
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks])

    if (loading) {
        return <Loader />
    }

    return (
        <Fragment>
            {!loading && <LinkedList links={links}/>}
        </Fragment>
    );
};

export default LinksPage;