import mysql.connector
from flask_cors import CORS
from flask import *
app = Flask(__name__)
app.secret_key = '_5#y5p"F4Q8z\=\xec]/'
cors = CORS(app)
from datetime import date
from datetime import datetime
import time
import requests
app.config['CORS_HEADERS'] = 'Content-Type'

def connect():
    return mysql.connector.connect(host="localhost", user="root",  password="1212",  database="recharge" ,auth_plugin = 'mysql_native_password',port='3306')


@app.route('/mobilerecharge/login', methods=["POST"], strict_slashes=False)
def login():
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    d="SELECT USER_ID,ROLE,USER_NAME FROM users WHERE MOBILE='%s' AND PASSWORD='%s'"%(r['MOBILE'],r['PASSWORD'])
    print(d)
    mycursor.execute(d)
    id = mycursor.fetchone()
    mydb.close()
    if id is not None:
            return {"message":"success", "id":id[0], "role":id[1], "name":id[2]}
    else:
            return {"message":"user not found"}

@app.route('/mobilerecharge/viewdistributors', methods=["POST"], strict_slashes=False)
def viewdistributors():
    mydb = connect()
    mycursor = mydb.cursor()
    tx="select * from users where ROLE='Distributor' OR ROLE = 'Admin'"
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

# Retailer APIs
@app.route('/mobilerecharge/insertusers', methods=["POST"], strict_slashes=False)
def insertusers():
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    tx = 'select USER_ID from users order by USER_ID desc limit 1'
    mycursor.execute(tx)
    e = mycursor.fetchall()
    if len(e) == 0:
            eid = 1
    else:
            eid = int(e[0][0])+1
    if r['ROLE'] == "Retailer":
        d="insert into users(USER_ID,USER_NAME,ROLE,PASSWORD,MOBILE,EMAIL,BALANCE,REPORTING_TO,LOCATION) values ('%s','%s','%s','%s','%s','%s','%s','%s','%s')"%(eid,r['USER_NAME'],r['ROLE'],r['PASSWORD'],r['MOBILE'],r['EMAIL'],r['BALANCE'],r['REPORTING_TO'],r['LOCATION'])
    else:
        d="insert into users(USER_ID,USER_NAME,ROLE,PASSWORD,MOBILE,EMAIL,BALANCE,LOCATION) values ('%s','%s','%s','%s','%s','%s','%s','%s')"%(eid,r['USER_NAME'],r['ROLE'],r['PASSWORD'],r['MOBILE'],r['EMAIL'],r['BALANCE'],r['LOCATION'])
    mycursor = mydb.cursor()
    mycursor.execute(d)
    mydb.commit()
    mydb.close()
    return 'e'
    
@app.route('/mobilerecharge/updateusers', methods=["POST"], strict_slashes=False)
def updateusers():
    r=request.json
    mydb = connect()
    # d="update users set USER_NAME ='%s',PROFIT ='%s',PASSWORD ='%s',MOBILE ='%s',EMAIL ='%s',BALANCE ='%s',LOCATION ='%s' where USER_ID='%s'"%(r['USER_NAME'],r['PROFIT'],r['PASSWORD'],r['MOBILE'],r['EMAIL'],r['BALANCE'],r['LOCATION'],r['USER_ID'])
    d="update users set MOBILE ='%s',PASSWORD='%s' where USER_ID='%s'"%(r['MOBILE'],r['PASSWORD'],r['USER_ID'])
    mycursor = mydb.cursor()
    mycursor.execute(d)
    mydb.commit()
    mydb.close()
    return 's'
    
