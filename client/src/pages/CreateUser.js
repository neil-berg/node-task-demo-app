import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [user, setUser] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    // Create new user in DB
    try {
      const res = await axios.post('/users', {
        name,
        age: '13',
        email,
        password: 'red1234!'
      });
      // Save JWT in local storage
      // Then query the token in local storage
      // upon further API calls
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={e => handleSubmit(e)}>
        <label htmlFor="name">
          Name:{' '}
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <button onClick={getUserDetails}>Get Details</button>
      <p>
        {user.name}, {user.email}
      </p>
    </div>
  );
};

export default CreateUser;
