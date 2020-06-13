import { parse } from "https://deno.land/std/flags/mod.ts";
const {args} = Deno;
console.log(args);
console.log(parse(args));
// deno run test.ts -a --b=123
[ "-a", "--b=123" ]
{ _: [], a: true, b: 123 }