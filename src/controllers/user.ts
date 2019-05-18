import {Request, Response, NextFunction} from "express";
import {getManager} from "typeorm";
import {User} from "../entity/User";

export async function post(request: Request, response: Response){
    const userRepository = getManager().getRepository(User);
    request.body.salt = `${request.body.nickName}-${request.body.password}`;
    const newUser = userRepository.create(request.body);
    await userRepository.save(newUser);
    response.send(newUser);
}

export async function getAll(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const categories = await userRepository.find({ relations: ["roles"] });
    response.send(categories);
}

export async function getOne(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(request.params.id, { relations: ["roles"] });
    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }
    response.send(user);
}

export async function put(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(request.params.id);
    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }

    user.name = request.body.name || user.name;
    user.nickName = request.body.nickName || user.nickName;
    user.password = request.body.password || user.password;
    user.salt = `${request.body.nickName}-${request.body.password}`;
    user.roles = request.body.roles || user.roles;

    await userRepository.save(user);

    response.send(user);
}

export async function remove(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(request.params.id);
    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }
    await userRepository.remove(user);
    response.send(user);
}

export async function registrar(request: Request, response: Response){
    const userRepository = getManager().getRepository(User);
    request.body.salt = `${request.body.nickName}-${request.body.password}`;
    request.body.roles = 3;
    const newUser = userRepository.create(request.body);
    await userRepository.save(newUser);
    response.send(newUser);
}

export async function autenticar(request: Request, response: Response, next: NextFunction) {
    console.log('auth');
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne({nickName :request.body.nickName, password : request.body.password}, {relations: ["roles"]});
    // if user was not found return 404 to the client
    if (!user) {
        response.status(401);
        response.end("Autenticación fallida. Usuario o Contraseña incorrecto.");
        return;
    }
    request.body = user;
    next();
    //response.send(user);
}