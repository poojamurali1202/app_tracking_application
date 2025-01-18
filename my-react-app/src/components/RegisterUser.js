import React, { useState } from 'react';
import './RegisterUser.css';
import { useNavigate } from 'react-router-dom';


import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const RegisterUser = () => {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  });

  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password } = formData;
  
    // Validation: Ensure all fields are filled
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill out all fields before signing up.');
      return;
    }
  
    const apiUrl = "http://127.0.0.1:1234/application/user_service/user_signup/";
  
    const payload = {
      firstName,
      lastName,
      email,
      password,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`Signup successful!`);
        console.log('Response:', data);
  
        // Clear all fields after successful signup
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: ''
        });
      } else {
        const error = await response.json();
        alert(`Signup failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleLogin = async () => {
    const { username, password } = formData;
  
    // Validation: Ensure both username and password are provided
    if (!username || !password) {
      alert('Please fill out both Username and Password fields.');
      return;
    }
  
    const apiUrl = "http://127.0.0.1:1234/application/jwt_token/api/token/";
  
    const payload = {
      username,
      password,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`Login successful!`);
        console.log('Response:', data);
        const saveToken = (token) => {
          localStorage.setItem('token', data.access);
        };
        const saveAdminStatus = (isAdmin) => {
          localStorage.setItem('is_admin', data.isadmin);
        };
        
        data.isadmin = 0
        // Call this function after receiving the token
        saveToken('your_jwt_token_here');
        saveAdminStatus(data.is_admin);
  
        // Clear all fields after successful login
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: ''
        });

        if (data.is_admin === 1) {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.detail}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === "Sign Up" && (
          <>
            <div className='input'>
              <img src={user_icon} alt="" />
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete='off'
              />
            </div>
            <div className='input'>
              <img src={user_icon} alt="" />
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete='off'
              />
            </div>
            <div className='input'>
              <img src={email_icon} alt="" />
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleInputChange}
                autoComplete='off'
              />
            </div>
          </>
        )}

        {action === "Login" && (
          <div className='input'>
            <img src={user_icon} alt="" />
            <input
              type='text'
              name='username'
              placeholder='Username'
              value={formData.username}
              onChange={handleInputChange}
              autoComplete='off'
            />
          </div>
        )}

        <div className='input'>
          <img src={password_icon} alt="" />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleInputChange}
            autoComplete='off'
          />
        </div>
      </div>
      <div className='submit-container'>
        <div
          className='submit'
          onClick={() => {
            setAction("Sign Up");
            handleSignup();
          }}
        >
          Sign Up
        </div>
        <div
          className='submit'
          onClick={() => {
            setAction("Login");
            handleLogin();
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

