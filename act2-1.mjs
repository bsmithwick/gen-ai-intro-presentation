/* usage: `node act2-1.mjs "Yoda"` */
import 'dotenv/config';
import { Bedrock } from "langchain/llms/bedrock";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { CommaSeparatedListOutputParser } from "langchain/output_parsers";

// set voice to be the passed-in argument
const voice = process.argv[2];

// create a new bedrock instance
const llm = new Bedrock({
	model: 'amazon.titan-text-express-v1', // specify the desired model
	maxTokens: 2000,
});

// create a prompt template
const prompt = PromptTemplate.fromTemplate(
	`Compose a haiku about Ewoks, in the voice of {voice}.
	{formatInstructions}`
);

// create a new output parser to break the output into a comma-separated list
const outputParser = new CommaSeparatedListOutputParser();
//console.log("output parser instructions", outputParser.getFormatInstructions());

// create a chain from prompt + llm + outputParser
const chain = RunnableSequence.from([
	prompt,
	llm,
	outputParser,
]);

// run the prompt
const result = await chain.invoke({
	voice: voice,
	formatInstructions: outputParser.getFormatInstructions(),
});
console.log(result);
