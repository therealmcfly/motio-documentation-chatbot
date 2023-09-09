import OpenAI from "openai";
import config from "./config/config";
import Server from "./custom_modules/server";

const openai = new OpenAI({
	apiKey: config.openai_key,
});

async function main() {
	const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4',
		stream: true,
  });

  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
  }
}




const server = new Server();

server.start();