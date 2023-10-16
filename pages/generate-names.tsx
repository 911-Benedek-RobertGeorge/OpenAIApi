import React, { useEffect, useState } from "react";
import Configuration from "openai";
import OpenAIApi from "openai";
import styles from "../styles/styles.module.css";

const openai = new OpenAIApi({ dangerouslyAllowBrowser: true, apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default function GenerateNames() {
  const [response, setResponse] = useState("");
  const [myTouch, setMyTouch] = useState(false);
  const [myTouchText, setMyTouchText] = useState("");

  async function requestGPT() {
    console.log("Start the request");
    if (!openai.apiKey) {
      console.log("OpenAI API key not configured, please follow instructions in README.md");
      return;
    }

    try {
      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(myTouchText),
        max_tokens: 20,
        temperature: 1,
      });

      console.log(completion);
      setResponse(completion.choices[0].text);
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    } finally {
      setMyTouch(false);
    }
  }

  function generatePrompt(promt) {
    const capitalized = promt[0].toUpperCase() + promt.slice(1).toLowerCase();
    return `Itheum created data nfts that are capable of storing data of an nft.
    The following text represents the data nft description. Help with choosing a name for it.
    The data represents : ${capitalized}
    Names:`;
  }
  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.inputstyle}
          type="text"
          value={myTouchText}
          onChange={(e) => setMyTouchText(e.target.value)}
          placeholder="Describe your data nft... eg: data nft describes the sponsors of Itheum"
        />{" "}
        <button
          className={styles.coolbutton}
          onClick={() => {
            requestGPT();
          }}>
          Use my prompt
        </button>
      </div>
      <h2 className={styles.text}> {response}</h2>
    </div>
  );
}
