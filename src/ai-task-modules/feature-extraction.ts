import { HfInference } from "@huggingface/inference";
import config from "../config/config";

const hf = new HfInference( config.hf_access_token );

export const extractFeaturesFromModel = async(value:string, model:string) => {
	const output = await hf.featureExtraction({
		model: model,
		inputs: value,
	});
	return output;
}

export function oneDimentionTypeCheck<T>(value: (T | T[] | T[][])[]): value is T[] {
	return !Array.isArray(value[0]);
}

export function dotProduct(a: number[], b: number[]) {
	if(a.length !== b.length) throw new Error("Vectors must be the same length");

	let result = 0;
	for(let i = 0; i < a.length; i++) {
		result += a[i] * b[i];
	}
	return result;
}

/*
Sample usage:

const output1 = await extractFeaturesFromModel("That is a happy person", "intfloat/e5-small-v2");

const output2 = await extractFeaturesFromModel("That is a happy person", "intfloat/e5-small-v2");

if(oneDimentionTypeCheck(output1) && oneDimentionTypeCheck(output2)) {
	const similarity = dotProduct(output1, output2);
	console.log(similarity);
}

*/