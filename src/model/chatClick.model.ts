import { Controller } from "../enum/controller";
import { BaseEntity } from "../enum/model.enum";
import { Column, Entity } from "typeorm";

export enum ChatChannel {
    WHATSAPP = "whatsapp",
    MESSENGER = "messenger",
}

// One anonymous click on a WhatsApp/Messenger button on the website.
// No IP, cookie or visitor id is stored.
@Entity(Controller.ChatClick)
export class ChatClick extends BaseEntity {
    @Column()
    channel: ChatChannel;

    @Column()
    page: string; // path the visitor was on, e.g. /products/123

    @Column({ nullable: true })
    item?: string; // product/fabric/accessory name when clicked from an item

    @Column({ nullable: true })
    referrer?: string; // external site the visit started from (google.com, instagram.com...)

    @Column({ nullable: true })
    landingPage?: string; // first page of the visit

    @Column({ nullable: true })
    timezone?: string; // browser time zone, e.g. America/New_York

    @Column({ nullable: true })
    language?: string;

    @Column({ nullable: true })
    device?: string; // mobile | desktop
}
