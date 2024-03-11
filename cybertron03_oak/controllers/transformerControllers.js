import { db, autobots, decepticons } from "../db.js";
import { handle } from "../utils/handlebars.js";
import { parseBody } from "../utils/parseBody.js";
// import { ws } from "../routes/routes.js";


const autobotsAll = [
    { name : "Bumblebee", image: "https://ds604.neocities.org/Public/dinosaur.png" },
    { name : "Ironhide", image: "https://ds604.neocities.org/Public/megaman.png" },
]
const decepticonsAll = [
    { name : "Starscream", image: "https://ds604.neocities.org/Public/sonic.png" },
]
export const songList = [
    {
        metaData: {
            artist: "Method Man feat. Busta Rhymes",
            title: "What's Happenin'",
            imageUrl: "https://ds604.neocities.org/Public/sound/images/MethodMan_WhatsHappenin.png"
        },
        url: "https://ds604.neocities.org/Public/sound/02%20What's%20Happenin%20(Feat%20Busta%20Rh.mp3"
    },
    {
        metaData: {
            artist: "Fugees",
            title: "Vocab",
            imageUrl: "https://ds604.neocities.org/Public/sound/images/Fugees_Vocab.png"
        },
        url: "https://ds604.neocities.org/Public/sound/Vocab%20(Refugees%20Hip%20Hop%20Remix).mp3"
    },
    {
        metaData: {
            artist: "Kid Koala",
            title: "Third World Lover",
            imageUrl: "https://ds604.neocities.org/Public/sound/images/KidKoala_ThirdWorldLover.png"
        },
        url: "https://ds604.neocities.org/Public/sound/NeverForgiveAction_2%20Third%20World%20Lover.mp3"
    },
    {
        metaData: {
            artist: "Dillon Francis & Diplo feat. Maluca",
            title: "Que Que",
            imageUrl: "https://ds604.neocities.org/Public/sound/images/BlowYourHead_Moombahton.png"
        },
        url: "https://ds604.neocities.org/Public/sound/01%20Que%20Que.mp3"
    },
    {
        metaData: {
            artist: "Dennis Ferrer",
            title: "Hey Hey (Sabo Moombahton Remix)",
            imageUrl: "https://ds604.neocities.org/Public/sound/images/BlowYourHead_Moombahton.png"
        },
        url: "https://ds604.neocities.org/Public/sound/14%20Hey%20Hey%20(Sabo%20Moombahton%20Remix).mp3"
    },
]

export const getTransformers = async ({request, response, cookies}) => {
    let message = await cookies.get("message");
    console.log("message is: ", message)
    if (message){
        cookies.set("message", "");
    }
    // const autobotsAll = await autobots.find();
    // const decepticonsAll = await decepticons.find();
    let renderObject = {
        autobots: autobotsAll,
        decepticons: decepticonsAll,
        request: request,
        message: message
    }
    response.body = await handle.renderView('listSongs_templateString', renderObject);
}

export const getSongs = async({request, response, cookies, state}) => {
    let message = await cookies.get("message");
    if(message){
        cookies.set("message", "");
    }
    console.log("state is: ", state)

    let renderObject = {
        songList: songList,
        request: request,
        message: message,
        state: state
    }
    response.body = await handle.renderView('listSongs', renderObject);

    // "trying to send websocket message to render songList after rendering page"
    // let wsMessage = JSON.stringify({
    //     type: "songListUpdate",
    //     songList: songList
    // })
    // ws.send(wsMessage)
}


export const addTransformer = async ({request, response, cookies, state}) => {
    if (state.auth){
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