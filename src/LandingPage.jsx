import React from 'react';
import { Link } from 'react-router-dom';

export default class Landing extends React.Component {
  render() {
    return (
      <div>
        <div className="shadow">
          <div className="container mx-auto flex flex-row py-4 ">
            <div className="flex-1 flex items-center justify-center">
              <div className="font-bold">Aurea Capital</div>
            </div>
            <div className="flex-1 flex flex-row justify-center">
              <div className="rounded px-4 py-1 bg-blue-400 mx-4 text-white">
                <Link to="/register">Register</Link>
              </div>
              <div className="rounded px-4 py-1 bg-blue-400 mx-4 text-white">
                <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="py-10">
          <div className="container mx-auto py-16">
            <div className="flex justify-center items-center">
              <img src="/undraw_investing_7u74.svg" className="h-64" alt="" />
              <div className="ml-12 font-bold text-3xl text-gray-900">
                Invest with us & explore the stock market
              </div>
            </div>
          </div>
          <div className="container mx-auto py-16">
            <div className="flex justify-center items-center">
              <div className="ml-12 font-bold text-3xl text-gray-900">
                Over 8000+ stocks with realtime value from the cloud
              </div>{' '}
              <img
                src="/undraw_financial_data_es63.png"
                className="h-64"
                alt=""
              />
            </div>
          </div>
          <div className="container mx-auto py-16">
            <div className="flex justify-around items-center">
              <img
                src="/undraw_digital_currency_qpak.png"
                className="h-64"
                alt=""
              />
              <div className="font-bold text-3xl w-64 mx-auto text-gray-900">
                Hundreds of cryptocurrencies to invest in
              </div>{' '}
            </div>
          </div>
          <div className="container mx-auto py-16">
            <div className="flex justify-center items-center">
              <div className="ml-12 font-bold text-3xl text-gray-900">
                Predict stock values using linear regression
              </div>{' '}
              <img src="/undraw_finance_0bdk.png" className="h-64" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
