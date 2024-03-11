// import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { verify } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { key } from "../utils/jwt.ts";

// export const validate = async ({request, cookies}, next) => {
//     const token = await cookies.get("token");
//     //const result = await validateJwt(token, key, { isThrowing: false });
//     console.log("Verifying: ", token, key)
//     const result = await verify(token, key);
//     if(result) {
//         request.auth = true;
//         request.username = result.payload.username;
//     }
//     await next();
// }

export const validate = async (context, next) => {
    const token = await context.cookies.get("token");
    console.log("validate token: ", token);
    if(token){ 
    	const result = await verify(token, key);
    	if(result) {
	        // const result = await verify(token, key);
	        // console.log("Verifying: ", token, key)
	        
	        // context.request.auth = true;
	        // context.request.username = result.payload.username;
	        context.state.auth = true;
	        context.state.username = result.username;
	        console.log("state is: ", context.state)
	    }
    }
    //const result = await validateJwt(token, key, { isThrowing: false });
    // const result = await verify(token, key);

    await next();
}