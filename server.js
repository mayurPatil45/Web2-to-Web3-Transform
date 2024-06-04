// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const {webScrape, code_generate, } = require("./llmCalls")
const {doc_generate} = require("./test")
const {compileContract} = require("./magicDeploy")
const fs = require('fs')
const path = require('path');
const AdmZip = require('adm-zip');



// const bodyParser = require('body-parser');
const cors = require('cors')

// Create an Express app
const app = express();
const PORT = 3000;

// Parse application/json
app.use(bodyParser.json());
app.use(cors())


app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
    const data = await webScrape(url);
    res.json({ data });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/generate_code', async (req, res) => {
  try {

    // console.log(req.body)
    const { approach_heading, approach_content, user_approach } = req.body;

    // Call the code_generate function with provided parameters
    const generatedCode = await code_generate(approach_heading, approach_content, user_approach);

    console.log("code generated")
    // console.log(approach_heading)
    // console.log(approach_content)
    // console.log(user_approach)
    let contractCode = generatedCode.response.solidity_code;
    
    let contractName = generatedCode.response.contract_name;
    module.exports = {contractName, contractCode}

    // Respond with the generated code
    res.json({ generatedCode });
    const response = generatedCode;
    // console.log(response)

 
    // console.log(code)
    // console.log(name)
  
    
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'An error occurred while generating code.' });
  }
});

app.post('/insert_code', async (req, res) => {
  try {
    const { code, contractName } = req.body;

    // Check if code and contractName are provided
    if (!code || !contractName) {
      return res.status(400).json({ error: "Both code and contractName are required." });
    }


    // console.log(contractName)
    console.log("started insertion")
    const contractPath = path.join(__dirname, "/Hardhat/contracts/Test.sol");
    fs.writeFileSync(contractPath, code);
    console.log("Done inserting and testing")

    // Compile the contract
    // const { bytecode, abi } = compileContract(contractName, code);
    // console.log(bytecode)
    // console.log(abi)
  
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }

  res.status(200).json({ message: "Code processed successfully" });
});


// Path to the modified Hardhat folder
const hardhatFolderPath = './Hardhat';

// Function to compress the Hardhat folder and send it as a downloadable file
app.post('/download_hardhat', (req, res) => {
  try {
    // Check if the directory exists
    if (!fs.existsSync(hardhatFolderPath)) {
      return res.status(400).json({ error: "Hardhat folder path does not exist." });
    }
    console.log("compilation done")
    console.log("zipping started")
    // Create a zip file in memory
    const zip = new AdmZip();
    zip.addLocalFolder(hardhatFolderPath);

    // Convert the zip file to a buffer
    const zipBuffer = zip.toBuffer();

    // Set headers to indicate that the response is a zip file and force download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=hardhat_folder.zip');
    res.setHeader('Content-Length', zipBuffer.length);

    // Send the zip file buffer
    res.send(zipBuffer);
    console.log("zipping done")
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const artifactFolderPath = './Hardhat/artifacts';

app.post("/download_artifacts", async (req, res) => {
  try {
    // Check if the directory exists
    if (!fs.existsSync(hardhatFolderPath)) {
      return res.status(400).json({ error: "artifact folder path does not exist." });
    }
    console.log("download started")
    // Create a zip file in memory
    const zip = new AdmZip();
    zip.addLocalFolder(artifactFolderPath);

    // Convert the zip file to a buffer
    const zipBuffer = zip.toBuffer();

    // Set headers to indicate that the response is a zip file and force download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=artifact_folder.zip');
    res.setHeader('Content-Length', zipBuffer.length);

    // Send the zip file buffer
    res.send(zipBuffer);
    console.log("download done")
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal server error." });
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

