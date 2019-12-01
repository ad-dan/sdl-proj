import React from 'react';
import helper from './helper';

export default class BuyStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cryptoList: [],
      currCrypto: null,
      currCryptoPrice: 0,
      currCrytpoAmount: 0,
      userdetails: null
    };
  }
  componentDidMount() {
    helper.getCryptoList().then(data => {
      const userdetails = JSON.parse(localStorage.getItem('currUser'));
      this.setState({
        cryptoList: data,
        userdetails
      });
    });
  }

  handleCryptSelect = crypt => {
    helper.getCryptoPrice(crypt.symbol).then(cryptPrice => {
      this.setState({
        currCrypto: crypt,
        currCryptoPrice: cryptPrice
      });
    });
  };

  handleCryptBuy = () => {
    const transcationData = {
      uname: this.state.userdetails.name,
      sym: this.state.currCrypto.symbol,
      symname: this.state.currCrypto.name,
      price: this.state.currCryptoPrice,
      amount: this.state.currCrytpoAmount
    };

    helper.buyUserCrypto(transcationData).then(data => {
      this.setState({
        currCrypto: null
      });
    });
  };

  render() {
    const cryptDivs = this.state.cryptoList.map(block => {
      return (
        <div
          key={block.symbol}
          className="shadow w-64 m-4 px-4 py-4 pl-8 text-left rounded-sm border-l-4 border-purple-400"
        >
          <div>
            <div className="font-bold text-xl">{block.symbol}</div>
            <div className="text-sm text-gray-700">{block.name}</div>
          </div>
          <div
            onClick={() => this.handleCryptSelect(block)}
            className="bg-purple-300  px-4 w-16 rounded-full mt-4 shadow uppercase cursor-pointer text-xs text-white text-center font-bold"
          >
            Buy
          </div>
        </div>
      );
    });

    return (
      <div>
        {this.state.currCrypto ? (
          <div
            className="fixed h-screen w-screen flex justify-center items-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div>
              <img
                src="/close-svg.svg"
                className="h-8 w-8 absolute right-0 top-0 mt-8 mr-8 cursor-pointer"
                alt=""
                onClick={() => {
                  this.setState({
                    currCrypto: null
                  });
                }}
              />
            </div>
            <div className="bg-white p-16 shadow-xl rounded">
              <div className="flex justify-around items-center">
                <div className="text-xl text-gray-900 mx-4">
                  {this.state.currCrypto.symbol}
                </div>
                <div className="text-xl text-gray-900 mx-4">
                  {this.state.currCrypto.name}
                </div>
                <div className="text-xl text-blue-400 font-bold mx-4">
                  {' '}
                  {this.state.currCryptoPrice}
                </div>
                <div>
                  <input
                    type="text"
                    value={this.state.currCrytpoAmount}
                    onChange={e => {
                      this.setState({
                        currCrytpoAmount: e.target.value
                      });
                    }}
                    className="bg-purple-100 px-4 py-2 w-16"
                  />
                </div>
              </div>
              <div className="flex justify-end items-center">
                <div className="text-xl font-bold mr-8">Total cost</div>
                <div className="text-xl font-bold text-green-400 w-32">
                  {(
                    parseFloat(this.state.currCryptoPrice) *
                    parseFloat(this.state.currCrytpoAmount)
                  ).toFixed(4) || ' '}
                </div>
              </div>
              <div>
                <div
                  className="w-64 px-4 py-2 bg-purple-700 text-white font-bold text-sm rounded-full shadow-md mx-auto mt-8 cursor-pointer"
                  onClick={this.handleCryptBuy}
                >
                  Buy
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="py-4 text-4xl font-bold">Buy Cryptocurrency</div>

        <div>
          <div className="container mx-auto flex flex-wrap justify-center">
            {cryptDivs}
          </div>
        </div>
      </div>
    );
  }
}
