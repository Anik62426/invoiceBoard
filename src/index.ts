import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import userRouter from './Routes/user.route'
import campaignRouter from './Routes/campaign.route'
const app = express();

dotenv.config()
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello");
});

app.use('/api/v1/user', userRouter);

app.use('/api/v1/campaign',campaignRouter)





const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

