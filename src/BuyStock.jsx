import React from 'react';
import helper from './helper';
import { Link } from 'react-router-dom';

export default class BuyStock extends React.Component {
  constructor() {
    super();
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    helper.getStockList().then(data => {
      this.setState({
        list: data
      });
    });
  }
  render() {
    const stockIntoAlpha = this.state.list.reduce((acc, val) => {
      const firstAlpha = val.symbol[0];
      if (acc[firstAlpha]) {
        acc[firstAlpha].push(val);
      } else {
        acc[firstAlpha] = [];
        acc[firstAlpha].push(val);
      }
      return acc;
    }, {});

    const displayDivs = Object.keys(stockIntoAlpha).map(alpha => {
      const stockDivs = stockIntoAlpha[alpha].map(stock => {
        return (
          <div
            key={stock.iexId}
            className="shadow w-64 m-4 px-4 py-4 pl-8 text-left rounded-sm border-l-4 border-purple-400"
          >
            <Link to={`/stock/${stock.symbol}`}>
              <div className="font-bold text-xl">{stock.symbol}</div>
              <div className="text-sm text-gray-700">{stock.name}</div>
              <div className="text-sm text-gray-700">{stock.exchange}</div>
            </Link>
          </div>
        );
      });

      return (
        <div key={alpha} id={`${alpha}-div`}>
          <div className="py-2 font-bold text-purple-900 text-3xl">{alpha}</div>
          <div className="flex flex-wrap justify-center">{stockDivs}</div>
        </div>
      );
    });

    return (
      <div>
        <div className="py-4 text-4xl font-bold">Buy stock</div>

        <div>
          <div className="container mx-auto">
            <div>
              <div className="flex flex-wrap justify-center">
                {Object.keys(stockIntoAlpha).map(val => {
                  return (
                    <div
                      className="shadow px-4 py-2 m-2 bg-purple-400 text-white rounded-25 rounded-lg"
                      key={'val' + val}
                    >
                      <a href={`#${val}-div`}>{val}</a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="container mx-auto ">{displayDivs}</div>
        </div>
      </div>
    );
  }
}
