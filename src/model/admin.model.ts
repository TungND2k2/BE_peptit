import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity(Controller.Admin)
export class Admin extends BaseEntity {
    @Column()
    username: string = ""; // Tên người dùng (username)

    @Column()
    email: string = ""; // Email của người dùng

    @Column()
    password: string = ""; // Mật khẩu người dùng

    @Column()
    role: string = ""; // Quyền của người dùng (ví dụ: admin, editor, viewer)

    @Column()
    isActive: boolean = true; // Trạng thái hoạt động của người dùng (có hoạt động hay không)

    @Column()
    lastLogin: Date = new Date(); // Lần đăng nhập gần nhất
}


