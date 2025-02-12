import { DataSource } from 'typeorm';
import { Admin } from '../model/admin.model';
import { Product } from '../model/product.model';
import { Blog } from '../model/blog.model';
import { Category } from '../model/categori.model';
import { Catalog } from '../model/catalog';

// Tạo một DataSource mới với thông tin kết nối MongoDB
const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI || "mongodb://ptt:password123@172.16.3.10/ptt",  // URL kết nối MongoDB
    synchronize: true,  // Tự động đồng bộ hóa với các thay đổi entity
    logging: true,      // Kích hoạt logging trong quá trình thực thi
    entities: [Admin, Product, Blog, Category, Catalog],  // Các entity bạn đã định nghĩa
    useNewUrlParser: true,   // Được hỗ trợ trong TypeORM, nhưng không bắt buộc trong các phiên bản mới của Mongoose
    useUnifiedTopology: true, // Được hỗ trợ trong TypeORM, nhưng không bắt buộc trong các phiên bản mới của Mongoose
});

export default AppDataSource;
