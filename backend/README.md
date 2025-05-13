# Weather Forecast API

This is the backend API for the weather forecast application. It provides endpoints to fetch weather data from MongoDB.

## Setup

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Create a `.env` file with the following content:
   ```
   MONGO_URI=mongodb+srv://mystiopath:XVNflw4Myj3lQsdh@readings.gudpakc.mongodb.net/?retryWrites=true&w=majority&appName=readings
   PORT=5000
   ```
   Or run `node create-env.js` to generate it automatically

4. Seed the database: `npm run seed`
5. Start the server: `npm start` or `npm run dev` for development mode with nodemon

## API Endpoints

### Get All Weather Data
```
GET /api/weather
```
Returns all weather data records.

### Get Latest Weather Data
```
GET /api/weather/latest
```
Returns the most recent weather data record.

### Get Weather Data for a Specific Date
```
GET /api/weather/date/:date
```
Returns weather data for a specific date. The date parameter should be in the format YYYY-MM-DD.

Example: `/api/weather/date/2025-04-12`

### Get Weather Data for a Date Range
```
GET /api/weather/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Returns weather data for a specific date range.

Example: `/api/weather/range?startDate=2025-04-12&endDate=2025-04-14`

### Get Weather Data with Advanced Filtering
```
GET /api/weather/filter
```
Returns weather data based on various filter parameters.

Parameters:
- `minTemp`: Minimum temperature in Celsius
- `maxTemp`: Maximum temperature in Celsius
- `minHumidity`: Minimum humidity percentage
- `maxHumidity`: Maximum humidity percentage
- `minPrecipitation`: Minimum precipitation in mm
- `maxPrecipitation`: Maximum precipitation in mm
- `startDate`: Start date in YYYY-MM-DD format
- `endDate`: End date in YYYY-MM-DD format
- `limit`: Maximum number of records to return (default: 100)
- `sort`: Field to sort by, with optional direction (e.g., `temperature_2m_C:desc`)

Example: `/api/weather/filter?minTemp=20&maxHumidity=50&startDate=2025-04-12&sort=temperature_2m_C:desc&limit=10`

### Get Weather Statistics for a Date Range
```
GET /api/weather/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Returns aggregated statistics for the specified date range including average temperature, min/max temperature, average humidity, total precipitation, and record count.

Example: `/api/weather/stats?startDate=2025-04-12&endDate=2025-04-14`

### Get Hourly Weather Statistics for a Specific Date
```
GET /api/weather/hourly-stats/:date
```
Returns hourly aggregated statistics for the specified date including average temperature, average humidity, and total precipitation.

Example: `/api/weather/hourly-stats/2025-04-12`

### Get Weather Data by ID
```
GET /api/weather/:id
```
Returns a specific weather record by its MongoDB ID.

Example: `/api/weather/60d21b4667d0d8992e610c85`

### Add a New Weather Record
```
POST /api/weather
```
Adds a new weather record to the database.

Request body should contain all required fields:
```json
{
  "time": "2025-04-15T00:00",
  "temperature_2m_C": 17.7,
  "relative_humidity_2m_percent": 55.0,
  "dew_point_2m_C": 8.6,
  "apparent_temperature_C": 16.7,
  "precipitation_probability_percent": 0.0,
  "precipitation_mm": 0.0,
  "rain_mm": 0.0,
  "showers_mm": 0.0,
  "surface_pressure_hPa": 940.8,
  "visibility_m": 24140.0,
  "cloud_cover_high_percent": 0.0,
  "cloud_cover_mid_percent": 0.0,
  "cloud_cover_low_percent": 0.0
}
```

### Update a Weather Record
```
PUT /api/weather/:id
```
Updates an existing weather record by its MongoDB ID.

Request body should contain fields to update:
```json
{
  "temperature_2m_C": 18.5,
  "relative_humidity_2m_percent": 60.0
}
```

### Delete a Weather Record
```
DELETE /api/weather/:id
```
Deletes a weather record by its MongoDB ID.

Example: `/api/weather/60d21b4667d0d8992e610c85`

## Data Structure

Each weather record has the following structure:

```json
{
  "time": "2025-04-12T00:00",
  "temperature_2m_C": 17.7,
  "relative_humidity_2m_percent": 55.0,
  "dew_point_2m_C": 8.6,
  "apparent_temperature_C": 16.7,
  "precipitation_probability_percent": 0.0,
  "precipitation_mm": 0.0,
  "rain_mm": 0.0,
  "showers_mm": 0.0,
  "surface_pressure_hPa": 940.8,
  "visibility_m": 24140.0,
  "cloud_cover_high_percent": 0.0,
  "cloud_cover_mid_percent": 0.0,
  "cloud_cover_low_percent": 0.0
}
``` 