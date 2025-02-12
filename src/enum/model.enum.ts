import { ObjectIdColumn, ObjectId } from "typeorm";

export abstract class BaseEntity {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    owner: any = '';
    isDeleted: boolean = false;
    @ObjectIdColumn() _id: ObjectId;

}
