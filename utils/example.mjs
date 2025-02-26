// text-embedding-ada-002
import OpenAI from "openai";
const openai = new OpenAI();
const embedding = async () => {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Your text string goes here",
      encoding_format: "float",
    });

    console.log(embedding);
  } catch (error) {}
};
