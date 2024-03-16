import { Router } from 'https://deno.land/x/oak@v12.0.0/mod.ts'
// import { multiParser } from 'https://deno.land/x/multiparser/mod.ts'
// import { multer } from 'npm:multer'
import { getTransformers, addTransformer, getSongs, songList } from "../controllers/transformerControllers.js";
import { signup, login, logout } from "../controllers/authControllers.js";
import { parseBody } from '../utils/parseBody.js'

// let songView = await Deno.readTextFile("./views/songview.html");

export const router = new Router()
// export let ws = ""
let ws = ""

router
    // .get('/', getTransformers)
    .get('/', getSongs)
    .post('/', addTransformer)
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)
    .get("/music", async (context) => {
    	
        // songView = eval('`'+songView+'`');

    	context.response.headers.set("Content-Type", "text/html")
    	// context.response.body = `<h1>Welcome to /anything route foobar</h1>`;
    	context.response.body = songView;
  	})
    .post('/upload', async (ctx) => {
        const body = await ctx.request.body({type: 'form-data'}) 
        // console.log("upload body is: ", body) 
        // const formData = await ctx.request.formData()
        // console.log("form data is: ", formData)
        
        const data = await body.value.read({ maxSize: 10_000_000 })
        await Deno.writeFile(`uploaded/${data.files[0].originalName}`, data.files[0].content);

        "log file upload to server and client"
        console.log("wrote file: ", data.files[0].originalName)
        ws.send(`file uploaded: ${data.files[0].originalName}`)

        "update song list"
        console.log("form data: ", data)
        songList.push({
            metaData: {
                artist: data.fields.artist,
                // title: data.files[0].originalName,
                title: data.fields.title,
            },
            url: `/uploaded/${data.files[0].originalName}` // http:
        })
        let wsMessage = JSON.stringify({
            type: "songListUpdate",
            songList: songList
        })
        ws.send(wsMessage)

        ctx.response.status = 201;
        // let value = await ctx.request.body().value.read({ maxSize: 10_000_000 })
        // console.log(value)

        // if(data){
        //     try {
        //         await Deno.writeFile(`uploaded/${data.files[0].filename}`)
        //         console.log("wrote file to 'uploaded' folder: ", data.files[0].originalName)
        //     } catch(e) {
        //         console.log(e)
        //     }
        //     ctx.response.body = '{"status": "ok"}';
        // }

        
        // console.log(ctx.request.originalRequest.request)
        // const form = await multiParser(ctx.request.originalRequest.request);
        // console.log("form is: ", ctx.request)
        // if (form) {
        //   // const image: FormFile = form.files.image as FormFile
        //   const image = form.files.image
        //   try {
        //     await Deno.writeFile(`images/${image.filename}`, image.content);
        //   } catch (e) {
        //     console.error(e)
        //   }
        //   ctx.response.body = '{"status": "ok"}';
        // } else {
        //     ctx.response.body = '{"status": "not sure whats going on here"}';
        // }
    })
    .get("/wss", (ctx) => {
        if (!ctx.isUpgradable) {
            ctx.throw(501);
        }
        ws = ctx.upgrade();
        ws.onopen = () => {
            console.log("Connected to client");
            ws.send(JSON.stringify({type: "info", contents: "Hello from server!"}));
        };
        ws.onmessage = (m) => {
            console.log("Got message from client: ", m.data);
            // ws.send(m.data);
            // ws.close();
        };
        ws.onclose = () => console.log("Disconncted from client");
    });