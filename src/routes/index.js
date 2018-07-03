import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import '../Layout.css';
import isAuthenticated from '../isAuthenticated';
import YaejiFinish from './YaejiFinish';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      ))
    }
  />
);

const Loading = () => <div>...loading</div>;

const AsyncHome = Loadable({
  loader: () => import('./Home'),
  loading: Loading,
});
const AsyncRegister = Loadable({
  loader: () => import('./Register'),
  loading: Loading,
});
const AsyncLogin = Loadable({
  loader: () => import('./Login'),
  loading: Loading,
});
const AsyncViewTeam = Loadable({
  loader: () => import('./ViewTeam'),
  loading: Loading,
});
const AsyncCreateTeam = Loadable({
  loader: () => import('./CreateTeam'),
  loading: Loading,
});
const AsyncCreateChatter = Loadable({
  loader: () => import('../containers/MessageContainer2'),
  loading: Loading,
})
export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={AsyncHome} />
      <Route path="/register" exact component={AsyncRegister} />
      <Route path="/login" exact component={AsyncLogin} />
      <Route path="/yaejifinish/:uuid?" exact component={YaejiFinish}/>
      <PrivateRoute path="/chatter/:channelId?/:artist?-:venue?-:date?" component={AsyncCreateChatter}/>
      <PrivateRoute path="/view-team/:teamId?/:channelId?" exact component={AsyncViewTeam} />
      <PrivateRoute path="/create-team" exact component={AsyncCreateTeam} />
    </Switch>
  </BrowserRouter>
);