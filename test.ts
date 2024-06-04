import Anthropic from "@anthropic-ai/sdk";
require("dotenv").config()

const anthropic = new Anthropic({
  apiKey: process.env.Claude_api, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  temperature: 0.9,
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": `Develop a Solidity smart contract to implement the following approach for the web application: ,                 Approach Heading: ${approachHeading}                Approach Content: ${approachContent}        Additional Details: ${additionalDetails}        Your task is to provide the Solidity code for the smart contract that will effectively integrate this approach into the web application.         Include relevant functions, variables, and any necessary logic to ensure the successful implementation of the specified feature. Avoid any backticks that might get involded while generating code        Ensure that the generated Solidity code:        1. Compiles without errors.        2. Is complete and ready for deployment.        3. The version of Solidity used is 0.8.0 and SPDX-License-Identifier should be MIT.        4. Create a 'transfer' function in a smart contract that allows the owner to transfer ownership to a specified address. Only the current owner should have the privilege to invoke this function.\n        Note: Consider best practices and security considerations for smart contracts during the development. \n    \n        I want the output  and  in following schema and make sure that there are no backticks involved give the output in precise schema below. Avoid using any backtics that are included and once done convert the output in below format \n{\n    \"response\": {\n          \"solidity_code\": \"Generated Solidity code for the specified approach\",\n          \"contract_name\": \"the smart contract generated for the specified approach\",\n          \"details\": [\n              \"compilation_status_confidence\": \"give theConfidence level (between 1 and 100 - 1 being least confident that it will compile successfully and 100 being completely sure that it will compile successfully) for the compilation status of the generated Solidity code\",\n\n              \"completeness_confidence\": \"give the Confidence level (between 1 and 100 - 1 being least confident that it will compile successfully and 100 being completely sure that it will compile successfully) for the completeness of the generated Solidity code\",\n\n              \"additional_notes\": \"Describe all the functions of the smart contract except the 'transferTo' function. Provide a brief description of the contract's functionality and any other relevant details\"\n          ],\n          \"description\": \"Schema for representing the generated Solidity code and related details.\",\n    }\n}\nInspect the output and then check if there are any error while converting it to json if yes then handle the issues any missing commas or quotes and then return the output`
        }
      ]
    }
  ]
});
console.log(msg);

const responseText = result.response.text();
const jsonResponse = JSON.parse(responseText);
console.log(responseText);
console.log(jsonResponse);
return jsonResponse;