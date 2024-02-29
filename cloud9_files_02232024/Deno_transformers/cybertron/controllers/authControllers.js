import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
// import { makeJwt } from "https://deno.land/x/djwt/create.ts"
import { create } from "https://deno.land/x/djwt/mod.ts"
import { parseBody } from '../utils/parseBody.js'
import { primes } from "../db.js";
import { key, payload, header } from "../utils/jwt.ts";

export const signup = async ({request, response, cookies}) => {
    if (request.auth){
        cookies.set("message", `You have already entered Cybertron`);
        response.redirect("/")
    }
    else{
        //console.log("here's the request: ", request)
        const body = await parseBody(await request.body());
        console.log("body is: ", body)
        const find = await primes.findOne({username: body.value.username});
        if(find){
            cookies.set("message", "Prime already exists");
            response.redirect("/");
        }
        else{
            const prime = await primes.insertOne({
                username: body.value.username,
                password: await bcrypt.hash(body.value.password),
            });
            cookies.set("message", `Successfully registered as a prime: ${body.value.username}. Enter Cybertron to continue..`);
            response.redirect("/")
        }
    }
}

export const login = async ({request, response, cookies}) => {
    if (request.auth){
        cookies.set("message", `You have already entered Cybertron`);
        response.redirect("/")
    }
    else{
        const body = await parseBody(await request.body());
        const prime = await primes.findOne({username: body.value.username});
        if(prime){
            if(await bcrypt.compare(body.value.password, prime.password)){
                response.body = prime.username;
                payload.username = body.value.username;
                // cookies.set("token", makeJwt({ header, payload, key }));
                cookies.set("token", await create(header, payload, key ));
                cookies.set("message", "Successfully entered Cybertron");
                response.redirect("/");
            }
            else{
                cookies.set("message", "Wrong Password");
                response.redirect("/");
            }
        }
        else{
            cookies.set("message", "You are not registered as a prime");
            response.redirect("/");
        }
    } 
}

export const logout = async ({request, response, cookies}) => {
    if (request.auth){
        cookies.set("token", "");
        cookies.set("message", "Successfully Logged Out");
        response.redirect("/");
    }
    else{
        cookies.set("message", "Please enter Cybertron");
        response.redirect("/");
    }
}