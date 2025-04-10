from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Database connection function
def get_db_connection():
    return pymysql.connect(host="localhost", user="root", password="", database="smart_farming", cursorclass=pymysql.cursors.DictCursor)

@app.route('/api/add_crops', methods=['POST'])
def add_crops():
    try:
        crop_name = request.form["crop_name"]
        scientific_name = request.form["scientific_name"]
        soil_type = request.form["soil_type"]
        pests_diseases = request.form["pests_diseases"]
        weather_conditions = request.form["weather_conditions"]
        
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "INSERT INTO crops (crop_name, scientific_name, soil_type, pests_diseases, weather_conditions) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (crop_name, scientific_name, soil_type, pests_diseases, weather_conditions))
        connection.commit()
        
        return jsonify({"message": "Crop added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/get_crops', methods=['GET'])
def get_crops():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM crops")
        crops = cursor.fetchall()
        return jsonify(crops)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
