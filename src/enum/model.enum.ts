import { ObjectId } from "mongodb";
import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

export abstract class BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId;

    @CreateDateColumn() // Tự động lưu thời gian tạo
    createdAt: Date;

    @UpdateDateColumn() // Tự động lưu thời gian cập nhật
    updatedAt: Date;

    @Column({ default: "" })
    owner: string = "";

    @Column({ default: false })
    isDeleted: boolean = false;
}