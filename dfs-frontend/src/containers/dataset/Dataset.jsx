import React from 'react';
import { Dset } from '../../components';
import { seg1,seg2, det, lite, mmodal, train, test, val,} from './import';
import './Dataset.css';


const Dataset = () => {
    return (
        <div className="hero__bg">
        <div className="data__dataset section__padding" id="dataset">
            <div className="data__dataset-heading">
                <h1 className="gradient__text">Available Data Sets</h1>
            </div>
            <h2 className="gradient__text">Indian Driving Dataset (IDD)</h2>  
            
            <div className="data__dataset-content text-justify">               
                <p>
                While several datasets for autonomous navigation have become available in recent years, they have tended to focus on structured driving environments. This usually corresponds to well-delineated infrastructure such as lanes, a small number of well-defined categories for traffic participants, low variation in object or background appearance and strong adherence to traffic rules. We propose a novel dataset for road scene understanding in unstructured environments where the above assumptions are largely not satisfied. It consists of 10,000 images, finely annotated with 34 classes collected from 182 drive sequences on Indian roads. The label set is expanded in comparison to popular benchmarks such as Cityscapes, to account for new classes.
                </p>
                <p>
                The dataset consists of images obtained from a front facing camera attached to a car. The car was driven around Hyderabad, Bangalore cities and their outskirts. The images are mostly of 1080p resolution, but there is also some images with 720p and other resolutions.
                </p>
            </div> 
            
            <div className="data__dataset-container">
                <div className="data__dataset-container_group">
                    <Dset imgUrl={seg1} title="IDD Segmentation- part 1"/>
                    <Dset imgUrl={seg2} title="IDD Segmentation- part 2"/>
                    <Dset imgUrl={det} title="IDD Detection"/>
                    <Dset imgUrl={lite} title="IDD Lite"/>
                    <Dset imgUrl={mmodal} title="IDD Multimodal"/>
                    <Dset imgUrl={train} title="IDD Temporal Train"/>
                    <Dset imgUrl={val} title="IDD Temporal Val"/>
                    <Dset imgUrl={test} title="IDD Temporal Test"/>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Dataset
