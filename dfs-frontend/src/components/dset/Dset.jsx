import React from 'react';
import './Dset.css';

const Dset = ({ imgUrl, title }) => {
    return (
        <div className="data__dataset-container_block">
            <div className="data__dataset-container_block-image">
                <img src={ imgUrl } alt="datasetimg"/>
            </div>
            <div className="data__dataset-container_block-content">
                <div>
                    <h3><a href="https://idd.insaan.iiit.ac.in/dataset/details/" target="_blank" rel="noreferrer">{ title }</a></h3>
                </div>
                <p><a href="https://idd.insaan.iiit.ac.in/accounts/login/?next=/dataset/download/" target="_blank" rel="noreferrer">View Dataset</a></p>
            </div>
        </div>
    )
}

export default Dset
