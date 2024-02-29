import { Application, send } from 'https://deno.land/x/oak/mod.ts'
import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'

const handle = new Handlebars();

const router = new Router()

router
    .get('/', async (context) => {
        context.response.body = await handle.renderView('home', {name: "Cliffjumper"})
    })
    
const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({port: 8080})