import { Application, send, Status } from 'https://deno.land/x/oak@v12.0.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from './routes/routes.js'
import { validate } from './utils/validate.js'

const app = new Application()
app.addEventListener("error", (event) => {
    console.log(event.error);
});

// app.use(
//   oakCors({
//     origin: true
//   }),
// );

app.use(validate)
app.use(router.routes())
app.use(router.allowedMethods())

"this is for serving static files from uploaded folder"
app.use(async (context, next) => {
	const prefix = '/uploaded'
	if(context.request.url.pathname.startsWith(prefix)) {
		await context.send({
			root: `${Deno.cwd()}/uploaded`,
			index: 'index.html',
			path: context.request.url.pathname.replace(prefix, ''),
		})
	} else {
		await next()
	}

	// context.response.body = "hello world!"

  	// context.response.status = Status.NotFound
  	// context.response.body = `"${context.request.url}" not found`


	// const root = `${Deno.cwd()}/uploaded`
	// try {
	// 	await send(ctx, ctx.request.url.pathname, {
	// 		root: 'uploaded',
	// 		index: 'index.html',
	// 	})
	// } catch (_) {
	// 	await next()
	// }


	// await send(context, context.request.url.pathname, {
	// 	root: `${Deno.cwd()/uploaded}`,
	// })
})


console.log(`Listening on port 8080...`)
await app.listen({port : 8080})