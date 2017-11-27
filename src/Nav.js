import React, { Component } from "react";
import {
  Link
} from 'react-router-dom'

class Nav extends Component {
  render() {
    return (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <Link to="/" className="navbar-brand">React.js OIDC Sample</Link>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/tokens/access" className="nav-link">Access Token</Link>
            </li>
            <li className="nav-item">
              <Link to="/tokens/id" className="nav-link">ID Token</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
 
export default Nav;
