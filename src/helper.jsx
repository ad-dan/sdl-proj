const sk_key = '?token=sk_02f26f04747a432ea0ca9afb6b2456a0';

const registerUser = (uname, pass) => {
  const users = JSON.parse(localStorage.getItem('userdb')) || [];

  const newUser = {
    name: uname,
    pass: pass,
    balance: 10000,
    portfolio: {
      stocks: [],
      crypto: []
    },
    history: []
  };

  users.push(newUser);

  localStorage.setItem('userdb', JSON.stringify(users));

  return new Promise((resolve, reject) => resolve(newUser));
};

const loginUser = (uname, pass) => {
  const users = JSON.parse(localStorage.getItem('userdb'));

  const userExists = users.find(val => val.name === uname);

  const corrPass = userExists ? userExists.pass === pass : false;

  console.log({ uname, pass, userExists, corrPass });

  return new Promise((resolve, reject) => {
    if (corrPass) {
      resolve(userExists);
    } else {
      resolve('error');
    }
  });
};

const getStockList = async () => {
  const stockListRaw = await fetch(
    `https://cloud.iexapis.com/stable/ref-data/symbols${sk_key}`
  );
  const stockList = stockListRaw.json();

  return new Promise((resolve, reject) => {
    resolve(stockList);
  });
};

const getStockInfo = async ticker => {
  const stockQuoteRaw = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/quote${sk_key}`
  );
  const stockQuote = await stockQuoteRaw.json();
  const logoDataRaw = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/logo${sk_key}`
  );
  const logoData = await logoDataRaw.json();

  stockQuote.logoImgUrl = logoData.url;
  const stockHistoryRaw = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/chart/1y${sk_key}`
  );
  const stockHistory = await stockHistoryRaw.json();

  const stockDetailsRaw = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/company${sk_key}`
  );

  const stockDetails = await stockDetailsRaw.json();

  console.log(stockDetails);

  const address = `${stockDetails.city}, ${stockDetails.state}`;

  const desc = stockDetails.description;

  const website = stockDetails.website;

  stockQuote.address = address;
  stockQuote.desc = desc;

  stockQuote.website = website;

  stockQuote.history = stockHistory;
  return new Promise((resolve, reject) => {
    resolve(stockQuote);
  });
};

const getStockPrice = async ticker => {
  const stockPriceRaw = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/quote/latestPrice${sk_key}`
  );

  const stockPrice = stockPriceRaw.json();

  return new Promise((resolve, reject) => {
    resolve(stockPrice);
  });
};

const getCryptoList = async () => {
  const crypListRaw = await fetch(
    `https://cloud.iexapis.com/stable/ref-data/crypto/symbols${sk_key}`
  );
  const crypList = crypListRaw.json();

  return new Promise((resolve, reject) => {
    resolve(crypList);
  });
};

const getCryptoPrice = async ticker => {
  const crypPriceRaw = await fetch(
    `https://cloud.iexapis.com/stable/crypto/${ticker.toLowerCase()}/price${sk_key}`
  );
  const crypPrice = await crypPriceRaw.json();

  return new Promise((resolve, reject) => {
    resolve(parseFloat(crypPrice.price));
  });
};

const buyUserStock = async ({ uname, sym, symname, price, amount }) => {
  const totalCost = price * amount;
  const users = JSON.parse(localStorage.getItem('userdb'));
  const newTranscation = {
    symbol: sym,
    symname,
    price,
    amount,
    cost: totalCost,
    name: uname,
    type: 'BUY'
  };

  let modUser = null;
  const modUsers = users.map(user => {
    if (user.name !== uname) {
      return user;
    } else {
      let port = user.portfolio.stocks;
      console.log(port);
      const stockExists = port.find(block => block.sym === sym);
      if (!stockExists) {
        port.push({
          sym,
          amount,
          name: symname
        });
      } else {
        port = port.map(block => {
          if (block.sym === sym) {
            block.amount = parseFloat(block.amount) + parseFloat(amount);
            return block;
          } else {
            return block;
          }
        });
      }

      user.portfolio.stocks = port;
      user.history.push(newTranscation);

      user.balance -= totalCost;

      modUser = { ...user };

      return user;
    }
  });

  const blockHistory = JSON.parse(localStorage.getItem('transcations')) || [];
  blockHistory.push(newTranscation);

  localStorage.setItem('userdb', JSON.stringify(modUsers));
  localStorage.setItem('transcations', JSON.stringify(blockHistory));
  localStorage.setItem('currUser', JSON.stringify(modUser));

  return new Promise((resolve, reject) => resolve(modUser));
};

