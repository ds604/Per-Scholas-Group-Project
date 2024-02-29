import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

let password = "test";

const hash = await bcrypt.hash(password);
console.log(hash);

let comparison = await bcrypt.compare(password, hash);
console.log(comparison);

let wrongPassword = "wrong-test";

comparison = await bcrypt.compare(wrongPassword, hash);
console.log(comparison);