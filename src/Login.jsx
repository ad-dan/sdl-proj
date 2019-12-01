import React from 'react';
import helper from './helper';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: true
    };
  }

  changeUN = e => {
    e.preventDefault();

    this.setState({
      username: e.target.value
    });
  };

  changePass = e => {
    e.preventDefault();

    this.setState({
      password: e.target.value
    });
  };

  handleSub = () => {
    helper.loginUser(this.state.username, this.state.password).then(u => {
      this.setState(
        {
          loading: false
        },
        () => {
          this.props.changeUser(u);
        }
      );
    });
  };

  render() {
    if (!this.state.loading) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
        <div>
          <div className="container mx-auto">
            <div className="py-4 my-4 text-4xl font-bold">Login</div>
          </div>
        </div>
        <div>
          <div className="container mx-auto">
            <div className="py-2 text-sm text-gray-500">
              Please enter login details
            </div>
            <div>
              <div>
                <div className="text-lg font-bold text-purple-600 py-2">
                  Username / Email
                </div>
                <div>
                  <input
                    type="text"
                    value={this.state.username}
                    onChange={this.changeUN}
                    className="bg-blue-100 p-2 text-lg shadow-inner px-8"
                  />
                </div>
              </div>
              <div>
                <div className="text-lg  font-bold text-purple-600 py-2">
                  Password
                </div>
                <div>
                  <input
                    type="password"
                    value={this.state.password}
                    onChange={this.changePass}
                    className="bg-blue-100 p-2 text-lg shadow-inner px-8 "
                  />
                </div>
              </div>
              <div
                className="bg-purple-700 shadow-xl rounded-lg font-bold text-sm text-white w-24 py-2 px-4 mx-auto my-8 cursor-pointer"
                onClick={this.handleSub}
              >
                Login
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