const sellUserStock = async ({ uname, sym, symname, price, amount }) => {
  let totalCost = price * amount;
  const users = JSON.parse(localStorage.getItem('userdb'));
  const newTranscation = {
    symbol: sym,
    symname,
    price,
    amount,
    cost: totalCost,
    name: uname,
    type: 'SELL'
  };

  let modUser = {};
  const moUser = users.map(us => {
    if (us.name !== uname) return us;
    else {
      let port = us.portfolio.stocks;
      console.log(port);
      port = port.map(block => {
        if (block.sym === sym) {
          if (amount >= block.amount) {
            totalCost = block.amount * price;
            block.amount = 0;
          } else {
            block.amount -= amount;
          }
        }
        return block;
      });

      us.balance += totalCost;

      port = port.filter(block => block.amount > 0);

      us.history.push(newTranscation);

      us.portfolio.stocks = port;

      modUser = { ...us };

      return us;
    }
  });

  const blockHistory = JSON.parse(localStorage.getItem('transcations')) || [];
  blockHistory.push(newTranscation);

  localStorage.setItem('userdb', JSON.stringify(moUser));
  localStorage.setItem('transcations', JSON.stringify(blockHistory));
  localStorage.setItem('currUser', JSON.stringify(modUser));
  return new Promise((resolve, reject) => resolve(modUser));
};
const buyUserCrypto = ({ uname, sym, symname, price, amount }) => {
  const totalCost = price * amount;
  const users = JSON.parse(localStorage.getItem('userdb'));
  const newTranscation = {
    symbol: sym,
    symname,
    price,
    amount,
    cost: totalCost,
    name: uname,
    type: 'CRYPTO_BUY'
  };

  let modUser = null;
  const modUsers = users.map(user => {
    if (user.name !== uname) {
      return user;
    } else {
      let port = user.portfolio.crypto;
      console.log(port);
      const stockExists = port.find(block => block.sym === sym);
      if (!stockExists) {
        port.push({
          sym,
          amount,
          name: symname
        });
      } else {
        port = port.map(block => {
          if (block.sym === sym) {
            block.amount = parseFloat(block.amount) + parseFloat(amount);
            return block;
          } else {
            return block;
          }
        });
      }

      user.portfolio.crypto = port;
      user.history.push(newTranscation);

      user.balance -= totalCost;

      modUser = { ...user };

      return user;
    }
  });

  const blockHistory = JSON.parse(localStorage.getItem('transcations')) || [];
  blockHistory.push(newTranscation);

  localStorage.setItem('userdb', JSON.stringify(modUsers));
  localStorage.setItem('transcations', JSON.stringify(blockHistory));
  localStorage.setItem('currUser', JSON.stringify(modUser));
  return new Promise((resolve, reject) => resolve(modUser));
};
const logoutUser = () => {
  localStorage.removeItem('currUser');
};
const sellUserCrypto = async ({ uname, sym, symname, price, amount }) => {
  let totalCost = price * amount;
  const users = JSON.parse(localStorage.getItem('userdb'));
  const newTranscation = {
    symbol: sym,
    symname,
    price,
    amount,
    cost: totalCost,
    name: uname,
    type: 'SELL_CRYPTO'
  };

  let modUser = {};
  const modUsers = users.map(us => {
    if (us.name !== uname) return us;
    else {
      let port = us.portfolio.crypto;
      console.log(port);
      port = port.map(block => {
        if (block.sym === sym) {
          if (amount >= block.amount) {
            totalCost = block.amount * price;
            block.amount = 0;
          } else {
            block.amount -= amount;
          }
        }
        return block;
      });

      us.balance += totalCost;

      port = port.filter(block => block.amount > 0);

      us.history.push(newTranscation);

      us.portfolio.crypto = port;

      modUser = { ...us };

      return us;
    }
  });

  const blockHistory = JSON.parse(localStorage.getItem('transcations')) || [];
  blockHistory.push(newTranscation);

  localStorage.setItem('userdb', JSON.stringify(modUsers));
  localStorage.setItem('transcations', JSON.stringify(blockHistory));
  localStorage.setItem('currUser', JSON.stringify(modUser));
  return new Promise((resolve, reject) => resolve(modUser));
};

const ex = {
  loginUser,
  registerUser,
  sellUserStock,
  buyUserStock,
  getCryptoList,
  getStockInfo,
  getStockList,
  getStockPrice,
  getCryptoPrice,
  buyUserCrypto,
  sellUserCrypto,
  logoutUser
};

export default ex;
