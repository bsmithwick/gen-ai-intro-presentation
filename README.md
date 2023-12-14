# Dec 2023 Generative AI Intro Presentation

# Before the show
1. `npm install`
2. Create a dotenv file: `touch .env && echo AWS_PROFILE={your AWS profile name} >>.env && echo AWS_DEFAULT_REGION={your AWS region} >>.env`
3. Log in to your preferred AWS account: `aws sso login`
4. Create the Wookieepedia vector database:
    a. `mkdir data`
    b. download into /data from https://starwars.fandom.com/wiki/Special:Statistics (database dumps)
    c. Unzip with 7zip
    d. Extract with https://github.com/attardi/wikiextractor
    e. `node act3-preload.mjs` (You'll need to comment out the kill switch first. You'll spend some $ on Bedrock embeddings, so only do this once.)

There are usage examples at the top of each `act*.mjs` script.


# Run of show
## Act 1 - Basic LangChain
1. `node act1.mjs`
2. Change Yoda to Darth Vader
3. Change haiku to sonnet -> see maxTokens gotcha!  (Then add maxTokens prop.)
4. Change temperature
5. Change model (copy/paste from refs/act1.mjs)
6. Demo debugging with `LANGCHAIN_VERBOSE=true` env var

## Act 2 - Prompts
1. `node act2.mjs "Yoda"`
2. Play around with different voices
3. Demo LangChain step debugging (copy/paste from refs/act2.mjs)
4. Show alternate output parser: `node act2-1.mjs "Yoda"`
5. Uncomment parser instructions to see what gets passed to the prompt

## Act 3 - RAG
1. `node act3.mjs "What color is Yoda?"`
2. Change model
3. Show the more detailed version of the chain (copy/paste from refs/act3.mjs)
4. Final question: "Who shot first?"

