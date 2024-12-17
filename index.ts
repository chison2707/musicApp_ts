import express, { Express, Request, Response } from 'express';
const app: Express = express();
const port: number = 3000;

app.set("views", "./views");
app.set('view engine', 'pug');

app.get('/topics', (req: Request, res: Response) => {
    res.render("client/page/topics/index");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});