@app.route('/mobilerecharge/viewretailers', methods=["POST"], strict_slashes=False)
def viewretailers():
    mydb = connect()
    r = request.json
    mycursor = mydb.cursor()
    tx="select * from users where ROLE='Retailer' AND REPORTING_TO='{0}'".format(r['id'])
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/viewusers', methods=["GET","POST"], strict_slashes=False)
def viewusers():
    mydb = connect()
    mycursor = mydb.cursor()
    tx="select u.USER_ID, u.USER_NAME, u.ROLE, u.MOBILE, u.BALANCE,u.PASSWORD, u1.USER_NAME as REPORTING_TO from users u left join users u1 on u.REPORTING_TO = u1.USER_ID"
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/profile', methods=["POST"], strict_slashes=False)
def profile():
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    tx="SELECT u.*, u1.USER_NAME from users u join users u1 on u.REPORTING_TO = u1.USER_ID where u.USER_ID='{0}' ".format(r['id'])
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/deleteusers', methods=["POST"], strict_slashes=False)
def deleteusers():
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    tx="delete from users where USER_ID={0}".format(r['id'])
    mycursor.execute(tx)
    mydb.commit()
    mydb.close()
    return 's'
    
@app.route('/mobilerecharge/inserttransactions', methods=["POST"], strict_slashes=False)
def inserttransactions():
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    try:
        tx = 'select TRANSACTION_ID from transactions order by TRANSACTION_ID desc limit 1'
        mycursor.execute(tx)
        e = mycursor.fetchall()
        if len(e) == 0:
                eid = 1
        else:
                eid = int(e[0][0])+1
        print(r)
        d="insert into transactions(TRANSACTION_ID,SENDER_ID,RECEIVER_ID,PREVIOUS_BALANCE,AMOUNT,NEW_BALANCE)values ('%s','%s','%s','%s','%s','%s')"%(eid,r['SENDER_ID'],r['RECIEVER_ID'],r['PREVIOUS_BALANCE'],r['AMOUNT'],(int(r['PREVIOUS_BALANCE'])+int(r['AMOUNT'])))
        print(d)
        mycursor.execute(d)
        query = "UPDATE users SET BALANCE=BALANCE+%s WHERE USER_ID=%s"%(r['AMOUNT'],r['RECIEVER_ID'])
        mycursor.execute(query)
        query = "UPDATE users SET BALANCE=BALANCE-%s WHERE USER_ID=%s"%(r['AMOUNT'],r['SENDER_ID'])
        mycursor.execute(query)
    except Exception as e:
        print(e)
        return str(e)
    else:
        mydb.commit()
        mydb.close()
        return 'Success'



@app.route('/mobilerecharge/viewinitiators', methods=["POST"], strict_slashes=False)
def viewinitiators():
        mydb = connect()
        mycursor = mydb.cursor()
        tx="select * from users where ROLE='Retailer'"
        mycursor.execute(tx)
        retailers=mycursor.fetchall()
        tx="select * from users where ROLE='Distributor'"
        mycursor.execute(tx)
        distibutors=mycursor.fetchall()
        mydb.close()
        return json.dumps({'distributors':distibutors, 'retailers':retailers})

