import React from 'react';
import helper from './helper';
import { ResponsiveLine } from '@nivo/line';
import regression from 'regression';
import numeral from 'numeral';
export default class StockPage extends React.Component {
  constructor(props) {
    super(props);
    const {
      match: { params }
    } = this.props;
    this.state = {
      stockData: null,
      sym: params.sym,
      loading: true,
      quantity: 0,
      userData: null,
      predictResult: '',
      regData: [],
      regressModel: null,
      regDate: ''
    };
  }

  handleStockSell = () => {
    const transcation = {
      uname: this.state.userData.name,
      sym: this.state.sym,
      symname: this.state.stockData.companyName,
      price: this.state.stockData.latestPrice,
      amount: this.state.quantity
    };

    helper.buyUserStock(transcation).then(data => {
      console.log(data);
    });
  };

  handleStockQuan = e => {
    e.preventDefault();

    this.setState({
      quantity: e.target.value
    });
  };

  componentDidMount() {
    helper.getStockInfo(this.state.sym).then(data => {
      console.log(data);

      const regData = data.history.map(block => {
        return [
          (Date.parse(block.date) - Date.parse('2017-01-01')) / 1000000000,
          block.close
        ];
      });

      console.log(regData);
      const regressModel = regression.linear(regData);

      this.setState({
        stockData: data,
        loading: false,
        userData: this.props.userdetails,
        regData,
        regressModel
      });
    });
  }
  handlePredClick = () => {
    const predDate = Date.parse(this.state.regDate) - Date.parse('2017-01-01');
    const res = this.state.regressModel.predict(predDate / 1000000000);
    console.log(res);

    this.setState({
      predictResult: res[1]
    });
  };

  render() {
    if (this.state.loading) {
      return <div>Loading</div>;
    }
    console.log(this.state.stockData.history);
    const graphPoints = this.state.stockData.history.map(hist => {
      return {
        x: hist.date,
        y: hist.close
      };
    });

    const graphP = {
      id: this.state.stockData.companyName,
      color: '#00dbde',
      data: graphPoints
    };

    console.log(graphP);
    return (
      <div>
        <div className="py-4 my-4 text-4xl font-bold">Stock page</div>
        <div>
          <div className="container mx-auto">
            <div className="flex">
              <div className="mr-16">
                <img
                  className="h-16 w-16"
                  src={`${this.state.stockData.logoImgUrl}`}
                  alt=""
                />
              </div>
              <div className="flex items-baseline pt-4 ">
                <div className="text-3xl font-bold text-purple-600">
                  {this.state.stockData.companyName}
                </div>
                <div className="text-3xl font-bold text-gray-400 ml-4">
                  {this.state.stockData.symbol}
                </div>
                <div className="text-3xl font-bold text-gray-300 ml-4">
                  {this.state.stockData.address}
                </div>
                <div className="text-xl text-blue-400 ml-4">
                  <a href={this.state.stockData.website} target="_blank">
                    {this.state.stockData.website}
                  </a>
                </div>
              </div>
            </div>
            <div className="container  text-justify my-8 px-16 py-8 border-l-4 border-purple-700 bg-purple-100 rounded shadow-lg text-purple-900 mb-16">
              {this.state.stockData.desc}
            </div>
            <div>
              <div className="font-bold font-grey-600 text-xl">Stats</div>
              <div className="flex justify-around items-center py-16">
                <div className="text-left font-bold shadow pl-8 pr-16 py-8 w-64">
                  <div className="text-xs font-bold  uppercase text-gray-600">
                    Market cap
                  </div>
                  <div className="text-2xl text-purple-700 uppercase">
                    {numeral(this.state.stockData.marketCap).format('$ 0.0 a')}
                  </div>{' '}
                </div>
                <div className="text-left font-bold shadow pl-8 pr-16 py-8 w-64">
                  <div className="text-xs uppercase text-gray-600">
                    Weekly High
                  </div>
                  <div className="text-2xl text-purple-700">
                    $ {this.state.stockData.week52High}
                  </div>{' '}
                </div>
                <div className="text-left font-bold shadow pl-8 pr-16 py-8 w-64">
                  <div className="text-xs uppercase text-gray-600 font-bold ">
                    Weekly Low
                  </div>
                  <div className="text-2xl text-purple-700">
                    $ {this.state.stockData.week52Low}
                  </div>
                </div>
              </div>

              <div className="text-left font-bold shadow pl-8 pr-16 py-8 w-64 mx-auto">
                <div className="text-xs uppercase text-gray-600">
                  Current Price
                </div>
                <div className="text-2xl text-purple-700">
                  $ {this.state.stockData.latestPrice}
                </div>{' '}
              </div>
            </div>

            <div className="container mx-auto">
              <div className="py-4 font-bold text-grey-500">Amount to buy</div>
              <div>
                <input
                  className="shadow-inner bg-purple-100 px-4 py-2 w-64 mx-auto"
                  type="text"
                  value={this.state.stockQuan}
                  onChange={this.handleStockQuan}
                />
              </div>
              <div className="font-bold text-xl text-purple-700 py-2">
                Total cost: ${' '}
                {(
                  this.state.stockData.latestPrice *
                  parseFloat(this.state.quantity)
                ).toFixed(4)
                  ? (
                      this.state.stockData.latestPrice *
                      parseFloat(this.state.quantity)
                    ).toFixed(4)
                  : ' '}
              </div>
              <div
                onClick={this.handleStockSell}
                className="btn bg-blue-500 w-32 cursor-pointer mx-auto py-2 shadow-2xl text-white rounded-full font-bold"
                style={{
                  background: 'linear-gradient(to bottom, #00d2ff, #3a7bd5)'
                }}
              >
                Buy
              </div>
            </div>
          </div>
          <div className="container mx-auto my-4">
            <div className="h-64" style={{ height: '400px' }}>
              <ResponsiveLine
                data={[graphP]}
                yScale={{
                  type: 'linear',
                  stacked: true,
                  min: 'auto',
                  max: 'auto'
                }}
                colors={{ scheme: 'category10' }}
                curve="natural"
                enableArea={true}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                margin={{ top: 50, right: 110, bottom: 10, left: 60 }}
              />
            </div>
          </div>
          <div className="container mx-auto py-8">
            <div className="font-bold text-2xl text-purple-900 py-4">
              Predict price using linear regression
            </div>
            <div>
              <input
                value={this.state.regDate}
                onChange={e => {
                  this.setState({
                    regDate: e.target.value,
                    predictResult: ''
                  });
                }}
                placeholder="YYYY-MM-DD"
                type="text"
                className="shadow-inner bg-purple-100 px-4 py-2 w-64 mx-auto my-4 "
              />
            </div>
            <div
              className="btn bg-blue-500 w-32 cursor-pointer mx-auto py-2 shadow-2xl text-white rounded-full font-bold"
              style={{
                background: 'linear-gradient(to top, #fc00ff, #00dbde)'
              }}
              onClick={this.handlePredClick}
            >
              Predict!
            </div>
            <div className="text-xl py-4 text-purple-800">
              $ {this.state.predictResult}
            </div>
            <div className="text-gray-800">
              Slope:{' '}
              {this.state.predictResult && this.state.regressModel.equation[0]}
            </div>
            <div className="text-gray-800">
              Y-Intercept:{' '}
              {this.state.predictResult && this.state.regressModel.equation[1]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
