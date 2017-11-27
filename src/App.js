import React from 'react'
import Nav from "./Nav";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

const Config = {
  'authorizationEndpoint': 'https://localhost:9031/as/authorization.oauth2',
  'tokenEndpoint': 'https://localhost:9031/as/token.oauth2',
  'clientId': 'oidc-sample',
  'adapterId': 'htmlform',
  'redirectUri': 'http://localhost:3000/authentication/callback',
  'logoutEndpoint': 'https://localhost:9031/idp/startSLO.ping',
  'scopes': 'openid%20profile'
};

const OidcValues = {
  'accessToken': 'unknown',
  'idToken': 'unknown'
};

const AuthStatus = {
  isAuthenticated: false
};

const UrlHelper = {
  getAuthUrl(authorizationEndpoint, originalUrl, nonce) {
    var encodedOriginal = encodeURI(originalUrl);

    return Config.authorizationEndpoint +
             '?response_type=id_token%20token' +
             '&client_id=' + Config.clientId +
             '&pfidpadapterid=' + Config.adapterId +
             '&scope=' + Config.scopes +
             '&redirect_uri=' + Config.redirectUri +
             '&nonce=' + nonce +
             '&state=' + encodedOriginal;
  },

  generateNonce(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },

  getParams(url) {
    var regex = /[#?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

    // eslint-disable-next-line
    while (match = regex.exec(url)) {
      params[match[1]] = match[2];
    }

    return params;
  }
};

const StorageHelper = {
  saveNonce(nonce) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("nonce", nonce);
    }
  },

  loadNonce() {
    if (typeof(Storage) !== "undefined") {
      var nonce = localStorage.getItem("nonce");

      localStorage.removeItem("nonce");

      return nonce;
    }
  }
};

const ReactOidcExample = () => (
  <Router>
    <div className="container">
      <Nav/>

      <Route path="/" exact component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/authentication/callback" component={AuthenticationCallback}/>

      <PrivateRoute path="/tokens/access" component={AccessToken}/>
      <PrivateRoute path="/tokens/id" component={IdToken}/>

    </div>
  </Router>
)

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    AuthStatus.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const Home = () => (
  <div className="mt">
    <h1>React.js OIDC Sample</h1>

    <p>
      This page is unprotected by Ping Federate.
    </p>
  </div>
);

const AccessToken = () => (
  <div className="mt">
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Access Token</h3>
      </div>
      <div className="panel-body">
        {OidcValues.accessToken}
      </div>
    </div>
  </div>
);

const IdToken = () => (
  <div className="mt">
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">ID Token</h3></div>
      <div className="panel-body">
        {OidcValues.idToken}
      </div>
    </div>
  </div>
);

class AuthenticationCallback extends React.Component {
  constructor(props) {
    super(props);
      this.redirectTo = '/';
  }

  componentWillMount() {
    // eslint-disable-next-line
    var storedNonce = StorageHelper.loadNonce();
    var params = UrlHelper.getParams(window.location.href);

    OidcValues.idToken = params['id_token'];
    OidcValues.accessToken = params['access_token'];

    this.redirectTo = decodeURIComponent(params['state']);

    // Set authenticated to true
    AuthStatus.isAuthenticated = true;
  }

  render() {
    return (
      <Redirect to={this.redirectTo} />
    )
  }
}

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  componentWillMount() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    var nonce = UrlHelper.generateNonce(32);
    StorageHelper.saveNonce(nonce);

    var authUrl = UrlHelper.getAuthUrl(Config.authorizationEndpoint, from.pathname, nonce);

    console.log('Redirecting: ' + authUrl);

    window.location = authUrl;
  }

  render() {
    return (
      <section>Redirecting to SSO...</section>
    )
  }
}

export default ReactOidcExample;
