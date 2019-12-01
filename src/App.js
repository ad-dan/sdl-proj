import React from 'react';
import logo from './logo.svg';
import './App.css';
import Landing from './LandingPage';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import BuyStock from './BuyStock';
import BuyCrypto from './BuyCrypto';
import Transcations from './Transcations';
import StockPage from './StockPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    try {
      const u = JSON.parse(localStorage.getItem('currUser'));

      if (u != 'error') {
        this.setState({
          user: u
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  changeUser = u => {
    this.setState(
      {
        user: u
      },
      () => {
        localStorage.setItem('currUser', JSON.stringify(u));
      }
    );
  };

  logoutUser = () => {
    this.setState(
      {
        user: null
      },
      () => {
        localStorage.removeItem('currUser');
      }
    );
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                if (this.state.user) {
                  return <Dashboard userdetails={this.state.user} />;
                } else {
                  return <Landing />;
                }
              }}
            ></Route>
            <Route path="/landing" component={Landing}></Route>
            <Route path="/admin" component={Transcations}></Route>
            <Route
              path="/login"
              component={() => <Login changeUser={this.changeUser} />}
            ></Route>
            <Route
              path="/register"
              component={() => <Register changeUser={this.changeUser} />}
            ></Route>
            <Route
              path="/dashboard"
              component={() => <Dashboard userdetails={this.state.user} />}
            />
            <Route path="/buy/stock" component={BuyStock}></Route>
            <Route path="/buy/crypto" component={BuyCrypto}></Route>
            <Route
              path="/stock/:sym"
              render={props => (
                <StockPage {...props} userdetails={this.state.user} />
              )}
            ></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
