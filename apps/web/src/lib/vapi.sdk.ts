import Vapi from '@vapi-ai/web';

const vapi = new Vapi({ token: process.env.VAPI_API_KEY! });

// const assistant = await vapi.assistants.create({
//   name: "Support Assistant",
//   firstMessage: "Hello! How can I help you today?",
//   model: {
//     provider: "openai",
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: "You are a friendly phone support assistant. Keep responses under 30 words." }
//     ]
//   }
// });
