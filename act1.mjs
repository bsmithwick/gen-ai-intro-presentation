/* usage: `node act1.mjs` */
import 'dotenv/config';
import { Bedrock } from "langchain/llms/bedrock";

// create a new bedrock instance
const llm = new Bedrock({
	model: 'amazon.titan-text-express-v1',
});

// create a prompt
const text = `Compose a haiku about Ewoks, in the voice of Yoda.`;

// run the prompt
const result = await llm.predict(text);
console.log(result);
