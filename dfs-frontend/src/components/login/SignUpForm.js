import axios from "axios";
import React, { useState, useMemo, useContext } from "react";
import "./main.css";
import { useNavigate } from 'react-router-dom';
import creds from "../../creds";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

const backendUrl = creds.backendUrl;
const NAME_REGEX = RegExp(/^[A-Za-z]+$/);
const EMAIL_REGEX = RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const InvalidFormStyle='bg-red-100 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400';

const SignUpInputField = ({fieldName, labelName, inpType, touched, setTouched, errors,inputField, setInputField}) => {
  return (
    <div className="mb-4">
      <label for={fieldName}>{labelName}</label>
      <input type={inpType}
        id={fieldName}
        className={(touched && errors) ? InvalidFormStyle  : 'form-control'}
        value={inputField}
        onBlur={() => setTouched(true)}
        onChange={e => setInputField(e.target.value)} />
      {errors ? <p className="visible mt-2 text-sm text-red-600 dark:text-red-500">{errors}</p> : <p className="invisible mt-2 text-sm text-red-600 dark:text-red-500">{errors}</p>}
    </div>
  );
}

const validate = (emailTouched,emailInputField,passwordTouched,passwordInputField,firstNameInputField,firstNameTouched,lastNameTouched,lastNameInputField,institutionTouched,institutionInputField,designationTouched,designationInputField) => {
  const errors = {
    email: (emailTouched && !EMAIL_REGEX.test(emailInputField)) ? 'Invalid Email id' : '',
    password: (passwordTouched && passwordInputField.length < 6) ? 'Password should be atleast 6 characters long' : '',
    firstname: (firstNameTouched && firstNameInputField.length < 1) ? 'First name is required field' : ((firstNameTouched && !NAME_REGEX.test(firstNameInputField)) ? 'First name can only contain alphabets' : ''),
    lastname: (lastNameTouched && lastNameInputField.length < 1) ? 'Last name is required field' : ((lastNameTouched && !NAME_REGEX.test(lastNameInputField)) ? 'Last name can only contain alphabets' : ''),
    institution: (institutionTouched && institutionInputField.length < 1) ? 'Institution is required field' : '',
    designation: (designationTouched && designationInputField.length < 1) ? 'Designation is required field' : '',
  }
  return errors;
}

const checkForNullErrors = (errors) => {
  let error_message='',cnt=0;
  for (let key in errors) {
    if(errors[key]){
      cnt+=1;
      (cnt<2) ? error_message+=' '+key : error_message+=', '+key;
    }
  }
  return error_message;
}

export default function SignUpForm() {
  const navigate = useNavigate();

  const [firstNameInputField, setFirstNameInputField] = useState('');
  const [lastNameInputField, setLastNameInputField] = useState('');
  const [passwordInputField, setPasswordInputField] = useState('');
  const [emailInputField, setEmailInputField] = useState('');
  const [institutionInputField, setInstitutionInputField] = useState('');
  const [designationInputField, setDesignationInputField] = useState('');
  const [roleInputField, setRoleInputField] = useState('user');

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [institutionTouched, setInstitutionTouched] = useState(false);
  const [designationTouched, setDesignationTouched] = useState(false);

  const { addToast } = useContext(ToastContext);

  const errors = useMemo(() => validate(
                                  emailTouched,
                                  emailInputField,
                                  passwordTouched,
                                  passwordInputField,
                                  firstNameInputField,
                                  firstNameTouched,
                                  lastNameTouched,
                                  lastNameInputField,
                                  institutionTouched,
                                  institutionInputField,
                                  designationTouched,
                                  designationInputField
                                ),
                                [ emailTouched,
                                  emailInputField,
                                  passwordTouched,
                                  passwordInputField,
                                  firstNameInputField,
                                  firstNameTouched,
                                  lastNameTouched,
                                  lastNameInputField,
                                  institutionTouched,
                                  institutionInputField,
                                  designationTouched,
                                  designationInputField
                                ]);

  const handleSubmit = e => {
    e.preventDefault();
    const error_message=checkForNullErrors(errors);
    if (error_message) {
      addToast({
        message: "Fill" +error_message+" correctly",
        variant: TOAST_VARIANTS.WARNING
      });
    }
    else {
      const formFields={
        firstname: firstNameInputField,
        lastname: lastNameInputField,
        password: passwordInputField,
        email: emailInputField,
        institution: institutionInputField,
        designation: designationInputField,
        role: roleInputField
      }
      axios.post(backendUrl + 'register', formFields)
        .then(res => {
          addToast({
            message: "User Created Successfully, proceeding to sign in",
            variant: TOAST_VARIANTS.SUCCESS
          });
          return navigate('/sign-in')
        }).catch(err => {
          addToast({
            message: err.message + '\n' + err.response.data.message,
            variant: TOAST_VARIANTS.ERROR
          })
        })
    }
  }

  return (
    <div className="px-4 py-4 mx-4 my-4 border border-solid border-current rounded-lg bg-white shadow-sign-in">
      
      <form onSubmit={handleSubmit}>
        <SignUpInputField fieldName='firstname' labelName='First name' inpType='text' touched={firstNameTouched} setTouched={setFirstNameTouched} errors={errors.firstname} inputField={firstNameInputField} setInputField={setFirstNameInputField} />
        <SignUpInputField fieldName='lastname' labelName='Last name' inpType='text' touched={lastNameTouched} setTouched={setLastNameTouched} errors={errors.lastname} inputField={lastNameInputField} setInputField={setLastNameInputField} />
        <SignUpInputField fieldName='password' labelName='Password' inpType='password' touched={passwordTouched} setTouched={setPasswordTouched} errors={errors.password} inputField={passwordInputField} setInputField={setPasswordInputField} />
        <SignUpInputField fieldName='email' labelName='Email' inpType='email' touched={emailTouched} setTouched={setEmailTouched} errors={errors.email} inputField={emailInputField} setInputField={setEmailInputField} />
        <SignUpInputField fieldName='institution' labelName='Institution' inpType='text' touched={institutionTouched} setTouched={setInstitutionTouched} errors={errors.institution} inputField={institutionInputField} setInputField={setInstitutionInputField} />
        <SignUpInputField fieldName='designation' labelName='Designation' inpType='text' touched={designationTouched} setTouched={setDesignationTouched} errors={errors.designation} inputField={designationInputField} setInputField={setDesignationInputField} />
        
        <div className="mb-4">
          <label className="form-label" for="role">Role</label>
          <select id="role"
            name="role"
            value={roleInputField}
            onChange={e => setRoleInputField(e.target.value)}
            className="form-control">
            <option value="user">User</option>
            <option value="admin" disabled>Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="form2Example31" />
              <label className="form-check-label" for="form2Example31"> Remember me </label>
            </div>
          </div>

        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4">Sign Up</button>

        <div className="text-center">
          <p>Already a member? <a href="/sign-in">Login</a></p>
        </div>

      </form>
    </div>
  );
}