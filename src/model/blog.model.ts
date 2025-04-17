import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(Controller.Blog)
export class Blog extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string = "";

    @Column({ nullable: true })
    content: string | null = null; // URL or path to content file (e.g., Markdown, HTML)

    @Column()
    author: string = "";

    @Column("simple-array", { nullable: true })
    tags: string[] = [];

    @Column({ default: false })
    isPublished: boolean = false;

    @Column({ type: "timestamp", nullable: true })
    publishedAt: Date | null = null;

    @Column({ nullable: true })
    thumbnailUrl: string | null = null;

    @Column("simple-array", { nullable: true })
    imageUrls: string[] = [];

    @Column({ default: false })
    isDeleted: boolean = false;
}
