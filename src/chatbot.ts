
import { extractFeaturesFromModel, oneDimentionTypeCheck, dotProduct } from "./ai-task-modules/feature-extraction";
import { getChatCompletion, getTextFromAudio } from "./ai-task-modules/openai";
import fs, { ReadStream } from "fs";
import { textToSpeech } from "./ai-task-modules/text2Speech";

async function main() {

	// 
	// Speech to text with openai whisper-1 model
	 const readStream:ReadStream = fs.createReadStream(__dirname + "/samples/input.m4a");

	 const text = await getTextFromAudio(readStream);
	 console.log(text);

	// Chat Completion with openai gpt-3.5-turbo model
	
	const response = await getChatCompletion(text);
	console.log(response.message.content);

	if(response.message.content !== null) {
		const result = await textToSpeech(response.message.content);
	}

	// const stream = await openai.chat.completions.create({
  //   messages: [{ role: 'user', content: 'Say this is a test' }],
  //   model: 'gpt-4',
	// 	stream: true,
  // });

  // for await (const part of stream) {
  //   process.stdout.write(part.choices[0]?.delta?.content || '');
  // }
}

main();