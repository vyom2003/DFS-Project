import React, { useEffect } from 'react';
import { withAuth } from "../../withAuth";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../creds';

// move this to a __fixtures__ folder
const DISCUSSION_RETURN_MOCK = {
  
}

const Discussion = () => {
  const { discussion_id } = useParams();
  useEffect(() => {
    axios.post(url + 'discussions', () => {

    });
  }, []);
  return <h1>Discussion Page of {discussion_id}</h1>;
};


export default withAuth(Discussion);