import '../styles/signup.css'
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    document.body.style.backgroundColor = isLogin ? '#ff6347' : '#87cefa';
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      console.log('Password reset email sent successfully');

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error sending password reset email:', errorCode, errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        alert('User logged in:', user);
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        console.log('User signed up:', user);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Authentication error:', errorCode, errorMessage);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6} className={`auth-form ${isLogin ? 'login' : 'signup'}`}>
          <h2 style={{textAlign: 'center'}}>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            {!isLogin && (
              <>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {isLogin && (
              <p onClick={handleForgotPassword} className="forgot-password">
                Forgot Password?
              </p>
            )}

            <Button variant="primary" type="submit">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>

            <p onClick={toggleForm} className="toggle-form">
              {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
