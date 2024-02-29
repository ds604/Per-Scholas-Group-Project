import { Router } from 'https://deno.land/x/oak@v12.0.0/mod.ts'
import { getTransformers, addTransformer } from "../controllers/transformerControllers.js";
import { signup, login, logout } from "../controllers/authControllers.js";

export const router = new Router()

router
    .get('/', getTransformers)
    .post('/', addTransformer)
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)