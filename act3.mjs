/* usage: `node act3.mjs "What color is Yoda?"` */
import 'dotenv/config';
import { Bedrock } from "langchain/llms/bedrock";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence, RunnablePassthrough } from "langchain/schema/runnable";
import { FaissStore } from "langchain/vectorstores/faiss";
import { BedrockEmbeddings } from "langchain/embeddings/bedrock";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "langchain/schema/output_parser";

// set question to be the passed-in argument
const question = process.argv[2];

// load up the vector store
const FAISS_DB_FILE = `./data/starwars.faiss`;
const vectorStore = await FaissStore.load(
	FAISS_DB_FILE,
	new BedrockEmbeddings(),
);
const retriever = vectorStore.asRetriever();

// create a new bedrock instance
const llm = new Bedrock({
	//model: 'amazon.titan-text-express-v1', // specify the desired model
	//model: 'meta.llama2-13b-chat-v1',
	model: 'anthropic.claude-v2', // Human/Assistant gotcha
	maxTokens: 2000,
});

// create a prompt template
const prompt = PromptTemplate.fromTemplate(
	`Human:  Answer the question based only on the following context:
	{context}

	Question:
	{question}

	Assistant:`
 );

const chain = RunnableSequence.from([
	{
		context: retriever.pipe(formatDocumentsAsString),
		question: new RunnablePassthrough(),
	},
	prompt,
	llm,
]);

const result = await chain.invoke(question);
console.log(result);
