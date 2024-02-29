import { Application } from 'https://deno.land/x/oak@v12.0.0/mod.ts'
import { router } from './routes/routes.js'
import { validate } from './utils/validate.js'

const app = new Application()
app.addEventListener("error", (event) => {
    console.log(event.error);
});

app.use(router.routes())
app.use(router.allowedMethods())
app.use(validate)

console.log(`Listening on port 8080...`)
await app.listen({port : 8080})