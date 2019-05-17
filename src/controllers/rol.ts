import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Rol} from "../entity/Rol";

export async function post(request: Request, response: Response) {
    const rolRepository = getManager().getRepository(Rol);
    const newRol = rolRepository.create(request.body);
    await rolRepository.save(newRol);
    response.send(newRol);
}

export async function getAll(request: Request, response: Response) {
    const rolRepository = getManager().getRepository(Rol);
    const rol = await rolRepository.find();
    response.send(rol);
}

export async function getOne(request: Request, response: Response) {
    const rolRepository = getManager().getRepository(Rol);
    const rol = await rolRepository.findOne(request.params.id);
    // if rol was not found return 404 to the client
    if (!rol) {
        response.status(404);
        response.end();
        return;
    }
    response.send(rol);
}

export async function put(request: Request, response: Response) {
    const rolRepository = getManager().getRepository(Rol);
    const rol = await rolRepository.findOne(request.params.id);
    // if rol was not found return 404 to the client
    if (!rol) {
        response.status(404);
        response.end();
        return;
    }
    rol.nameRol = request.body.nameRol || rol.nameRol;
    await rolRepository.save(rol);
    response.send(rol);
}

export async function remove(request: Request, response: Response) {
    const rolRepository = getManager().getRepository(Rol);
    const rol = await rolRepository.findOne(request.params.id);
    // if rol was not found return 404 to the client
    if (!rol) {
        response.status(404);
        response.end();
        return;
    }
    await rolRepository.remove(rol);
    response.send(rol);
}