import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as database from "./config/database";

import clientRoutes from './routes/client/index.route';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();
database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"));

app.set("views", "./views");
app.set('view engine', 'pug');

// flash
app.use(cookieParser("GFDFGDFGDGDF"));
app.use(session({
    secret: 'GFDFGDFGDGDF',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
// end flash

clientRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});