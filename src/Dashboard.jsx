import React from 'react';
import helper from './helper';
import { ResponsivePie } from '@nivo/pie';
import { Link, Redirect } from 'react-router-dom';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.userdetails);
    this.state = {
      userData: null,

      sellStock: null,
      sellPrice: 0,
      sellAmount: 0,
      isLoggedout: false,
      sellCrypto: null
    };
  }
  componentDidMount() {
    const userD =
      this.props.userdetails || JSON.parse(localStorage.getItem('currUser'));
    this.setState({
      userData: userD
    });
  }
  changeSellStock = stock => {
    helper.getStockPrice(stock.sym).then(data => {
      this.setState({
        sellStock: stock,
        sellPrice: data,
        sellAmount: stock.amount
      });
    });
  };
  changeSellCrypto = crypt => {
    helper.getCryptoPrice(crypt.sym).then(data => {
      this.setState({
        sellCrypto: crypt,
        sellPrice: data,
        sellAmount: crypt.amount
      });
    });
  };
  handleStockSale = () => {
    const transcationData = {
      uname: this.state.userData.name,
      sym: this.state.sellStock.sym,
      symname: this.state.sellStock.name,
      price: this.state.sellPrice,
      amount: this.state.sellAmount
    };
    helper.sellUserStock(transcationData).then(userdata => {
      this.setState({
        userData: userdata,
        sellStock: null
      });
    });
  };
  handleCryptoSale = () => {
    const transcationData = {
      uname: this.state.userData.name,
      sym: this.state.sellCrypto.sym,
      symname: this.state.sellCrypto.name,
      price: this.state.sellPrice,
      amount: this.state.sellAmount
    };
    helper.sellUserCrypto(transcationData).then(userdata => {
      this.setState({
        userData: userdata,
        sellCrypto: null
      });
    });
  };
  handleLogout = () => {
    helper.logoutUser();
    this.setState({
      isLoggedout: true
    });
  };
  render() {
    if (this.state.isLoggedout) {
      return <Redirect to="/landing" />;
    }
    const dataMap =
      this.state.userData &&
      this.state.userData.portfolio.stocks.map(d => {
        return {
          id: d.sym,
          label: d.name,
          value: d.amount
        };
      });

    const cryptoMap =
      this.state.userData &&
      this.state.userData.portfolio.crypto.map(c => {
        return {
          id: c.sym,
          label: c.name,
          value: c.amount
        };
      });

    console.log(dataMap);

    if (!this.state.userData) {
      return <div> Loading</div>;
    }

    return (
      <div>
        {this.state.sellStock && (
          <div
            className="fixed h-screen bg-blue-400 w-screen flex justify-center items-center"
            style={{ zIndex: 10000, background: 'rgba(0,0,0,0.5)' }}
          >
            <div>
              <img
                src="/close-svg.svg"
                className="h-8 w-8 absolute right-0 top-0 mt-8 mr-8 cursor-pointer"
                alt=""
                onClick={() => {
                  this.setState({
                    sellStock: null
                  });
                }}
              />
            </div>
            <div className="bg-white shadow-2xl py-4 px-16 rounded">
              <div className="font-bold text-purple-500 text-xl">
                {this.state.sellStock.name}
              </div>
              <div className="font-bold">{this.state.sellStock.amount}</div>
              <div>
                <div className="py-4 text-sm text-purple-300">
                  Enter amount to sell
                </div>
                <div>
                  <input
                    type="text"
                    value={this.state.sellAmount}
                    className="shadow-inner bg-purple-100 px-4 py-2 w-64 mx-auto"
                    onChange={e => {
                      const sanitized = e.target.value;

                      this.setState({
                        sellAmount: parseFloat(sanitized)
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center my-4">
                <div className="text-sm text-gray-500 mr-8">Total cost</div>
                <div className="text-sm font-bold text-purple-900">
                  {(this.state.sellAmount * this.state.sellPrice).toFixed(4)}
                </div>
              </div>
              <div
                className="bg-indigo-500 w-32 py-2 px-4 rounded-lg my-4 mx-auto cursor-pointer font-bold text-white"
                onClick={this.handleStockSale}
              >
                Sell stock
              </div>
            </div>
          </div>
        )}
        {this.state.sellCrypto && (
          <div
            className="fixed h-screen bg-blue-400 w-screen flex justify-center items-center"
            style={{ zIndex: 10000, background: 'rgba(0,0,0,0.5)' }}
          >
            <div>
              <img
                src="/close-svg.svg"
                className="h-8 w-8 absolute right-0 top-0 mt-8 mr-8 cursor-pointer"
                alt=""
                onClick={() => {
                  this.setState({
                    sellCrypto: null
                  });
                }}
              />
            </div>
            <div className="bg-white shadow-2xl py-4 px-16 rounded">
              <div className="font-bold text-purple-500 text-xl">
                {this.state.sellCrypto.name}
              </div>
              <div className="font-bold">{this.state.sellCrypto.amount}</div>
              <div>
                <div className="py-4 text-sm text-purple-300">
                  Enter amount to sell
                </div>
                <div>
                  <input
                    type="text"
                    className="shadow-inner bg-purple-100 px-4 py-2 w-64 mx-auto"
                    value={this.state.sellAmount}
                    onChange={e => {
                      const sanitized = e.target.value;

                      this.setState({
                        sellAmount: parseFloat(sanitized)
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center my-4">
                <div className="text-sm text-gray-500 mr-8">Total cost</div>
                <div className="text-sm font-bold text-purple-900">
                  {(this.state.sellAmount * this.state.sellPrice).toFixed(4)}
                </div>
              </div>
              <div
                className="bg-indigo-500 w-32 py-2 px-4 rounded-lg my-4 mx-auto cursor-pointer font-bold text-white"
                onClick={this.handleCryptoSale}
              >
                Sell Crypto
              </div>
            </div>
          </div>
        )}
        <div className=" text-4xl font-bold">Dashboard</div>

        <div>
          <div className="container mx-auto flex justify-center mb-8">
            <div className="rounded px-4 py-2 bg-blue-400 mx-4 text-white font-bold shadow-md cursor-pointer">
              <Link to="/buy/stock">Buy stocks</Link>
            </div>
            <div className="rounded px-4 py-2 bg-blue-400 mx-4 text-white font-bold shadow-md cursor-pointer">
              <Link to="/buy/crypto">Buy crypto</Link>
            </div>
            <div
              className="rounded px-4 py-2 bg-blue-400 mx-4 text-white font-bold shadow-md cursor-pointer"
              onClick={this.handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm ">Balance</div>
          <div className="py-2 font-bold text-xl">
            $ {parseFloat(this.state.userData.balance).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="container mx-auto flex justify-between mb-16">
            <div className="flex-1 ">
              <div className="text-2xl font-bold text-purple-700">Stocks</div>
              {this.state.userData.portfolio.stocks.map(stock => {
                return (
                  <div className="flex flex justify-between items-center shadow-md py-8 px-4">
                    <div className="font-bold">{stock.sym.toUpperCase()}</div>
                    <div className="font-bold text-gray-700">{stock.name}</div>
                    <div className="font-bold text-gray-700">
                      {stock.amount}
                    </div>
                    <div
                      onClick={() => this.changeSellStock(stock)}
                      style={{
                        background: 'linear-gradient(to top, #7f00ff, #e100ff)'
                      }}
                      className="bg-green-500 py-1 px-4 rounded-full shadow text-white font-bold cursor-pointer"
                    >
                      Sell
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-64 w-64">
                <ResponsivePie
                  colors={{ scheme: 'set2' }}
                  innerRadius={0.5}
                  padAngle={2}
                  cornerRadius={2}
                  data={dataMap}
                />
              </div>
            </div>
          </div>
          <div className="container mx-auto flex justify-between mb-8">
            <div className="flex-1 ">
              <div className="text-2xl font-bold text-purple-700">Crypto</div>
              {this.state.userData.portfolio.crypto.map(crypt => {
                return (
                  <div className="flex flex justify-between items-center shadow-md py-8 px-4">
                    <div className="font-bold">{crypt.sym}</div>
                    <div className="font-bold text-gray-700">{crypt.name}</div>
                    <div className="font-bold text-gray-700">
                      {crypt.amount}
                    </div>
                    <div
                      className="bg-green-500 py-1 px-4 rounded-full shadow text-white font-bold cursor-pointer"
                      style={{
                        background: 'linear-gradient(to top, #7f00ff, #e100ff)'
                      }}
                      onClick={() => this.changeSellCrypto(crypt)}
                    >
                      Sell
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-64 w-64">
                <ResponsivePie
                  innerRadius={0.5}
                  colors={{ scheme: 'set2' }}
                  padAngle={2}
                  cornerRadius={2}
                  data={cryptoMap}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
