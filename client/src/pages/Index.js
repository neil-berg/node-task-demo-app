import React, { useState } from 'react';
import axios from 'axios';

const Index = () => {
  const [passwords, setPasswords] = useState([]);

  const getPasswords = async () => {
    // Get the passwords and store them in state
    const res = await axios.get('/api/passwords');
    setPasswords(Object.keys(res.data));
  };

  return (
    <div>
      <h2>Indepage</h2>
      <button onClick={getPasswords}>Get Passwords</button>
      {passwords.map((password, index) => (
        <p key={index}>{password}</p>
      ))}
    </div>
  );
};

export default Index;
