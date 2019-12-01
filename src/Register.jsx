import React from 'react';
import helper from './helper';
import { Redirect } from 'react-router-dom';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confpassword: '',
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

  changeConfPass = e => {
    e.preventDefault();
    this.setState({
      confpassword: e.target.value
    });
  };

  handleSub = () => {
    helper.registerUser(this.state.username, this.state.password).then(u => {
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
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <div>
          <div className="container mx-auto">
            <div className="py-4 my-4 text-4xl font-bold">Register</div>
          </div>
        </div>
        <div>
          <div className="container mx-auto">
            <div className="py-2 text-sm text-gray-500">
              Please enter your details
            </div>
            <div>
              <div>
                <div className="text-lg font-bold text-purple-600 py-2">
                  Username / Email
                </div>
                <div>
                  <input
                    value={this.state.username}
                    onChange={this.changeUN}
                    type="text"
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
                    value={this.state.password}
                    onChange={this.changePass}
                    type="password"
                    className="bg-blue-100 p-2 text-lg shadow-inner px-8 "
                  />
                </div>
              </div>
              <div>
                <div className="text-lg  font-bold text-purple-600 py-2">
                  Confirm Password
                </div>
                <div>
                  <input
                    type="password"
                    value={this.state.confpassword}
                    onChange={this.changeConfPass}
                    className="bg-blue-100 p-2 text-lg shadow-inner px-8 "
                  />
                </div>
              </div>
              <div
                className="bg-purple-700 shadow-xl rounded-lg font-bold text-sm text-white w-24 py-2 px-4 mx-auto my-8 cursor-pointer"
                onClick={this.handleSub}
              >
                Register
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
