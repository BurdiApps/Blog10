const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use(session({
    secret: process.env.SESSION_SECRET || 'blog10secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Connected to DB and listening on ${port}`));
  }
});