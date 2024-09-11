import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import models from './models';  // Import your Sequelize models



const app = express();

// Middleware
app.use(bodyParser.json());

app.set('models', models);

// Routes
app.use(express.json());
app.use('/api', routes);

export default app;
