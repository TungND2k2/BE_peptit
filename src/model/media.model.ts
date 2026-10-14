import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity } from "typeorm";

// Image bytes live in their own collection so product queries never load them.
// Documents are immutable: a new upload always gets a new id.
@Entity(Controller.Media)
export class Media extends BaseEntity {
    @Column()
    mimeType: string;

    @Column()
    size: number;

    @Column()
    width: number;

    @Column()
    height: number;

    @Column()
    sha256: string; // dedupe key and ETag

    @Column()
    data: Buffer;
}