@app.route('/mobilerecharge/insertrechargehistory', methods=["POST"], strict_slashes=False)
def insertrechargehistory():
    api_token = "37bf05ea-c064-4877-91b1-247e2a1b7a3d";
    r=request.json
    mydb = connect()
    mycursor = mydb.cursor()
    
    try:
        tx = 'select RECHARGE_ID from rechargehistory order by RECHARGE_ID desc limit 1'
        mycursor.execute(tx)
        e = mycursor.fetchall()
        if len(e) == 0:
                eid = 1
        else:
                eid = int(e[0][0])+1

        networks = {1 : "Vodafone", 2 : "Airtel", 4 : "BSNL", 5 : "Jio", 6 : "DishTV",7 : "TataSky", 11 : "VideconApp", 12 : "SunDirect", 24 : "Airtel Mitra DTH"}
        
        is_stv = False
        if r['NETWORK'] == '4':
            if r['AMOUNT'][0] == '0':
                is_stv = False
            else:
                is_stv = True
        else:
            is_stv = False
            
        payload = {
            "api_token":api_token,
            "mobile_no":r['CUSTOMER_MOBILE'],
            "amount":r['AMOUNT'],
            "order_id":r['SOURCEREF'],
            "is_stv": is_stv,
            "company_id":r['NETWORK']
        }
        
        response = requests.post("https://mrobotics.in/api/recharge",data=payload)
        response = response.json()
        print(response)
        
        if response['status'] == "success":
            d="insert into rechargehistory(RECHARGE_ID,INITIATOR_ID,CUSTOMER_MOBILE,TYPE,AMOUNT,STATUS,NETWORK,INITIATOR_CURRENT_BALANCE,YOURREF,INITIATOR_NEW_BALANCE,TRANSACTION_ID)values ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"%(eid,r['INITIATOR_ID'],r['CUSTOMER_MOBILE'],r['TYPE'],r['AMOUNT'],"Success",networks.get(r['NETWORK']),r['BALANCE'],r['SOURCEREF'],(int(r['BALANCE'])-int(r['AMOUNT'])),response['tnx_id'])
            mycursor.execute(d)
            d = "UPDATE users SET BALANCE=BALANCE-'%s' WHERE USER_ID = '%s'"%(r['AMOUNT'],r['INITIATOR_ID'])
            mycursor.execute(d) 
            
        elif response['status'] == "failure":
            d="insert into rechargehistory(RECHARGE_ID,INITIATOR_ID,CUSTOMER_MOBILE,TYPE,AMOUNT,STATUS,NETWORK,INITIATOR_CURRENT_BALANCE,YOURREF,INITIATOR_NEW_BALANCE,TRANSACTION_ID)values ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"%(eid,r['INITIATOR_ID'],r['CUSTOMER_MOBILE'],r['TYPE'],r['AMOUNT'],"Failure",networks.get(r['NETWORK']),r['BALANCE'],r['SOURCEREF'],r['BALANCE'],"")
            mycursor.execute(d)
            mydb.commit()
            return 'Failure'
        
        elif response['status'] == "pending":
            d="insert into rechargehistory(RECHARGE_ID,INITIATOR_ID,CUSTOMER_MOBILE,TYPE,AMOUNT,STATUS,NETWORK,INITIATOR_CURRENT_BALANCE,YOURREF,INITIATOR_NEW_BALANCE,TRANSACTION_ID)values ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"%(eid,r['INITIATOR_ID'],r['CUSTOMER_MOBILE'],r['TYPE'],r['AMOUNT'],"Suspense",networks.get(r['NETWORK']),r['BALANCE'],r['SOURCEREF'],(int(r['BALANCE'])-int(r['AMOUNT'])),"")
            mycursor.execute(d)
            d = "UPDATE users SET BALANCE=BALANCE-'%s' WHERE USER_ID = '%s'"%(r['AMOUNT'],r['INITIATOR_ID'])
            mycursor.execute(d)
            
    except Exception as e:
        mydb.rollback()
        print(e)
        return str(e)
    else:
        mydb.commit()
        mydb.close()
        return 'Success'

