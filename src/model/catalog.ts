import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity(Controller.Catalog)
export class Catalog extends BaseEntity {
    @Column()
    name: string; // Tên sản phẩm

    @Column()
    title: string; // Tên sản phẩm

    @Column()
    description: string; // Mô tả sản phẩm

    @Column()
    price: number; // Giá sản phẩm

    @Column()
    imageUrl: string; // Giá sản phẩm

    @Column()
    stock: number; // Số lượng tồn kho

    @Column()
    isActive: boolean; // Trạng thái sản phẩm (còn hoạt động hay không)
}


