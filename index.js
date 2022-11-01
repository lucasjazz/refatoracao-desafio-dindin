require('dotenv').config();

const express = require('express');
const rotas = require('./src/routes/routers')
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

app.use(rotas);

app.listen(process.env.PORT);