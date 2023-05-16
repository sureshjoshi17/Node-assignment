const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser")

//connect to database
require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

//attach route to the app
const authRouter = require('./routes/authRoute')
app.use('/api/auth', authRouter);

//add swagger docs
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./apiDocs/swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const port = process.env.PORT || 8080
app.listen(port, () => console.log("App is running on port: ", port));

