import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { InputStyled } from '../components/Input';

import {AuthHeader, AuthLayout, GoButton} from '../components/AuthStyled';


class Register extends React.Component {

  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    desk: window.innerWidth > window.innerHeight,
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { password } = this.state;
    const username = this.state.username.toLowerCase();
    const email = username + '@raptor.pizza';
    const response = await this.props.mutate({
      variables: { username, email, password },
    });

    const { ok, errors } = response.data.register;

    if (ok) {
      this.props.history.push('/login');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }

    console.log(response);
  };

  onChange = (e) => {
    const { name, value } = e.target;
    // name = "email";
    this.setState({ [name]: value });
  };

  onKeyDown = (e) => {
    if (e.which===13 && e.target.name==="password") this.onSubmit();
    if (e.which===13 && e.target.name==="username") this.passwordInput.focus();
  }

  render() {
    const {
      usernameError, emailError, passwordError,
    } = this.state;

    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }
    
    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <AuthLayout>
      <AuthHeader>REGISTER</AuthHeader>
      <input onChange={this.onChange} name="username" style={InputStyled}/>  
      <span style={{margin:'0 auto',color:'red',marginTop:'-18px'}}>{usernameError}</span>
      <input type="password" ref={(input) => {this.passwordInput = input}} onKeyDown={this.onKeyDown} onChange={this.onChange} name="password" style={InputStyled}/>
      <span style={{margin:'0 auto',color:'red',marginTop:'-18px'}}>{passwordError}</span>
      <GoButton onClick={this.onSubmit}>GO</GoButton>
      <div onClick={()=>this.props.history.push('/login')}
      style={{textAlign:'center',padding:'40px',color:'#E6428C',cursor:'pointer'}}>LOGIN</div>
    </AuthLayout>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
