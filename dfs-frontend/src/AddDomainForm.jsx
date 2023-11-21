import axios from "axios";
import { useEffect, useContext } from "react";
import { useState, memo } from "react";
import { url } from './creds';
import DomainEditModal from "./containers/domain/DomainEditModal";
import { ToastContext } from "./App";
import { TOAST_VARIANTS } from "./packages/toasts/constants";

const divStyle = {
  maxWidth: '90vw',
  background: 'white',
  padding: '2rem',
  borderRadius: '1ch',
  marginTop: '2rem',
  marginBottom: '3rem'
}

const InputNode = memo(({label, value, onChange, type}) => (<>
  <label className="font-medium	mb-0">{label}: </label>
  {type === 'text' ? <textarea
    style={{border: '1px solid #eee', padding: '5px 10px', minWidth: '100%'}}
    className="mb-4"
    value={value}
    onChange={e=>onChange(e.target.value)}
    placeholder={label}
  /> : <input
    style={{border: '1px solid #eee', padding: '5px 10px', minWidth: '100%'}}
    className="mb-4"
    value={value}
    onChange={e=>onChange(e.target.value)}
    placeholder={label}
  />}
</>))

const RED_BUTTON_CSS = "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm float-right"

export default function AddDomainForm(){
  const [domain, setDomain] = useState('');
  const [publication_links, setLinks] = useState('');
  const [publication_names, setNames] = useState('');
  const [publication_format, setFormat] = useState('');
  const [abstract_a, setA] = useState('');
  const [abstarct_b, setB] = useState('');
  const [abstract_c, setC] = useState('');

  const [domains, setDomains] = useState([]);

  const [DomainData, setDomainData] = useState({});
  const [showDomainEdit, setShowDomainEdit] = useState(false);
  
  const { addToast } = useContext(ToastContext);

  const addDomainSubmitHandler = e => {
    e.preventDefault();
    if(loading) return;
    if(!domain || !publication_format || !publication_names || !publication_links || !abstract_a || !abstarct_b || abstract_c){
      setLoading(true);
      axios.post(url + 'add-domain', {domain, publication_links, publication_names, publication_format, abstract_a, abstarct_b, abstract_c}, {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
        }
      }).then(res => {
        if(res.data.error){
          addToast({
            message: "Error Adding Domain " + res.data.message,
            variant: TOAST_VARIANTS.ERROR
          });
        } else {
          addToast({
             message: "Added Domain Successfully",
             variant: TOAST_VARIANTS.SUCCESS
        });
        }
      }).catch(err => {
        addToast({
          message: "Error Adding Domain",
          variant: TOAST_VARIANTS.ERROR
        });
      }).finally(res => {
        setLoading(false);
      })
    }
  }

  const [loading, setLoading] = useState(false);
  useEffect(() => {
      axios.get(url + 'domains', {params : {searchq: ''}, })
      .then(res=>{
        setDomains(res.data.data);
      });
  }, [loading]);

  return(<>
    <div>
      <div style={divStyle}>
        <h1>Add Domain</h1> <hr />
        <form onSubmit={addDomainSubmitHandler}>
          <InputNode label={'Domain Name'} value={domain} onChange={setDomain} required/>
          <InputNode label={'Publication Links (csv)'} value={publication_links} onChange={setLinks} />
          <InputNode label={'Publication Names'} value={publication_names} onChange={setNames} />
          <InputNode label={'Publication Format'} value={publication_format} onChange={setFormat} />
          <InputNode label={'Abstract A'} value={abstract_a} onChange={setA} type="text" required/>
          <InputNode label={'Abstract B'} value={abstarct_b} onChange={setB} type="text"/>
          <InputNode label={'Abstract C'} value={abstract_c} onChange={setC} type="text"/>
          <div className="text-right">
            <button
              type="submit"
              className="text-btn justify-center rounded-md border border-transparent shadow-sm px-4 py-2 mb-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >Add Domain</button>
          </div>
        </form>
      </div>
    </div>
    <div style={divStyle}>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Domain
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((k, i) => <tr key={k.domain} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i+1}</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {k.domain}
                    </td>
                    <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                      {!loading ? <button className={RED_BUTTON_CSS} onClick={e=>{
                        setLoading(true);
                        axios.post(url + 'delete-domain?domain=' + k.domain, {domain: k.domain}, {
                          headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                          }                
                        }).then(res => {
                          setLoading(false);
                          if(res.error){
                            addToast({
                              message: "Error Deleting " + res.message,
                              variant: TOAST_VARIANTS.ERROR
                            });
                          } else {
                            addToast({
                              message: "Deleted Successfully",
                              variant: TOAST_VARIANTS.SUCCESS
                            });
                          }
                        }).catch(() => {
                          addToast({
                            message: "Error Deleting",
                            variant: TOAST_VARIANTS.ERROR
                          });
                        }).finally(() => {
                          setLoading(false);
                        })
                      }}>Delete</button> : <span>...</span>}
                      &nbsp;
                      {!loading ? <button className="btn btn-info" onClick={e=>{
                        setShowDomainEdit(true);
                        setDomainData(k);
                        setLoading(true);
                      }}>Edit</button> : <span>...</span>}
                    </td>
                  </tr>)}
                </tbody>
              </table>
              <DomainEditModal
                show={showDomainEdit}
                onHide={() => {setShowDomainEdit(false);setLoading(false);}}
                domaindata={DomainData}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </>);
}