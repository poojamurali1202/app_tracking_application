// import React,{act, useState} from 'react'
// import './RegisterUser.css';

// import user_icon from '../Assets/person.png'
// import email_icon from '../Assets/email.png'
// import password_icon from '../Assets/password.png'

// const RegisterUser = () => {

//   const [action,setaction] = useState("Sign Up")

//   return (
//     <div className='container'>
//       <div className='header'>
//         <div className='text'>{action}</div>
//         <div className='underline'></div>
//       </div>
//       <div className='inputs'>
//   {action === "Sign Up" && (
//     <>
//       <div className='input'>
//         <img src={user_icon} alt="" />
//         <input type='text' placeholder='First Name' autoComplete='off'/>
//       </div>
//       <div className='input'>
//         <img src={user_icon} alt="" />
//         <input type='text' placeholder='Last Name' autoComplete='off'/>
//       </div>
//       <div className='input'>
//         <img src={email_icon} alt="" />
//         <input type='email' name = 'user-email' placeholder='Email' autoComplete='off'/>
//       </div>
//     </>
//   )}

//   {action === "Login" && (
//     <div className='input'>
//       <img src={user_icon} alt="" />
//       <input type='text' name= 'app_tracking username' placeholder='Username' autoComplete='off'/>
//     </div>
//   )}

//   <div className='input'>
//     <img src={password_icon} alt="" />
//     <input type='password' name = 'new-password' placeholder='Password' autoComplete='off'/>
//   </div>
// </div>
//       <div className='submit-container'>
//         <div className={action==="Login"?"submit gray":"submit"} onClick={() => {setaction("Sign Up")}}>Sign Up</div>
//         <div className={action==="Sign Up"?"submit gray":"submit"} onClick={() => {setaction("Login")}}>Login</div>
//       </div>
//     </div>
//   )
// }
