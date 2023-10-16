import React, { useEffect, useState } from "react";

import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import { ExtensionLoginButton } from "@multiversx/sdk-dapp/UI";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn";
// OpenAI
import Configuration from "openai";
import OpenAIApi from "openai";
import styles from "../styles/styles.module.css";

//import "../styles/global.css";
// import jsonData from "../assets/test-file.json";
import jsonBigData from "../assets/file-obj.json";
console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
console.log(process.env.OPENAI_API_KEY1);
console.log(process.env.customKey);
const configuration = new Configuration({
  dangerouslyAllowBrowser: true,
  apiKey: "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",
});
const openai = new OpenAIApi({ dangerouslyAllowBrowser: true, apiKey: "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" });

export default function DataNftComponent() {
  // data , prompts
  const DATA_NFT_NONCES_I_WANT_TO_OPEN = [555, 556];

  const { tokenLogin } = useGetLoginInfo();
  console.log(tokenLogin?.nativeAuthToken);
  const [dataStream, setDataStream] = useState();
  const [dataInformation, setDataInformation] = useState();
  const [prompts, setPrompts] = useState([]);
  const [chatGptResponse, setChatGptResponse] = useState("");
  const isLoggedIn = useGetIsLoggedIn();
  const [promptIndex, setPromptIndex] = useState(-1);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [usedTokens, setUsedTokens] = useState(0);
  const [myTouchText, setMyTouchText] = useState("");
  const [myTouch, setMyTouch] = useState(false);
  // const commonProps = {
  //   callbackRoute: "/",
  //   nativeAuth: {
  //     apiAddress: "https://devnet-api.multiversx.com",
  //     expirySeconds: 3000,
  //   },
  // };

  async function processResponse(dataToProcess) {
    if (!dataToProcess.error) {
      if (dataToProcess.contentType.search("application/json") >= 0) {
        let response = await dataToProcess.data.text();
        response = JSON.stringify(JSON.parse(response), null, 4);
        response = JSON.parse(response);
        return response;
      }
    } else {
      console.log("Something went wrong. Try to login again.");
    }
    return "";
  }

  async function viewData() {
    // set the network you want to use
    DataNft.setNetworkConfig("devnet");

    ///type of _nfts is DataNft[]
    const _nfts = await DataNft.createManyFromApi(DATA_NFT_NONCES_I_WANT_TO_OPEN.map((nonce) => ({ nonce })));
    // is important that the logged in user owns at least one data nft with the specified nonce

    if (_nfts.length === 2 && _nfts[0] && _nfts[1]) {
      try {
        if (!(tokenLogin && tokenLogin?.nativeAuthToken)) {
          throw Error("No nativeAuth token");
        }
        const arg = {
          mvxNativeAuthOrigins: [window.location.origin],
          mvxNativeAuthMaxExpirySeconds: 3000,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
          },
        };
        const dataToProcess = await _nfts[0].viewDataViaMVXNativeAuth(arg);
        const responseData = await processResponse(dataToProcess);
        setDataInformation(responseData.data);
        const promptsToProcess = await _nfts[1].viewDataViaMVXNativeAuth(arg);
        const responsePrompts = await processResponse(promptsToProcess);
        setPrompts(responsePrompts.prompts);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function requestGPT() {
    console.log("Start the request");
    setLoadingRequest(true);
    if (!configuration.apiKey) {
      console.log("OpenAI API key not configured, please follow instructions in README.md");
      return;
    }
    try {
      /// for the sum of balances; data lenght 3
      /// gpt-3.5-turbo-instruct correct ~ 308314052560, received 308,321,366,560.8333
      /// gpt-3.5-turbo received 308,313,052,559.8333
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k", //"gpt-4-32k-0314", //
        messages: [
          { "role": "system", "content": "You are a helpful assistant and know how to query questions about this data" },
          { "role": "user", "content": generatePrompt(JSON.stringify(dataInformation), prompts[promptIndex].text) },
        ],
        max_tokens: 1000,
        temperature: 0, // 0 for consistent results, 1 for more randomness
      });
      //console.log(completion);
      setUsedTokens(completion.usage?.total_tokens);
      const message = completion.choices[0].message;
      setChatGptResponse(message.content);
      setLoadingRequest(false);
      setMyTouch(false);
      setPromptIndex(-1);
      //res.status(200).json({ result: completion.choices[0].message });
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    } finally {
      setLoadingRequest(false);
      setMyTouch(false);
      setPromptIndex(-1);
    }
  }
  function generatePrompt(jsonData, question) {
    var jsonString = JSON.stringify(jsonData);

    return `Itheum created data nfts that are capable of storing data of an nft.
      The following text represents the data nft of some transaction on multiversX blockchain
      ${jsonString}
      Now you are going to receive some questions on the above data. write the concince answer, don't repeat the data provided just the answer: 
      ${myTouch ? myTouchText : question + myTouchText}
      `;
  }
  useEffect(() => {
    viewData();
  }, [tokenLogin, isLoggedIn]);
  console.log(isLoggedIn);
  useEffect(() => {
    if (dataInformation && prompts && promptIndex >= 0) {
      console.log("request effect");
      requestGPT();
    }
  }, [promptIndex]);

  function downloadData() {
    const blob = new Blob([JSON.stringify(dataInformation)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_information.json";
    a.click();
    window.URL.revokeObjectURL(url);
  }
  const commonProps = {
    callbackRoute: "/",
    nativeAuth: {
      apiAddress: "https://devnet-api.multiversx.com",
      expirySeconds: 3000,
    },
  };
  return (
    <div>
      <div className={styles.row}>
        {isLoggedIn ? (
          <button className={`${styles.coolbutton} ${styles.logout}`} onClick={() => logout()}>
            Logout
          </button>
        ) : (
          <div className={styles.logout}>
            {" "}
            <ExtensionLoginButton loginButtonText="Connect DeFi Wallet" {...commonProps} />
          </div>
        )}
      </div>
      <div className={styles.container}>
        {dataInformation && (
          <>
            <div>
              <h2 className={styles.text}>NFT Data </h2>
            </div>

            <div className={styles.data}>{dataInformation && <p>{JSON.stringify(dataInformation)}</p>}</div>
            <button className={styles.coolbutton} onClick={() => downloadData()}>
              Download Data
            </button>
          </>
        )}
        {prompts.length > 0 && (
          <>
            <div>
              <h2 className={styles.text}>Prompts </h2>
              <ul>
                {prompts.map((prompt, index) => (
                  <li key={prompt.id}>
                    <button className={styles.card} disabled={loadingRequest} onClick={() => setPromptIndex(index)}>
                      {prompt.text}
                    </button>
                  </li>
                ))}
              </ul>
              <h4 className={styles.text}>Add your touch</h4>
              <div className={styles.row}>
                <input
                  className={styles.inputstyle}
                  type="text"
                  value={myTouchText}
                  onChange={(e) => setMyTouchText(e.target.value)}
                  placeholder="Enhance existing prompts, leave blank, or enter your own"
                />{" "}
                <button
                  className={styles.coolbutton}
                  onClick={() => {
                    setMyTouch(true);
                    requestGPT();
                  }}>
                  Use my prompt
                </button>
              </div>
            </div>
            {loadingRequest && (
              <>
                <h2 className={styles.text}>Response - loading... </h2>
              </>
            )}

            {!!chatGptResponse && !loadingRequest && (
              <>
                <div>
                  <h2 className={styles.text}>Response - Used tokens: {usedTokens}</h2>
                </div>
                <div className={styles.data}>{chatGptResponse}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
