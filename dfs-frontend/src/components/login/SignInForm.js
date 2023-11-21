import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, Navigate } from 'react-router-dom'
import "./main.css"
import { url } from "../../creds.js";

import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

// console.log("backend url = ",creds.backendUrl);



// class SignInForm extends Component {
//   constructor() {
//     super();
//     this.user = JSON.parse(localStorage.getItem('dfs-user'));


//     this.state = {
//       email: "",
//       password: "",
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event) {
//     let target = event.target;
//     let value = target.type === "checkbox" ? target.checked : target.value;
//     let name = target.name;

//     this.setState({
//       [name]: value,
//     });
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     console.log(this.state);
//     // console.log("backend url = ",backendUrl);
//     axios.post(backendUrl + 'login', this.state)
//     .then(res => {
//       // console.log("sign in part = ");
//       console.log(res);
//       // localStorage.setItem('dfs-user', JSON.stringify(res.data.data));
//       // window.location.reload();
//     }).catch(err => {
//       console.log(err)
//     })

//   }

//   render() {
//     return (
//       <>
//         <div className="data_sign-App text-center">
//           {(this.user && this.user.token) ? <Navigate to="/my-data" replace={true} /> : (
//           <div className="appForm">
//             <h1 className="data__pageHeading">
//               Sign In
//             </h1>
//             <div className="formCenter">
//               <form className="formFields" onSubmit={this.handleSubmit}>
//                 <div className="formField">
                  
//                   <input
//                     type="email"
//                     id="email"
//                     className="formFieldInput"
//                     placeholder="Enter your email"
//                     name="email"
//                     value={this.state.email}
//                     onChange={this.handleChange}
//                     style={{color:'black', width: '70%'}}
//                   />
//                 </div>

//                 <div className="formField">
//                   <input
//                     type="password"
//                     id="password"
//                     className="formFieldInput"
//                     placeholder="Enter your password"
//                     name="password"
//                     value={this.state.password}
//                     onChange={this.handleChange}
//                     style={{color:'black', width: '70%'}}
//                   />
//                 </div>

//                 <div className="formField">
//                     <button className="formFieldButton" style={{minWidth: '40%'}} onClick={e=>{
//                       axios.post(backendUrl + 'login', this.state)
//                       .then(res => {
//                         console.log(res);
//                         // alert("signed in as " + JSON.stringify(res.data.data));
//                         // alert("Signed in");
//                         localStorage.setItem('dfs-user', JSON.stringify(res.data.data));
//                         window.location.reload();
//                       }).catch(err => {
//                         console.log(err)
//                       })
//                     }}>Sign In</button>
//                 </div>
//                 <hr/>

//                 <div className="formField">
//                   <Link to="/sign-up" className="formFieldLink">
//                     <button className="google">Sign In With Google</button>
//                   </Link>
//                 </div>

//                 <br/>

//                 <div className="formField">
//                   <Link to="/sign-up" className="formFieldLink">
//                     Not registered yet? Sign up
//                   </Link>                
//                 </div>
//               </form>
//             </div>
//           </div>)}
//         </div>
//       </>
//     );
//   }
// }


export default function SignInForm(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const form_class = "px-4 py-4 mx-4 my-4 border border-solid border-current rounded-lg bg-white shadow-sign-in"

  const { addToast } = useContext(ToastContext);

  const submit = e => {
    e.preventDefault();
    console.log(email, password);
    axios.post(url + 'login', {email, password})
    .then(res => {
      console.log(res.data);
      addToast({
        message: "Login Successful",
        variant: TOAST_VARIANTS.SUCCESS
      });
      localStorage.setItem('dfs-user', JSON.stringify(res.data.data));
      setEmail('');
      setPassword('');
    }).catch(err => {
      if(err.message) {
        addToast({
          message: "SERVER ERROR",
          variant: TOAST_VARIANTS.WARNING
        });
    }
      else {
        addToast({
          message: "UNEXPECTED ERROR, PROBABLY SERVER UNAVAILABLE",
          variant: TOAST_VARIANTS.ERROR
        })
      }
    })
  }
  if(localStorage.getItem('dfs-user')) return <Navigate to="/my-data" replace={true} />
  return (
      <div className= {form_class} >
        <form onSubmit={submit}>
          <div className="form-outline mb-4">
            <label className="form-label text-base" for="form2Example1">Email address</label>
            <input type="email" id="form2Example1"  value={email}
              className={email === "" ? "form-control" : "form-control bg-slate-50"}
              onChange={e=>setEmail(e.target.value)} 
              />
          </div>
        
          <div className="form-outline mb-4">
            <label className="form-label text-base" for="form2Example2">Password</label>
            <input type="password" id="form2Example2" value={password}
            className={email === "" ? "form-control" : "form-control bg-slate-50"}
              onChange={e=>setPassword(e.target.value)}
              />
          </div>
        
          <div className="row mb-4">
            <div className="col d-flex justify-content-center">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="form2Example31"/>
                <label className="form-check-label" for="form2Example31"> Remember me </label>
              </div>
            </div>
        
            <div className="col">
              <a href="/not-available-yet">Forgot password?</a>
            </div>
          </div>
        
          <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>
        
          <div className="text-center">
            <p>Not a member? <a href="/sign-up">Register</a></p>
          </div>
        </form>
      </div>
    );
};