import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity(Controller.Product)
export class Product extends BaseEntity {
    @Column()
    name: string; // Tên sản phẩm

    @Column()
    title: string; // Tên sản phẩm

    @Column()
    idAdmin: string; // idAdmin

    @Column()
    description: string; // Mô tả sản phẩm

    @Column()
    price: number; // Giá sản phẩm

    @Column()
    imageUrl: string; // Giá sản phẩm

    @Column()
    stock: number; // Số lượng tồn kho

    @Column()
    idCategory: string; // Danh mục sản phẩm

    @Column()
    images: []; // Danh mục sản phẩm

    @Column()
    isActive: boolean; // Trạng thái sản phẩm (còn hoạt động hay không)

    @Column()
    attributes: any
}


