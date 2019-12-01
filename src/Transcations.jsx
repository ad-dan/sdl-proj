import React from 'react';

export default class Transcations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transcations: [],
      username: '',
      password: '',
      isVerified: false
    };
  }
  componentDidMount() {
    const transcations = JSON.parse(localStorage.getItem('transcations'));

    this.setState({
      transcations
    });
  }

  handleLogin = () => {
    if (this.state.username === 'root' && this.state.password === 'root') {
      this.setState({
        isVerified: true
      });
    }
  };

  render() {
    if (!this.state.isVerified) {
      return (
        <div>
          <div className="py-4 my-4 text-4xl font-bold">Transcations</div>
          <div>
            <div>
              <div className="text-lg  font-bold text-purple-600 py-2">
                {' '}
                Administrator id
              </div>
              <div>
                <input
                  value={this.state.username}
                  onChange={e => {
                    this.setState({
                      username: e.target.value
                    });
                  }}
                  type="text"
                  placeholder="Admin id"
                  className="bg-blue-100 p-2 text-lg shadow-inner px-8"
                />
              </div>
            </div>
            <div>
              <div className="text-lg  font-bold text-purple-600 py-2">
                Administrator password
              </div>
              <div>
                <input
                  type="password"
                  value={this.state.password}
                  onChange={e => {
                    this.setState({
                      password: e.target.value
                    });
                  }}
                  placeholder="Admin password"
                  className="bg-blue-100 p-2 text-lg shadow-inner px-8 "
                />
              </div>
            </div>
            <div>
              <div
                className="bg-purple-700 shadow-xl rounded-lg font-bold text-sm text-white w-24 py-2 px-4 mx-auto my-8 cursor-pointer"
                onClick={this.handleLogin}
              >
                Login
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container mx-auto">
          <div className="py-4 my-4 text-4xl font-bold">Admin Panel</div>

          <div className="flex justify-around items-center">
            <div className="py-4 px-8">
              <div className="font-bold text-4xl  text-purple-700">
                {this.state.transcations.length}
              </div>
              <div className="text-xs text-gray-700 font-black">
                Total transcations
              </div>
            </div>
            <div className="py-4 px-8">
              <div className="font-bold text-4xl text-purple-700">
                ${' '}
                {this.state.transcations
                  .reduce((acc, cur) => acc + cur.cost, 0)
                  .toFixed(4)}
              </div>
              <div className="text-xs text-gray-700 font-black">Value</div>
            </div>
          </div>
          <div className="container mx-auto my-16">
            <table className="table-auto w-full">
              <thead className="border-b-2 border-purple-300 ">
                <tr>
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4">Company</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Cost</th>
                </tr>
              </thead>
              <tbody>
                {this.state.transcations.map((block, i) => {
                  return (
                    <tr className={`${i % 2 && 'bg-purple-200'}`}>
                      <td className="py-4 text-sm">{block.name}</td>
                      <td className="py-4 text-sm">{block.type}</td>
                      <td className="py-4 text-sm">
                        {' '}
                        {block.symbol.toUpperCase()}
                      </td>
                      <td className="py-4 text-sm">{block.symname}</td>
                      <td className="py-4 text-sm">{block.amount}</td>
                      <td className="py-4 text-sm"> {block.price}</td>
                      <td className="py-4 text-sm">{block.cost.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}
