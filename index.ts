import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as database from "./config/database";

dotenv.config();
database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.set("views", "./views");
app.set('view engine', 'pug');

app.get('/topics', (req: Request, res: Response) => {
    res.render("client/page/topics/index");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});