import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as database from "./config/database";

import clientRoutes from './routes/client/index.route';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import adminRoutes from './routes/admin/index.route';
import { systemConfig } from './config/config';

dotenv.config();
database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set('view engine', 'pug');

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end TinyMCE

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

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

// client
clientRoutes(app);

// admin
adminRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});