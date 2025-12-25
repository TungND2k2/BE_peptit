import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity('testimonial')
export class Testimonial {
    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    imageUrl!: string;

    @Column({ nullable: true })
    customerName?: string;

    @Column({ nullable: true })
    content?: string;

    @Column({ nullable: true })
    rating?: number;

    @Column({ default: () => new Date() })
    createdAt!: Date;

    @Column({ default: () => new Date() })
    updatedAt!: Date;

    @Column({ default: false })
    isDeleted!: boolean;
}
