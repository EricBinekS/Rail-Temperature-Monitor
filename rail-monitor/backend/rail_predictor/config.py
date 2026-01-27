# rail_predictor/config.py
class Config:
    INPUT_JSON_FILE = "data/coordenadas.json" 

    ID_COLUMN = "SB"
    LAT_COLUMN = "Lat Decimal"
    LON_COLUMN = "Long Decimal"

    API_BASE_URL = "https://api.open-meteo.com/v1/forecast"
    API_HOURLY_VARS = "temperature_2m,precipitation,weather_code,wind_speed_10m,direct_normal_irradiance"
    API_TIMEZONE = "America/Sao_Paulo"
    MAX_API_WORKERS = 10 
    
    RADIATION_TO_CELSIUS_FACTOR = 0.056
    SOLAR_ADJUSTMENT_CEILING = 20.0
    WIND_ADJUSTMENT_FACTOR = 8.5
    RAIN_ADDITION_CELSIUS = 1.5
    THERMAL_RETENTION_FACTOR = 0.6