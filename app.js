const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
let weatherBasicData = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
 
app.get('/', (req, res) => {
  res.render('index', { weather: weatherBasicData });
});
let query = 'pala'
app.post('/', (req, res) => {
  query = String(req.body.city);
  const apiKey = '3cf3c14d57d72670a3b79f30582e3f26';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=Metric&appid=${apiKey}`;

  https.get(url, (response) => {
    console.log(response.statusCode);
    let data = '';
 
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        const temp = weatherData?.main?.temp;
        const humidity = weatherData?.main?.humidity;
        const windSpeed = weatherData?.wind?.speed;
        const description = weatherData?.weather[0]?.description;
        const icon = weatherData?.weather[0]?.icon;
        const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        weatherBasicData = {
          city: query,
          temp: temp,
          humidity: humidity,
          wind: windSpeed,
          imageUrl: imageUrl,
        };

        res.redirect('/');
      } catch (error) {
        console.error('Error parsing weather data:', error);
        res.redirect('/');
      }
    });
  }).on('error', (error) => {
    console.error('Error retrieving weather data:', error);
    res.redirect('/');
  });
});

app.listen(3001, () => {
  console.log('Server is running on localhost:3000');
});
