const express = require('express');
const config = require('config');
const startUp = require('debug')('startup');
const morgan = require('morgan');
const app = express();
const carsRouter = require('./routes/cars');

app.use(express.json());
app.use('/api/cars', carsRouter);
app.use(morgan('tiny'))
startUp(config.get('name'));
startUp(config.get('purpose'));
startUp(app.get('env'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    startUp(`Listening on Port ${port}...`);
});