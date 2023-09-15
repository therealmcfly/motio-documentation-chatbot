import { HfInference } from "@huggingface/inference";
import config from "../config/config";

import { promises as fsPromises } from 'fs';

const hf = new HfInference( config.hf_access_token );

const TEXT2SPEECH_MODEL:string = 'facebook/fastspeech2-en-ljspeech';

export const textToSpeech = async(value:string) => {
	const output = await hf.textToSpeech({
		model: TEXT2SPEECH_MODEL,
		inputs: value
	});

	// Convert Blob to Buffer and write to file
	const result = await blobToFile(output, 'output.flac');

	console.log(result);

	return output;
}

async function blobToFile(blob: Blob, filename: string): Promise<void> {
	const arrayBuffer = await blob.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	try {
		const fullPath = require('path').resolve(filename);
		console.log("Saving file to:", fullPath);	
    await fsPromises.writeFile(fullPath, buffer);

    console.log("File saved successfully!");
	} catch (error) {
			console.error("Error saving file:", error);
	}
}