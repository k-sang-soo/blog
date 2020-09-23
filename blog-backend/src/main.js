require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

const { PORT, MONGO_URI } = process.env;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((e) => {
        console.error(e);
    });

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
    ctx.body = '홈';
});

router.get('/about/:name?', (ctx) => {
    const { name } = ctx.params;
    ctx.body = name ? `${name}의 소개` : '소개';
});

router.get('/posts', (ctx) => {
    const { id } = ctx.query;
    ctx.body = id ? `포스트 #${id}` : '포스트가 없습니다.';
});

router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});
