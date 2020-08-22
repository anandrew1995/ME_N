import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import RateLimit from 'express-rate-limit';

import config from './config';
import index from './routes/index';
import users from './routes/users';

const app = express();

const port = process.env.PORT || 3001;

//Connect to DB
mongoose.connect(config.database, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`Connected to ${config.database}`);
});

//Allow CORS
app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE'
}));

//Morgan logger
app.use(morgan('dev'));

//View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set a rate limit for requests (100 per min)
var limiter = new RateLimit({
    windowMs: 60*1000,
    max: 100,
    delayMs: 0
});
app.use(limiter);

app.use('/api', index);
app.use('/api/users', users);

app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    .json({
        error: {
            success: false,
            message: error.message
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

export default app;
