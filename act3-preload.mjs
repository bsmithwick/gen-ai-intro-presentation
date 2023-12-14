/* usage: `node act3-preload.mjs` */
import 'dotenv/config';
import * as fs from 'fs';
import { BedrockEmbeddings } from "langchain/embeddings/bedrock";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";

import { XMLParser } from "fast-xml-parser";

//////// KILL SWITCH ///////////
console.log("You really don't want to run this again.");
process.exit();
///////////////////////////////

const EMBED_MAX_CONCURRENCY = 10;
const FAISS_DB_FILE = `./data/starwars.faiss`;

 const embeddings = new BedrockEmbeddings({
 	maxConcurrency: EMBED_MAX_CONCURRENCY,
});

console.log("STARTING TO LOAD INTO VECTOR STORE");
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 0,
});

// loop through every file in a subfolder in the data/text folder and retrieve the text
let files = fs.readdirSync('./data/text/', {recursive: true, withFileTypes: true});
console.log("FOUND FILES", files.length);

// create a LangChain Document from each XML doc
const docs = [];
const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''});

for (const file of files) {
	if (file.isFile()) {
		const fileContents = await fs.readFileSync('./' + file.path + '/' + file.name, 'utf8');
		const xml = parser.parse(fileContents);
		for (const doc of xml.doc) {
			docs.push(new Document({
				pageContent: doc['#text'],
				metadata: {
					title: doc.title,
					url: doc.url,
				}
			}));
		};
	}
}

// split the Documents into embeddable chunks
console.log("FOUND DOCS", docs.length);
let splittedDocs = await textSplitter.splitDocuments(docs);
console.log("SPLITTED TO EMBEDDABLE DOCS", splittedDocs.length);


// create vector store from documents
// we do this in chunks so we can have activity logging

// break splittedDocs into an array of arrays of 500
let chunkSize = 500;
let chunkedDocs = [];
for (let i = 0; i < splittedDocs.length; i += chunkSize) {
	chunkedDocs.push(splittedDocs.slice(i, i + chunkSize));
}

// insert each chunk of docs into the vector store
let success = 0;
let fail = 0;
const vectorStore = await FaissStore.fromDocuments([], embeddings);
const startTime = Date.now();
console.log("CHUNKED DOCS", chunkedDocs.length);
let chunkCount = 0;
for (const chunk of chunkedDocs) {
	console.log("CHUNK", chunkCount++ + " / " + chunkedDocs.length);
	try {
		await vectorStore.addDocuments(chunk);
		success++;
	} catch (e) {
		console.log("ERROR ON CHUNK", e);
		fail++;
		//console.log("CHUNK WAS", chunk);
	}
	//@TODO should we do incremental saves?
}

await vectorStore.save(FAISS_DB_FILE);
const endTime = Date.now();
const elapsed = endTime - startTime;
console.log("SUCCESS", success);
console.log("FAIL", fail);
console.log("ELAPSED", elapsed/1000);

console.log("VECTOR STORE CREATED AND SAVED TO ", FAISS_DB_FILE);
