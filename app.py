import datetime as dt
import requests

BASE_URL = "http://api.openweathermap.org/data/2.5/weather?" # ? allows you to add more info on maybe the city of interest and API key
API_KEY =  "da332b532324f8d565bafa71121cbd87"
CITY = "Nairobi"

# converting kelvins into clsius and fahrenheint
def kelvin_to_celsius_fahrenheint(kelvin):
    celsius = kelvin - 273.15
    fahrenheint = celsius * (9/5) + 32
    return celsius, fahrenheint

# Final url
# appid = API key
# & is used to combine the parameters
# q is the city we are looking at
url = BASE_URL + "appid=" + API_KEY + "&q=" + CITY

# sending the request
response = requests.get(url).json()

# accessing the temp in kelvin from the openweathermap api
temp_kelvin =response["main"]["temp"]

# convert temp into celsius and fahrenheit
temp_celsius, temp_fahrenheit = kelvin_to_celsius_fahrenheint(temp_kelvin)

# feelslike is just the temp that it feels to be in the city but it is not the actual temp
feels_like_kelvin = response['main']['feels_like']
feels_like_celsius, feels_like_fahrenheit = kelvin_to_celsius_fahrenheint(feels_like_kelvin)

# humidity
humidity = response["main"]["humidity"]

# windspeed - access the speed of wind from json
wind_speed = response["wind"]['speed']

# description of the weather, cloudy or sunny etc
# the  weather is a list inside the JSON response from the OpenWeathermap api
description = response["weather"][0]['description']

# localtime=sunrise+timezone
# sys is a key that contains system-related information about the location, such as sunrise, sunset and country code
sunrise_time = dt.datetime.utcfromtimestamp (response['sys']["sunrise"] + response['timezone'])
sunset_time = dt.datetime.utcfromtimestamp (response['sys']["sunset"] + response['timezone'])

# print
print(f"Temperature in {CITY} : {temp_celsius:.2f} degrees celsius or {temp_fahrenheit:.2f} degree fahrenheit")
print(f"Temperature in {CITY} : {feels_like_celsius:.2f} degrees celsius or {feels_like_fahrenheit:.2f} degree fahrenheit")
print(f"Humidity in {CITY} : {humidity}%")
print(f"Wind speed in {CITY} : {wind_speed}m/s")
print(f"General Weather in {CITY} : {description}")
print(f"Sun rises in {CITY} at : {sunrise_time} local time.")
print(f"Sun sets in {CITY} at : {sunset_time} local time.")