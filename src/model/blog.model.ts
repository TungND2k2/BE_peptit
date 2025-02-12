import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity(Controller.Blog)
export class Blog extends BaseEntity {

    @Column()
    title: string = ""; // Tiêu đề bài viết

    @Column()
    content: string= ""; // Nội dung bài viết

    @Column()
    author: string= ""; // Tên tác giả

    @Column()
    tags: string= ""; // Thẻ (tags) của bài viết

    @Column()
    isPublished: boolean= false; // Trạng thái xuất bản (đã xuất bản hay chưa)

    @Column()
    publishedAt: Date=new Date(); // Ngày xuất bản (nếu có)
}


