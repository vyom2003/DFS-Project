import axios from "axios";
import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import AllDatasets from "../../components/datasets/allDatasets";
import DomainData from "./domains";
import { DatasetFont, SubHeading } from "../../GlobalStyles";
import creds from "../../creds";
import ContentLoader from "react-content-loader";
import { DomainDataTombstone } from "../../components/tombstones/DomainDataTombstone";

const url= creds.backendUrl;

export default function DatasetsPage() {
  const [domains, setDomains] = useState([]);
  const [searchq, setSearchq] = useState('');
  const [loading, setLoading] = useState(false);
  let user = JSON.parse(localStorage.getItem('dfs-user'));
  console.log(domains);
  useEffect(()=>{
    setLoading(true);
    axios.get(url + 'domains', {
      params : {searchq}, 
    })
    .then(res=>{
      setDomains(res.data.data);
    }).catch(err => {
      console.log('UPDATE THIS TO TOAST', err);
    })
    .finally(()=>{
      setLoading(false);
    });
  }, [searchq]);
  return (<>
    <div className="bg-gray-50 p-8 w-full">
      <div className="flex flex-wrap mb-12">
        <h1 className="text-regal-blue mt-2 mb-4 text-[3rem] font-extrabold tracking-tight flex-1">Available Data Sets</h1>
        <div class="flex bg-gray-50 items-center p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
          <input class="bg-gray-50 outline-none ml-1 block float-right flex-1" type="text" value={searchq} onChange={e=>setSearchq(e.target.value)} placeholder="search..." />
        </div>
      </div>
      {loading ? (
        <div>
          {
            [1, 2, 3].map((k) => (
            <div key={k} className="mb-12">
              <h1 className="gradient__text mt-2 text-5xl py-2 tracking-tight text-gray-900 sm:text-5xl flex-1 mb-8">
                <ContentLoader height="50px" width="40%" foregroundColor="#dedede">
                    <rect height="100%" width="100%" rx="10" ry="10" />
                </ContentLoader>
              </h1>
              <p className={DatasetFont} >
                <ContentLoader height="20px" width="100%" foregroundColor="#dedede">
                  <rect height="100%" width="100%" rx="2px" ry="2px"/>
                </ContentLoader>
                <ContentLoader height="20px" width="100%" className="mt-1" foregroundColor="#dedede">
                  <rect height="100%" width="100%" rx="2px" ry="2px" />
                </ContentLoader>
              </p>
              <p className={DatasetFont + ' pt-1 mb-8 pb-3'}>
                <ContentLoader height="20px" width="100%" foregroundColor="#dedede">
                    <rect height="100%" width="100%" rx="2px" ry="2px" />
                </ContentLoader>
              </p>
                <DomainDataTombstone />
                <DomainDataTombstone />
                <DomainDataTombstone />
              <div className="mb-10 "/>
            </div>
            ))
          }
        </div>
      ) : (
        <div>
          {domains.map((domain, key) => ( <div key={key} className="mb-12">
            <h1 className={`${SubHeading} mt-2 py-2 mb-8`}>{domain.domain}</h1>
            {domain.abstract_a && <p className={DatasetFont} >{domain.abstract_a}</p>}
            {domain.abstarct_b && <p className={DatasetFont} >{domain.abstarct_b}</p>}
            {domain.abstract_c && <p className={DatasetFont} >{domain.abstract_c}</p>}
            {domain.publication_names && domain.publication_links && <><p>{domain.publication_names} <a href={domain.publication_links}><span className="text-red-500">[{domain.publication_format}]</span></a></p></>}
            <div className="mb-10 "/>
              <DomainData domain={domain.domain}/> <br /> <br />
            </div>))}
        </div>
      )}
      
    </div>
  </>);
}
