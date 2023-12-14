import 'dotenv/config';
import { Bedrock } from "langchain/llms/bedrock";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";

// set voice to be the passed-in argument
const voice = process.argv[2];

// create a new bedrock instance
const llm = new Bedrock({
	model: 'amazon.titan-text-express-v1', // specify the desired model
	maxTokens: 2000,
});

// create a prompt template
const prompt = PromptTemplate.fromTemplate(
	`Compose a haiku about Ewoks, in the voice of {voice}.`
);

//create a chain from prompt + llm
const chain = RunnableSequence.from([
	/* here's how to debug
	(input => {
		console.log("TICK 0", input);
		return input;
	}),
	*/
	prompt,
	llm,
]);

// run the prompt
const result = await chain.invoke({
	voice: voice,
});
console.log(result);
