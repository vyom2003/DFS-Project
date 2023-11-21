import React, { useState, memo, useEffect, useContext } from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { PlainText, Heading } from "../../components/styled/Text";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import {
    Col,
    Container,
    Row,
    Form,
    Button,
    ProgressBar,
    Alert,
} from "react-bootstrap";
import { url } from '../../creds';

const divStyle = {
    maxWidth: '90vw',
    background: 'white',
    padding: '1rem',
    borderRadius: '1ch',
    marginTop: '1rem',
    marginBottom: '1rem'
}
const axiosInstance = axios.create({ baseURL: url });

const InputNode = memo(({ label, value, onChange, type }) => (<>
    <label className="font-medium text-lg mb-0">{label}: </label>
    {type === 'text' ? <textarea
        style={{ border: '1px solid #eee', padding: '5px 10px', minWidth: '100%' }}
        className="mb-4"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
    /> : <input
        style={{ border: '1px solid #eee', padding: '5px 10px', minWidth: '100%' }}
        className="mb-4"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
    />}
</>))

export default function DomainEditModal(props) {
    const [domain, setDomain] = useState('');
    const [publication_links, setLinks] = useState('');
    const [publication_names, setNames] = useState('');
    const [publication_format, setFormat] = useState('');
    const [abstract_a, setA] = useState('');
    const [abstarct_b, setB] = useState('');
    const [abstract_c, setC] = useState('');

    const { addToast } = useContext(ToastContext);

    useEffect(() => {
        setDomain(props.domaindata.domain);
        setLinks(props.domaindata.publication_links);
        setNames(props.domaindata.publication_names);
        setFormat(props.domaindata.publication_format);
        setA(props.domaindata.abstract_a);
        setB(props.domaindata.abstarct_b);
        setC(props.domaindata.abstract_c);
    }, [props])


    const submitEdit = () => {
        axios.post(url + 'edit-domain',
            {
                "domain": domain,
                "publication_links": publication_links,
                "publication_format": publication_format,
                "publication_names": publication_names,
                "abstract_a": abstract_a,
                "abstarct_b": abstarct_b,
                "abstract_c": abstract_c
            },
            {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                }
            }).then(res => {
                if (res.error) {
                    addToast({
                        message: "Error Editing Domain " + res.message,
                        variant: TOAST_VARIANTS.ERROR
                })
                } else {
                    addToast({
                        message: "Domain edited successfully",
                        variant: TOAST_VARIANTS.SUCCESS
                    })
                }
            }).catch(() => {
                addToast({
                    message: "Error Editing Domain",
                    variant: TOAST_VARIANTS.ERROR
                })
            })
    };
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Heading size={3}>Edit Domain : {props.domaindata && props.domaindata.domain}</Heading>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={divStyle}>
                    <form>
                        <InputNode label={'Publication Links (csv)'} value={publication_links} onChange={setLinks} />
                        <InputNode label={'Publication Names'} value={publication_names} onChange={setNames} />
                        <InputNode label={'Publication Format'} value={publication_format} onChange={setFormat} />
                        <InputNode label={'Abstract A'} value={abstract_a} onChange={setA} type="text" />
                        <InputNode label={'Abstract B'} value={abstarct_b} onChange={setB} type="text" />
                        <InputNode label={'Abstract C'} value={abstract_c} onChange={setC} type="text" />
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary float-right mr-10 mb-10" type="submit" onClick={submitEdit} >Update Domain</button>
            </Modal.Footer>
        </Modal>
    );
}