import React from 'react'
import Form from '../components/Form'

function Login() {
  return (
    <div>
        <Form route='/api/token/' method="login"  />
        <h1>yy</h1>
    </div>
  )
}

export default Login