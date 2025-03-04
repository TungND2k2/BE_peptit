import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity(Controller.Category)
export class Category extends BaseEntity {
    @Column()
    title: string = ""; // Tiêu đề bài viết

    @Column()
    name: string = ""; // Tiêu đề bài viết
}


