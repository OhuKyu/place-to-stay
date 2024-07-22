import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roomRouter from './routes/roomRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    next();
});

app.use(express.json({ limit: '10mb' }));

app.use('/user', userRouter);
app.use('/room', roomRouter);
app.get('/', (req, res) => res.json({ message: 'Xin chào đến với API của chúng em' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Không tìm thấy' }));

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Đã kết nối với MongoDB');
        app.listen(port, () => console.log(`Máy chủ đang lắng nghe trên cổng: ${port}`));
    } catch (error) {
        console.error('Lỗi kết nối với MongoDB:', error);
        process.exit(1);
    }
};

startServer();
