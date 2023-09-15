import OpenAI from "openai";


import config from "../config/config";
import { ReadStream } from "fs";

const openai = new OpenAI({
	apiKey: config.openai_key,
});


const SPEECH_TO_TEXT_MODEL:string = "whisper-1";
const CHAT_MODEL:string = "gpt-3.5-turbo";
const EMBEDDINGS_MODEL:string = "text-embedding-ada-002";

export const getTextFromAudio = async(readStream:ReadStream) => {
	const transcription = await openai.audio.transcriptions.create({
    file: readStream,
    model: SPEECH_TO_TEXT_MODEL,
  });

  return transcription.text;
}

export const getChatCompletion = async (query:string) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: query }],
    model: CHAT_MODEL,
  });

  return completion.choices[0];
}

async function createEmbeddings(data:string) {
  const embedding = await openai.embeddings.create({
		model: EMBEDDINGS_MODEL,
		input: data,
  });

  return embedding;
}


/*
Sample usage:

const readStream:ReadStream = fs.createReadStream(
	[path to audio file]
);

	const text = await getTextFromAudio(readStream);
	console.log(text);

*/