@app.route('/mobilerecharge/paymentReports', methods=["POST"], strict_slashes=False)
def payment_reports():
    r = request.json
    mydb = connect()
    mycursor = mydb.cursor()
    date_value = date(int(r['YEAR']),int(r['MONTH']),int(r['DAY']))
    end_date_value = date(int(r['END_YEAR']),int(r['END_MONTH']),int(r['END_DAY']))
    tx="select t.TRANSACTION_ID,t.PREVIOUS_BALANCE,t.AMOUNT,t.NEW_BALANCE,t.TRANSACTION_DATE,t.SENDER_ID,t.RECEIVER_ID,us.USER_NAME as SENDER_NAME, ur.USER_NAME as RECIPIENT, us.ROLE as SENDER, ur.ROLE as RECEIVER from transactions t join users us on us.USER_ID = t.SENDER_ID join users ur on ur.USER_ID = t.RECEIVER_ID where (t.SENDER_ID = '{0}' OR t.RECEIVER_ID = '{0}') AND DATE(t.TRANSACTION_DATE)>=DATE('{1}') AND DATE(t.TRANSACTION_DATE)<=DATE('{2}') order by t.TRANSACTION_ID DESC limit 10".format(r['id'],date_value,end_date_value)
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/accountstatement', methods=["POST"], strict_slashes=False)
def account_statement():
    r= request.json
    mydb = connect()
    cursor = mydb.cursor()
    date_value = date(int(r['YEAR']),int(r['MONTH']),int(r['DAY']))
    end_date_value = date(int(r['END_YEAR']),int(r['END_MONTH']),int(r['END_DAY']))
    query = "SELECT * FROM transactions t join users u on u.USER_ID = t.RECEIVER_ID where (SENDER_ID = '{0}' OR RECEIVER_ID = '{0}') AND DATE(t.TRANSACTION_DATE)>=DATE('{1}') AND DATE(t.TRANSACTION_DATE)<=DATE('{2}') order by TRANSACTION_ID DESC limit 10;".format(r['id'],date_value,end_date_value)
    cursor.execute(query)
    data = cursor.fetchall()
    complete_data = []
    for d in data:
        object = {}
        object['id'] = d[0]
        object['sender_id'] = d[1]
        object['receiver_name'] = d[9]
        object['receiver_id'] = d[2]
        object['previous_balance'] = d[3]
        object['amount'] = d[4]
        object['new_balance'] = d[5]
        object['transaction_date'] = d[7].strftime('%Y-%m-%d %H:%M:%S')
        object['type'] = ""
        object['network'] = ""
        object['yourref'] = ""
        object['status'] = ""
        object['transaction_id'] = ""
        complete_data.append(object)
    query = "SELECT * FROM rechargehistory WHERE INITIATOR_ID = '{0}' AND STATUS IN ('Success','Suspense','Requested','Failure') AND DATE(TRANSACTION_DATE)>=DATE('{1}') AND DATE(TRANSACTION_DATE)<=DATE('{2}') order by RECHARGE_ID DESC limit 10".format(r['id'],date_value,end_date_value)
    print(query)
    cursor.execute(query)
    data = cursor.fetchall()
    # print(data)
    for d in data:
        object = {}
        object['id'] = d[0]
        object['sender_id'] = d[1]
        object['receiver_id'] = d[2]
        object['receiver_name'] = d[2]
        object['previous_balance'] = d[9]
        object['amount'] = d[4]
        object['new_balance'] = d[10]
        object['transaction_date'] = d[5].strftime('%Y-%m-%d %H:%M:%S')
        object['type'] = d[3]
        object['network'] = d[6]
        object['yourref'] = d[12]
        object['status'] = d[11]
        object['transaction_id'] = d[14]
        complete_data.append(object)
    statement_data = sorted(complete_data, key=lambda x: x['transaction_date'],reverse=True)
    mydb.close()
    return json.dumps(statement_data)

@app.route('/mobilerecharge/successreport', methods=["POST"], strict_slashes=False)
def success_reports():
    r= request.json
    mydb = connect()
    mycursor = mydb.cursor()
    date_value = date(int(r['YEAR']),int(r['MONTH']),int(r['DAY']))
    end_date_value = date(int(r['END_YEAR']),int(r['END_MONTH']),int(r['END_DAY']))
    tx="select r.*, u.USER_NAME, u.ROLE,u.BALANCE from rechargehistory r JOIN users u on u.USER_ID = r.INITIATOR_ID WHERE r.STATUS='{0}' AND DATE(r.TRANSACTION_DATE)>=DATE('{1}') AND DATE(r.TRANSACTION_DATE)<=DATE('{3}') AND INITIATOR_ID = '{2}' order by r.RECHARGE_ID DESC limit 10;".format('Success',date_value,r['id'],end_date_value)
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)
    
