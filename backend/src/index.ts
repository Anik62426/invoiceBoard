import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import userRouter from './Routes/user.route'
import campaignRouter from './Routes/campaign.route'
import adminRouter from './Routes/admin.route'
import path from 'path'


const app = express();

dotenv.config()

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadDir = path.join(__dirname, '../uploads');


app.use("/uploads", express.static(uploadDir));

app.get('/', (req, res) => {
    res.send("hello");
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/campaign', campaignRouter);
app.use('/api/v1/admin',adminRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
