/**
 * App instance file
 */

const express = require("express");
const helmet = require("helmet");
const xss = require('xss-clean');
const expressSanitizer = require('express-sanitizer');
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const { rateLimiter } = require("./middlewares/rate_limiter");
const Routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const { setCustomProps } = require("./utils/helpers");

// run express
const app = express();

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(expressSanitizer());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
const corsOption = {
	methods: ["GET", "POST", "PUT", "DELETE"],
	origin: config.validCors.split(","),
	optionSuccessStatus: 200,
	headers: ["Content-Type", "Authorization", "x-access-token"],
	// credentials: true,
	maxAge: 3600,
	preflightContinue: true,
};
app.use(cors(corsOption));
app.options("*", cors(corsOption));

// set ip
app.use(setCustomProps);

// limit number of request pper timing to api route
if (config.env === "production") {
	app.use("/v1", rateLimiter);
}

// when parent url is requested
app.get("/", (req, res, next) => {
	res.status(200).send("Please request our api at /v1");
});

// v1 api routes
app.use("/v1", Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	throw new ApiError(httpStatus.NOT_FOUND, "Link not found");
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// export app
module.exports = app;
