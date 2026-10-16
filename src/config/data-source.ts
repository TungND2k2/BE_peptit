// Load .env here: this module is imported (via routes/controllers) before app.ts calls dotenv.config()
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Admin } from '../model/admin.model';
import { Product } from '../model/product.model';
import { Blog } from '../model/blog.model';
import { Category } from '../model/categori.model';
import { Catalog } from '../model/catalog';
import { Accessory } from '../model/accessory.model';
import { Testimonial } from '../model/testimonial.model';
import { Media } from '../model/media.model';
import { ChatClick } from '../model/chatClick.model';

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
}

// Tạo một DataSource mới với thông tin kết nối MongoDB
const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI,  // URL kết nối MongoDB
    synchronize: true,  // Tự động đồng bộ hóa với các thay đổi entity
    logging: true,      // Kích hoạt logging trong quá trình thực thi
    entities: [Admin, Product, Blog, Category, Catalog, Accessory, Testimonial, Media, ChatClick] ,  // Các entity bạn đã định nghĩa
    useNewUrlParser: true,   // Được hỗ trợ trong TypeORM, nhưng không bắt buộc trong các phiên bản mới của Mongoose
    useUnifiedTopology: true, // Được hỗ trợ trong TypeORM, nhưng không bắt buộc trong các phiên bản mới của Mongoose
});

export default AppDataSource;
