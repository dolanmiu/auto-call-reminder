import { Configuration, OpenAIApi } from "openai";

export const predictWords = async (prompt: string): Promise<string[]> => {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  );

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
  });

  console.log(completion.data.choices?.[0].text);

  return (
    completion.data.choices
      ?.filter((a) => !!a.text)
      .map((a) => a.text ?? "")
      .map((a) => a.trim()) ?? []
  );
};
