import config from "@config/config.json";
import { markdownify } from "@lib/utils/textConverter";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { InputBox } from "../components/InputBox";
import { Button } from '@chakra-ui/react'

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);



function Contact() {
  const [userPrompt, setUserPrompt] = useState("");
  const [number] = useState(1);
  const [size, setSize ] = useState ("256x256");
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async () => {
    const imageParameters = {
      prompt: userPrompt,
      n: parseInt(number),
      size: size,
    };
    const response = await openai.createImage(imageParameters);
    const urlData = response.data.data[0].url;
    setImageUrl(urlData);
  };

  return (
    <main >
      <h1>Describenos tu casa ideal y te planteamos ideas de como luciria!</h1>

      {imageUrl && <img src={imageUrl} className="image" alt="ai thing" />}
      
      <InputBox setAttribute={setUserPrompt} />
      <Button type="submit" className="btn btn-primary" onClick={() => generateImage()}>
        Generar
      </Button>
    </main>
  );
}

export default Contact;