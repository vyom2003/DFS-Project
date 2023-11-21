import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { url } from '../../creds';

import { IpynbRenderer } from "react-ipynb-renderer";
import "react-ipynb-renderer/dist/styles/monokai.css";

const divStyle = {
  width: '90vw',
  background: 'white',
  padding: '0',
  borderRadius: '1ch',
  marginTop: '2rem',
  marginBottom: '2rem'
}

export default function ModelViewer(){
  const { model_id } = useParams();
  console.log('model_id', model_id);
  const [ipynb, setIpynb] = useState({});
  useEffect(() => {
    axios.get(url + 'get-json-data?model_id=' + model_id)
    .then(res => {
      console.log(res);
      setIpynb(res.data);
      console.log('ipynb', ipynb);
    })
  }, [model_id]);
  // axios.get()
  return(<div style={divStyle}>
    <IpynbRenderer
      ipynb={ipynb}
      syntaxTheme={"okaidia"}
      mdiOptions={{ html: true }}
    />
  </div>);
}