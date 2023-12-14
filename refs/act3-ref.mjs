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
const FAISS_DB_FILE = `./data/starwars.faiss`;

// who shot first?

// load up the vector store
const vectorStore = await FaissStore.load(
	FAISS_DB_FILE,
	new BedrockEmbeddings(),
);
const retriever = vectorStore.asRetriever();

// create a new bedrock instance
const llm = new Bedrock({
	model: 'amazon.titan-text-express-v1', // specify the desired model
	maxTokens: 2000,
});

// create a prompt template
const prompt = PromptTemplate.fromTemplate(
	`Answer the question based only on the following context:
	{context}

	Question:
	{question}`
 );

const chain = RunnableSequence.from([
	// the short way
	{
		context: retriever.pipe(formatDocumentsAsString),
		question: new RunnablePassthrough(),
	},
	/* the long way
	(async input => {
		const context = await retriever.getRelevantDocuments(input);
		return {
			context: formatDocumentsAsString(context),
			question: input
		}
	}),
	*/
	prompt,
	llm,
]);

const result = await chain.invoke(question);
console.log(result);
