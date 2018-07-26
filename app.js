var createError = require('http-errors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/*
 * default json pattern 
 */
jsonPattern = require('./models/json/jsonPattern');
/*
 * use this to get common json response for all methods 
 */
jsonResponses = require('./models/json/jsonResponses');
/*
 * validations methods 
 */
validations = require('./models/validations/validations');
/*
 * all global variable in this module like string values.
 */
customConfig = require('./config/custom_config/customConfig');



const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://localhost/shop');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});


// Routes which should handle the request are here
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use("/user", userRoutes);

app.use((req,res,next) =>{
	
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error,req,res,next)=>{
	res.status(error.status || 500);
	res.json({
		error : error.message
		
	});
	
})

module.exports = app;