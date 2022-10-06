import express from 'express';
import dotenv from 'dotenv';
import CompositionRoot from './CompositionRoot';

dotenv.config();
CompositionRoot.configure();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', CompositionRoot.authRouter());

app.listen(port, () => console.log(`Listening port ${port}`));
