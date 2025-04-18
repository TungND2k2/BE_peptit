import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity } from "typeorm";

export enum AccessoryType {
    BUTTONS = "button",
    THREAD = "thread",
    LACE = "lace",
}

@Entity(Controller.Accessory)
export class Accessory extends BaseEntity {
    @Column()
    name: string; // Tên phụ kiện (ví dụ: "Nút tròn nhỏ", "Chỉ cotton trắng", "Ren hoa văn")

    @Column()
    title: string; // Tiêu đề phụ kiện

    @Column()
    description: string; // Mô tả phụ kiện

    @Column()
    price: number; // Giá phụ kiện

    @Column()
    imageUrl: string; // URL hình ảnh phụ kiện

    @Column()
    stock: number; // Số lượng tồn kho

    @Column()
    isActive: boolean; // Trạng thái phụ kiện (còn hoạt động hay không)

    @Column({
        type: "enum",
        enum: AccessoryType,
        default: AccessoryType.BUTTONS,
    })
    type: AccessoryType; // Loại phụ kiện: Buttons, Thread, hoặc Lace

    @Column({ nullable: true })
    material?: string; // Chất liệu (ví dụ: nhựa, kim loại cho Buttons)

    @Column({ nullable: true })
    color?: string; // Màu sắc (ví dụ: trắng, đỏ cho Thread)

    @Column({ nullable: true })
    width?: number; // Chiều rộng (ví dụ: cho Lace, tính bằng cm hoặc mm)
}