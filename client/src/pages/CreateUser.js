import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    // Send POST request
    try {
      await axios.post('http://localhost:3000/users', {
        name,
        age: '13',
        email,
        password: 'red1234!'
      });
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
    </div>
  );
};

export default CreateUser;
