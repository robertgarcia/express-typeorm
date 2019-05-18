import app from './app'
import {Request, Response, NextFunction} from "express";
import * as moment from "moment";

import * as jwt from 'jsonwebtoken';
export type JsonWebToken = typeof jwt;

//import jwtAuth from "express-jwt";
//import jwks from "jwks-rsa";

import { post as createPost, put as updatePost, remove as deletePost, getOne as getPost, getAll as getPosts } from "./controllers/post";
import { post as createCategory, put as updateCategory, remove as deleteCategory, getOne as getCategory, getAll as getCategories } from "./controllers/category";
import { post as createUser, put as updateUser, remove as deleteUser, getOne as getOneUser, getAll as getAllUsers, autenticar as auth, registrar as registrar } from "./controllers/user";
import { post as createRol, put as updateRol, remove as deleteRol, getOne as getOneRol, getAll as getAllRols } from "./controllers/rol";

// Add headers
app.use(function (req: Request, res: Response, next: NextFunction) {
  
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  }); 

/*var jwtCheck: any = jwtAuth({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-rgarcia.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:3000',
  issuer: 'https://dev-rgarcia.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/authorized', function (req: Request, res: Response, next: NextFunction) {
    res.send('Secured Resource');
});*/
app.post('/registro', registrar);
app.post('/auth', auth, (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    var token = jwt.sign({id : body.id, name : body.name, nickname : body.nickName}, body.salt, {expiresIn : 14400});
    var {salt, password, ...rest} = body;
    rest.message = 'Bienvenido';
    rest.token = token;
    res.status(200).send(rest);
});

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    var token = req.headers['x-access-token'];
    if ((token != 'null')&&(token != null)&&(token != 'undefined')&&(token)) {
        var payload: any = jwt.decode(token.toString());
        if ((payload != null || payload != undefined) && payload.hasOwnProperty('exp')) {
            var expiracion = moment.unix(payload.exp);
            if (expiracion.isSameOrBefore()) {
                return res.status(403).send("El Token provisto ha expirado. Vuelva a iniciar sesión.");
            }else{
                next();
            }
        }else{
            return res.status(403).send("El Token provisto es incorrecto.");
        }
    }else{
        return res.status(403).send("No se ha provisto de ningún Token.");
    }
});

app.post('/category', createCategory);
app.get('/category', getCategories);
app.get('/category/:id', getCategory);
app.put('/category/:id', updateCategory);
app.delete('/category/:id', deleteCategory);

app.post('/post', createPost);
app.get('/post', getPosts);
app.get('/post/:id', getPost);
app.put('/post/:id', updatePost);
app.delete('/post/:id', deletePost);

//Users
app.post('/user', createUser);
app.get('/user', getAllUsers);
app.get('/user/:id', getOneUser);
app.put('/user/:id', updateUser);
app.delete('/user/:id', deleteUser);

//Roles
app.post('/rol', createRol);
app.get('/rol', getAllRols);
app.get('/rol/:id', getOneRol);
app.put('/rol/:id', updateRol);
app.delete('/rol/:id', deleteRol);