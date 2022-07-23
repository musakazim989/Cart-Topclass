import React from "react"
import { Container, Button, Form, Alert } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

const Login = () => {
  let { search } = useLocation()
  let redirectUrl = new URLSearchParams(search)
  let redirect = redirectUrl ? redirectUrl : "/"

  return (
    <Container className="w-25 mt-5 login-form p-3">
      <Alert className="text-center" variant="primary">
        Login
      </Alert>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
        <br />
        <Form.Text className="text-muted">
          Don't have an account?{" "}
          <Link to={`/signup?rederect=${redirect}`}>Create Account</Link>
        </Form.Text>
      </Form>
    </Container>
  )
}

export default Login
