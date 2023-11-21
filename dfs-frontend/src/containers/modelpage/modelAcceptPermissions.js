import React, { useEffect, useContext } from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { url } from '../../creds';
import { LargeInputField } from "../../components/styled/Forms";
import { Button } from "../../components/styled/Buttons";
import { ToastContext } from "../../App";

export default function PermissionSelectModal(props) {
    const { addToast } = useContext(ToastContext);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4 >Select Permissions</h4>
                <LargeInputField rows={2} className="w-full mb-4" placeholder="No comments" disabled>{props.targetElement?.comment}</LargeInputField>
                <>
                    <Button.Green onClick={e => {
                        axios.post(url + 'req-model-action?token=' + JSON.parse(localStorage.getItem('dfs-user'))['token'] + "&model_id=" + props.targetElement?.model_id,
                            { ...props.targetElement, action: 'accepted', permissions: 'read' },
                            {
                                headers: {
                                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                                }
                            })
                            .then(res => {
                                console.log(res);
                                addToast({
                                    message: 'Read Permission Granted',
                                })
                            })
                    }}> READ </Button.Green> &nbsp;
                    <Button.Purple onClick={e => {
                        axios.post(url + 'req-model-action?token=' + JSON.parse(localStorage.getItem('dfs-user'))['token'] + "&model_id=" + props.targetElement?.model_id,
                            { ...props.targetElement, action: 'accepted', permissions: 'write' },
                            {
                                headers: {
                                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                                }
                            })
                            .then(res => {
                                console.log(res);
                                addToast({
                                    message: 'Write Permission Granted',
                                })
                            })
                    }}> EDIT </Button.Purple></>
            </Modal.Body>
        </Modal>
    );
}
