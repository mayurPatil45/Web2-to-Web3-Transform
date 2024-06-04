const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "api";

// prompt - Keep the code simple and secure. Use the the right syntax. Use spdx license by MIT in comments
async function webScrape(url) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  const parts = [
    {text: `Assume I am from the tech team of a web2 app hosted at ${url}
    
    (now onwards whenever I use the following words \"web app\" or \"app\" or \"web application\" or alike I am referring to the web2 app hosted at ${url}) 
    and I want to update my technology by integrating a smart contract in my web application. 
    Give me \"approaches\" to integrate smart contract in the app.
    
    How you should behave :- 
    1) figure out what the \"web app\" does by looking it up on the internet. Then figure out features that can be better served on web3 for that particular app
    2) If it is a well-known app DO NOT answer as it is not possible. Understand that the developer is building a similar version on web3.
    
    For example :- 
    (1) If the app's core functionality is to sell properties online so an \"approach\" would be :-
    1) use escrow smart contract to transfer property
    2) use NFT to represent property
    (2) If the app is reddit so an \"approach\" would be :-
    1) Reddit's upvote/downvote system can be made even more transparent and tamper-proof using blockchain smart contracts.
    I want the output  and  in following schema and make sure that there are no backticks involved give the output in precise schema below
    {
          "response": {
              "summary": "A concise summary of the "web application" ",
            "approaches": [
                  {
                      "heading": "A concise heading describing the key idea of the approach"
                    "content": "Detailed content outlining the steps and implementation details of the approach",
                    "relevence": "How is the approach relevant to the given "web application""
              },
                {
                      "heading": "A concise heading describing the key idea of the approach",
                    "content": "Detailed content outlining the steps and implementation details of the approach",
                    "relevence": "How is the approach relevant to the given "web application""
              }
          ]
      }
  }`},
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const responseText = result.response.text();
  const jsonResponse = JSON.parse(responseText);
  
  console.log(jsonResponse);
  return jsonResponse;
  // console.log(responseText)

 
}


async function code_generate(approachHeading, approachContent, additionalDetails) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 4048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
        {text: `Develop a Solidity smart contract to implement the following approach for the web application:
        Approach Heading: ${approachHeading}
        
        Approach Content: ${approachContent}

        Additional Details: ${additionalDetails}

        Your task is to provide the Solidity code for the smart contract that will effectively integrate this approach into the web application. 
        Include relevant functions, variables, and any necessary logic to ensure the successful implementation of the specified feature. Avoid any backticks that might get involded while generating code

        Ensure that the generated Solidity code:
        1. Compiles without errors.
        2. Is complete and ready for deployment.
        3. The version of Solidity used is 0.8.0. andSPDX-License-Identifier should be MIT
        4. Create a 'transfer' function in a smart contract that allows the owner to transfer ownership to a specified address. Only the current owner should have the privilege to invoke this function.
        5. Try keeping contract name in a single word dont use spaces and special charachers

        Note: Consider best practices and security considerations for smart contracts during the development. 
    
        I want the output  and  in following schema and make sure that there are no backticks involved give the output in precise schema below. Avoid using any backtics that are included and once done convert the output in below format 
{
    "response": {
          "solidity_code": "Generated Solidity code for the specified approach",
          "contract_name": "the smart contract generated for the specified approach",
          "details": [
              "compilation_status_confidence": "give theConfidence level (between 1 and 100 - 1 being least confident that it will compile successfully and 100 being completely sure that it will compile successfully) for the compilation status of the generated Solidity code",

              "completeness_confidence": "give the Confidence level (between 1 and 100 - 1 being least confident that it will compile successfully and 100 being completely sure that it will compile successfully) for the completeness of the generated Solidity code",

              "additional_notes": "Describe all the functions of the smart contract except the 'transferTo' function. Provide a brief description of the contract's functionality and any other relevant details"
          ],
          "description": "Schema for representing the generated Solidity code and related details.",
    }
}
Inspect the output and then check if there are any error while converting it to json if yes then handle the issues any missing commas or quotes and then return the output
`}];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);
    // console.log(responseText);
    // console.log(jsonResponse);
    return jsonResponse;

  // const jsonResponse = JSON.parse(result.response.text);
  // console.log(jsonResponse);
  // return  jsonResponse;
}


// code_generate(
//   "{User Data Ownership and Control}",
//   "Integrate a smart contract system to give users complete ownership and control over their data. This would allow users to decide who has access to their data and how it is used.",
//   "You can use events to emit notifications when data ownership is transferred."
// );

// code_generate(
//   "Use NFTs to represent digital assets",
//   "Airdrop NFTs to your existing user base and create an NFT marketplace where users can buy, sell, and trade digital assets. This will allow users to create and trade unique digital assets that represent their creativity and individuality. Additionally, you can use decentralized autonomous organizations (DAOs) to create mechanisms to govern the app and make decisions about the future of the platform",
//   ""
// );



module.exports = { webScrape, code_generate };
// webScrape("https://www.amazon.com/")
