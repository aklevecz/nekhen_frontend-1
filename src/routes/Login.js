import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
// import { Message, Form, Button, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { wsLink } from '../apollo';
import { InputStyled } from '../components/Input';  

import {AuthHeader, AuthLayout, GoButton} from '../components/AuthStyled';




class Login extends React.Component {
  constructor(props) {
    super(props);

    let desk = false;
    if(window.innerWidth>window.innerHeight) desk=true;
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
      desk,
    });


  }


  onSubmit = async () => {
    const { password } = this;
    const email = this.username.toLowerCase() + '@raptor.pizza';
    const response = await this.props.mutate({
      variables: { email, password },
    });

    console.log(response);

    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  };

  onKeyDown = (e) => {
    if (e.which===13 && e.target.name==="password") this.onSubmit();
    if (e.which===13 && e.target.name==="username") this.passwordInput.focus();
  }

  render() {
    const { desk, errors: { emailError, passwordError } } = this;
    console.log(desk);
    const errorList = [];

    if (emailError) {
      errorList.push(emailError);

    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <AuthLayout>
        <AuthHeader>LOGIN</AuthHeader>
        <input onChange={this.onChange} style={InputStyled}
                     onKeyDown={this.onKeyDown}
                     name="username"/>  
        {emailError && <span style={{margin:'0 auto',color:'red',marginTop:'-18px'}}>this username does not exist</span>}
        <input ref={(input) => {this.passwordInput = input}} style={InputStyled}
                     onKeyDown={this.onKeyDown}
                     onChange={this.onChange}
                     name="password" type="password"/>
        <span style={{margin:'0 auto',color:'red',marginTop:'-18px'}}>{passwordError}</span>
        <GoButton onClick={this.onSubmit}>GO</GoButton>
        <div onClick={()=>this.props.history.push('/register')}
        style={{textAlign:'center',padding:'40px',color:'#E6428C',cursor:'pointer'}}>REGISTER</div>
      </AuthLayout>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
