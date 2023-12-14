import 'dotenv/config';
import { Bedrock } from "langchain/llms/bedrock";

// create a new bedrock instance
const llm = new Bedrock({
	model: 'amazon.titan-text-express-v1',
	//model: 'meta.llama2-13b-chat-v1',
	//model: 'anthropic.claude-v2', // Human/Assistant gotcha
	// temperature: 0.5,
	// maxTokens: 2000,
});

// create a prompt
const text = "Compose a sonnet about Ewoks, in the voice of Yoda.";
// switch from Yoda / Darth Vader
// switch from haiku / sonnet - see the maxTokens gotcha
// mess with temperature

// run the prompt
const result = await llm.predict(text);
console.log(result);
