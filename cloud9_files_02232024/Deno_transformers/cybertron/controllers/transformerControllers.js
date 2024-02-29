import { db, autobots, decepticons } from "../db.js";
import { handle } from "../utils/handlebars.js";
import { parseBody } from "../utils/parseBody.js";

export const getTransformers = async ({request, response, cookies}) => {
    let message = await cookies.get("message");
    console.log("message is: ", message)
    if (message){
        cookies.set("message", "");
    }
    const autobotsAll = await autobots.find();
    const decepticonsAll = await decepticons.find();
    let renderObject = {
        autobots: autobotsAll,
        decepticons: decepticonsAll,
        request: request,
        message: message
    }
    response.body = await handle.renderView('list', renderObject);
}


export const addTransformer = async ({request, response, cookies}) => {
    if (request.auth){
        const body = parseBody(await request.body())
        const transformerCollection = db.collection(`${body.value.type}s`);
        const auto = await db.collection("autobots").findOne({name: body.value.name});
        const dece = await db.collection("decepticons").findOne({name: body.value.name});
        if(auto || dece){
            cookies.set("message", `Transformer ${body.value.name} Already exists`);
            response.redirect("/")
        }
        else{
            const transformer = await transformerCollection.insertOne({
                name: body.value.name,
                image: body.value.image
            });
            cookies.set("message", `Successfully created ${body.value.type} ${body.value.name}`);
            response.redirect("/")
        }
    }
    else{
        cookies.set("message", "Please confirm your identity as a prime");
        response.redirect("/")
    }
}