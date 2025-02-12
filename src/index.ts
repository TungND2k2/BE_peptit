import app from './app';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import AppDataSource from './config/data-source';

// Tải biến môi trường từ tệp .env
dotenv.config();

// Khởi động kết nối TypeORM
const startApp = async () => {
    try {
        // Kết nối đến MongoDB và khởi tạo DataSource
        await AppDataSource.initialize();
        console.log('MongoDB connected and TypeORM initialized');

        // Khởi động server
        const PORT = process.env.PORT || 3005;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error during DataSource initialization:', error);
        process.exit(1); // Nếu kết nối hoặc khởi tạo thất bại, dừng ứng dụng
    }
};

startApp();
 