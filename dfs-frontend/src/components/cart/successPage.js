import React from 'react';
import creds from '../../creds'
import axios from "axios";
import { useEffect } from 'react';
const url = creds.backendUrl;
const SuccessPage = () => {
    const user = JSON.parse(localStorage.getItem("dfs-user")).user.user_email
    useEffect(() => {
        let dataReq = {
            UserId: user
        }
        axios
            .post(url + "done-purchase", { params: dataReq })
            .then((data) => {
                window.location.href = "http://localhost:3000/my-data"
            })
            .catch((err) => {
            })
    }, []);
    return (
        <div className='has-text-centered'>
            <h1 className='is-size-1'>Payment Successful!</h1>
            <p className='is-size-3'>Thank you for your purchase.</p>
            <p className='is-size-3'>We will be redirecting you shortly</p>
        </div>
    );
};

export default SuccessPage;


