from flask import *
import pymysql
import pymysql.cursors
import os
# Mpesa Payment Route 
import requests
import datetime
import base64
from requests.auth import HTTPBasicAuth

app = Flask(__name__)

app.config["UPLOAD_FOLDER"] ="static/images"

@app.route('/api/signup', methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    phone = request.form["phone"]
    password = request.form["password"]
    region = request.form["region"]

    # create db connection
    connection = pymysql.connect(host="localhost", user="root", password="", database="n")

    # initialize db connection using .cursor()
    cursor = connection.cursor()

    # sql query
    sql = "insert into users(username, email, phone, password, region) values (%s, %s, %s, %s)"

    data = (username, email, phone, password, region)

    # execute the query
    cursor.execute(sql, data)

    # save the changes
    connection.commit()

    return jsonify({"Sign up successful: Welcome to Smart Farming"})

@app.route("/api/signin", methods=["POST"])
def signin():
    username = request.form["username"]
    password = request.form["password"]

    connection = pymysql.connect(host="localhost", user="root", password="", database="")
    cursor=connection.cursor(pymysql.cursors.DictCursor)

    sql = "select user_id, username, email, phone from users where username = %s and password = %s"
    data = (username, password)

    cursor.execute(sql, data)
    
    if cursor.rowcount == 0:
        return jsonify({"message" : "Login failed. Invalid credentials"})
    else:
        user = cursor.fetchone()
        return jsonify ({
            "message" : "Login Successful",
            "user" : user
        })
    
@app.route('/api/add_crops', methods=['POST'])
def add_crops():
    crop_name = request.form["crop_name"]
    scientific_name = request.form["scientific_name"]
    crop_photo = request.form["crop_photo"]
    soil_type = request.form["soil_type"]
    pest_diseases = request.form["pests_diseases"]
    weather_conditions = request.form["weather_conditions"]

    connection = pymysql.connect(host="localhost", user="",password="", database="")
    cursor= connection.cursor(pymysql.cursors.DictCursor)

    sql = "insert into crops (crop_name, scientific_name, crop_photo, soil_type, pests_diseases, weather_conditions)"
    data = (crop_name, scientific_name, crop_photo, soil_type, pest_diseases, weather_conditions)

    cursor.execute(sql,data)
    connection.commit()
    
    return jsonify ({"Crops added successfully"})

@app.route('/api/get_crops', methods=["POST"])
def get_crops():
    connection = pymysql.connect(host="localhost", user="", password="", database="")
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    sql = "select * from crops"

    cursor.execute(sql)
    crops = cursor.fetchall
    return jsonify(crops)

@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():
    if request.method == 'POST':
        # Extract POST Values sent
        amount = request.form['amount']
        phone = request.form['phone']

        # Provide consumer_key and consumer_secret provided by safaricom
        consumer_key = "AMXuQITURo6gSGAX0FGNcDwBHpGPa3yWK0GZR2tSZdVoVU9a"
        consumer_secret = "8fpY1GfCNtE8zamrtZxIwkk0xwtVu6Uai08xv1qahX6yQNa5UH8TM8iPtTX62Evd"

        # Authenticate Yourself using above credentials to Safaricom Services, and Bearer Token this is used by safaricom for security identification purposes - Your are given Access
        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"  # AUTH URL
        # Provide your consumer_key and consumer_secret 
        response = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret))
        # Get response as Dictionary
        data = response.json()
        # Retrieve the Provide Token
        # Token allows you to proceed with the transaction
        access_token = "Bearer" + ' ' + data['access_token']

        #  GETTING THE PASSWORD
        timestamp = datetime.datetime.today().strftime('%Y%m%d%H%M%S')  # Current Time
        passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'  # Passkey(Safaricom Provided)
        business_short_code = "174379"  # Test Paybile (Safaricom Provided)
        # Combine above 3 Strings to get data variable
        data = business_short_code + passkey + timestamp
        # Encode to Base64
        encoded = base64.b64encode(data.encode())
        password = encoded.decode()

        # BODY OR PAYLOAD
        payload = {
            "BusinessShortCode": "174379",
            "Password":password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": "1",  # use 1 when testing
            "PartyA": phone,  # change to your number
            "PartyB": "174379",
            "PhoneNumber": phone,
            "CallBackURL": "https://coding.co.ke/api/confirm.php",
            "AccountReference": " Online",
            "TransactionDesc": "Payments for Products"
        }

        # POPULAING THE HTTP HEADER, PROVIDE THE TOKEN ISSUED EARLIER
        headers = {
            "Authorization": access_token,
            "Content-Type": "application/json"
        }

        # Specify STK Push  Trigger URL
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"  
        # Create a POST Request to above url, providing headers, payload 
        # Below triggers an STK Push to the phone number indicated in the payload and the amount.
        response = requests.post(url, json=payload, headers=headers)
        print(response.text) # 
        # Give a Response
        return jsonify({"message": "An MPESA Prompt has been sent to Your Phone, Please Check & Complete Payment"})



app.run(debug=True)