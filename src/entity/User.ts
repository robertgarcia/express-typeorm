import {Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable, OneToMany, ManyToOne} from "typeorm";
import { Rol } from "./Rol";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    nickName : string;

    @Column()
    password: string;

    @Column()
    salt : string;

    @ManyToOne(type => Rol, rol => rol.user)
    @JoinTable()
    roles: Rol;

}