@app.route('/mobilerecharge/failurereport', methods=["POST"], strict_slashes=False)
def failure_reports():
    r= request.json
    mydb = connect()
    mycursor = mydb.cursor()
    date_value = date(int(r['YEAR']),int(r['MONTH']),int(r['DAY']))
    end_date_value = date(int(r['END_YEAR']),int(r['END_MONTH']),int(r['END_DAY']))
    tx="select r.*, u.USER_NAME, u.ROLE,u.BALANCE from rechargehistory r JOIN users u on u.USER_ID = r.INITIATOR_ID WHERE r.STATUS='{0}' AND DATE(r.TRANSACTION_DATE)>=DATE('{1}') AND DATE(r.TRANSACTION_DATE)<=DATE('{3}') AND INITIATOR_ID = '{2}' order by r.RECHARGE_ID DESC limit 10;".format('Failure',date_value,r['id'],end_date_value)
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/suspensereport', methods=["POST"], strict_slashes=False)
def suspense_reports():
    r = request.json
    mydb = connect()
    mycursor = mydb.cursor()
    tx="SELECT r.*, u.USER_NAME, u.ROLE, u.BALANCE FROM rechargehistory r JOIN users u ON u.USER_ID = r.INITIATOR_ID WHERE (r.STATUS = '{0}' OR r.STATUS = '{1}') ORDER BY r.RECHARGE_ID DESC LIMIT 10;".format('Suspense','Requested')
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)
    
@app.route('/mobilerecharge/getBalance', methods=["POST"], strict_slashes=False)
def get_balance():
    r = request.json
    mydb = connect()
    mycursor = mydb.cursor()
    tx="SELECT BALANCE FROM users WHERE USER_ID='%s'"%(r['ID'])
    mycursor.execute(tx)
    e=mycursor.fetchall()
    mydb.close()
    return json.dumps(e)

@app.route('/mobilerecharge/updatereport', methods=["POST"], strict_slashes=False)
def update_report():
    mydb = connect()
    mycursor = mydb.cursor()
    r = request.json
    print(r)
    if r['status'] == 'Success':
        query = "UPDATE rechargehistory SET STATUS = 'Success', SET TRANNSACTION_ID = 'Manual' SET  WHERE RECHARGE_ID = {0}".format(r['ID'])
        mycursor.execute(query)
        d = "UPDATE users SET BALANCE=BALANCE-'%s' WHERE USER_ID = '%s'"%(r['amount'],r['INITIATOR_ID'])
        mycursor.execute(d) 
    elif r['status'] == 'Failure':
        query = "UPDATE rechargehistory SET STATUS = 'Failure' WHERE RECHARGE_ID = {0}".format(r['ID'])
        mycursor.execute(query)
        d = "UPDATE users SET BALANCE=BALANCE+'%s' WHERE USER_ID = '%s'"%(r['amount'],r['INITIATOR_ID'])
        mycursor.execute(d) 
    mydb.commit()
    return json.dumps({'message':'Success'})

@app.route('/mobilerecharge/dailyreport', methods=["POST"], strict_slashes=False)
def daily_report():
    mydb = connect()
    mycursor = mydb.cursor()
    tx="select r.*, u.USER_NAME, u.ROLE,u.BALANCE from rechargehistory r JOIN users u on u.USER_ID = r.INITIATOR_ID WHERE DATE(r.TRANSACTION_DATE)={0};".format((str(date.today())))
    mycursor.execute(tx)
    recharges=mycursor.fetchall()
    tx="select t.TRANSACTION_ID,t.PREVIOUS_BALANCE,t.AMOUNT,t.NEW_BALANCE,t.TRANSACTION_DATE,us.USER_NAME as SENDER_NAME, ur.USER_NAME as RECIPIENT, us.ROLE as SENDER, ur.ROLE as RECEIVER from transactions t join users us on us.USER_ID = t.SENDER_ID join users ur on ur.USER_ID = t.RECEIVER_ID WHERE DATE(t.TRANSACTION_DATE)={0};".format((str(date.today())))
    mycursor.execute(tx)
    payments=mycursor.fetchall()
    mydb.close()
    e={'recharges':recharges, 'payments':payments}
    return json.dumps(e)

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)