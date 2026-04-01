import React from 'react';
import Form from '../components/Form';

function Login() {
  return (
    <div className="min-h-screen">
      <Form route="token/" method="login" />
    </div>
  );
}

export default Login;