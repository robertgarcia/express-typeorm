import {Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nameRol: string;

    @OneToMany(type => User, user => user.roles)
    user: User[];

}