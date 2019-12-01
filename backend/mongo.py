'''
 /$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$  /$$$$$$  /$$      
|_  $$_/| $$$ | $$|__  $$__/|_  $$_/ /$$__  $$| $$      
  | $$  | $$$$| $$   | $$     | $$  | $$  \ $$| $$      
  | $$  | $$ $$ $$   | $$     | $$  | $$$$$$$$| $$      
  | $$  | $$  $$$$   | $$     | $$  | $$__  $$| $$      
  | $$  | $$\  $$$   | $$     | $$  | $$  | $$| $$      
 /$$$$$$| $$ \  $$   | $$    /$$$$$$| $$  | $$| $$$$$$$$
|______/|__/  \__/   |__/   |______/|__/  |__/|________/
                                                           
'''

from bson import json_util
from pymongo import MongoClient
from pprint import pprint
import json
import hashlib
from flask import Flask, request
from flask_cors import CORS
client = MongoClient('localhost', 27017)
db = client['aurea']  # database
aurea_cap = db.aurea_cap  # collection

app = Flask(__name__)
CORS(app)

'''
 /$$$$$$$  /$$$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$$$$$$ 
| $$__  $$| $$_____/ /$$__  $$|_  $$_/ /$$__  $$|__  $$__/| $$_____/| $$__  $$
| $$  \ $$| $$      | $$  \__/  | $$  | $$  \__/   | $$   | $$      | $$  \ $$
| $$$$$$$/| $$$$$   | $$ /$$$$  | $$  |  $$$$$$    | $$   | $$$$$   | $$$$$$$/
| $$__  $$| $$__/   | $$|_  $$  | $$   \____  $$   | $$   | $$__/   | $$__  $$
| $$  \ $$| $$      | $$  \ $$  | $$   /$$  \ $$   | $$   | $$      | $$  \ $$
| $$  | $$| $$$$$$$$|  $$$$$$/ /$$$$$$|  $$$$$$/   | $$   | $$$$$$$$| $$  | $$
|__/  |__/|________/ \______/ |______/ \______/    |__/   |________/|__/  |__/
                                                                                  
'''


@app.route('/register', methods=['POST'])
def Register():

    m = hashlib.md5()
    m.update(request.form['password'])

    hash_pass = m.hexdigest()

    user = {
        "user_name": request.form['username'],
        "password": hash_pass, "portfolio": [], "history": [],
        "balance": 10000
    }
    aurea_cap.insert_one(user)
    return 'Ok'


'''
 /$$        /$$$$$$   /$$$$$$  /$$$$$$ /$$   /$$
| $$       /$$__  $$ /$$__  $$|_  $$_/| $$$ | $$
| $$      | $$  \ $$| $$  \__/  | $$  | $$$$| $$
| $$      | $$  | $$| $$ /$$$$  | $$  | $$ $$ $$
| $$      | $$  | $$| $$|_  $$  | $$  | $$  $$$$
| $$      | $$  | $$| $$  \ $$  | $$  | $$\  $$$
| $$$$$$$$|  $$$$$$/|  $$$$$$/ /$$$$$$| $$ \  $$
|________/ \______/  \______/ |______/|__/  \__/    
'''


@app.route('/login', methods=['POST'])
def Login():

    m = hashlib.md5()
    m.update(request.form['password'])

    hash_pass = m.hexdigest()

    print(hash_pass)

    existing_user = aurea_cap.find_one(
        {"user_name": request.form['username'], "password": hash_pass})
    pprint(existing_user)

    if existing_user:
        l = dict(existing_user)
        return json.dumps(l, default=json_util.default)
    else:
        return ''


'''
 /$$   /$$ /$$$$$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$  /$$     /$$
| $$  | $$|_  $$_/ /$$__  $$|__  $$__//$$__  $$| $$__  $$|  $$   /$$/
| $$  | $$  | $$  | $$  \__/   | $$  | $$  \ $$| $$  \ $$ \  $$ /$$/ 
| $$$$$$$$  | $$  |  $$$$$$    | $$  | $$  | $$| $$$$$$$/  \  $$$$/  
| $$__  $$  | $$   \____  $$   | $$  | $$  | $$| $$__  $$   \  $$/   
| $$  | $$  | $$   /$$  \ $$   | $$  | $$  | $$| $$  \ $$    | $$    
| $$  | $$ /$$$$$$|  $$$$$$/   | $$  |  $$$$$$/| $$  | $$    | $$    
|__/  |__/|______/ \______/    |__/   \______/ |__/  |__/    |__/    
'''


@app.route('/history', methods=['POST'])
def History():
    user = aurea_cap.find_one({"user_name": request.form['username']})

    history_n = u'history'

    user_hist = list(user[history_n])

    return json.dumps(user_hist, default=json_util.default)


'''
 /$$$$$$$  /$$   /$$ /$$     /$$
| $$__  $$| $$  | $$|  $$   /$$/
| $$  \ $$| $$  | $$ \  $$ /$$/ 
| $$$$$$$ | $$  | $$  \  $$$$/  
| $$__  $$| $$  | $$   \  $$/   
| $$  \ $$| $$  | $$    | $$    
| $$$$$$$/|  $$$$$$/    | $$    
|_______/  \______/     |__/   
'''


@app.route('/buy', methods=['post'])
def Buy():
    user = aurea_cap.find_one({"user_name": request.form['username']})
    transcation = {"stock": request.form['stock_name'],
                   "quantity": request.form['stock_quantity'],
                   "purchase_price": request.form['stock_org_price']}
    port_n = u'portfolio'

    user_data = list(user[port_n])

    balance_n = u'balance'

    user_balance = int(user[balance_n])

    user_balance = user_balance - (int(request.form['stock_quantity']) *
                                   int(request.form['stock_org_price']))

    history_n = u'history'

    user_hist = list(user[history_n])

    user_hist.append(dict(transcation))

    port_n = u'portfolio'

    port_user = user[port_n]

    if user_balance < 0:
        return 'Not valid purchase'

    a = user_data.append(dict(transcation))

    strx = u'user_name'

    print(transcation)
    print(user_data)

    aurea_cap.update_one({"user_name": request.form['username']}, {
        "$set": {"portfolio": user_data, "balance": user_balance, "history": user_hist}})
    return 'Ok'


'''
  /$$$$$$  /$$$$$$$$ /$$       /$$      
 /$$__  $$| $$_____/| $$      | $$      
| $$  \__/| $$      | $$      | $$      
|  $$$$$$ | $$$$$   | $$      | $$      
 \____  $$| $$__/   | $$      | $$      
 /$$  \ $$| $$      | $$      | $$      
|  $$$$$$/| $$$$$$$$| $$$$$$$$| $$$$$$$$
 \______/ |________/|________/|________/
'''


@app.route('/sell', methods=['POST'])
def Sell():
    user_data = aurea_cap.find_one({'user_name': request.form['username']})

    transcation = {"stock": request.form['stock_name'],
                   "quantity": request.form['stock_quantity'], "sell_price": request.form['stock_price']}

    balance_n = u'balance'

    user_balance = int(user_data[balance_n])

    user_balance = user_balance + (int(request.form['stock_quantity'])
                                   * int(request.form['stock_price']))

    history_n = u'history'

    user_hist = list(user_data[history_n])

    user_hist.append(dict(transcation))

    aurea_cap.update_one({"user_name": request.form['username']}, {
                         "$set": {"balance": user_balance, "history": user_hist}})

    return 'ok'
