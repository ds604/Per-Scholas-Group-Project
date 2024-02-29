// import { setExpiration } from "https://deno.land/x/djwt/create.ts"
import { getNumericDate, Payload, Header } from "https://deno.land/x/djwt@v2.4/mod.ts";

// export const key = "your-secret"
const encoder = new TextEncoder()
var keyBuf = encoder.encode("mySuperSecret");

export var key = await crypto.subtle.importKey(
  "raw",
  keyBuf,
  {name: "HMAC", hash: "SHA-256"},
  true,
  ["sign", "verify"],
)

export const payload: Payload = {
  iss: "deno-demo",
  exp: getNumericDate(60 * 60) //setExpiration(new Date().getTime() + 60000*60),
}

export const header: Header = {
  alg: "HS256",
  typ: "JWT",
}