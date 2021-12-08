const { TonClient, signerNone, abiContract, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");
const { Account } = require("@tonclient/appkit");
const { DeployerColectionContract } = require("../ton-packages/DeployerColection.js");
const { NftRootContract } = require("../ton-packages/NftRoot.js");
const { DataContract } = require("../ton-packages/Data.js");
const { IndexContract } = require("../ton-packages/Index.js");
const { MetadataContract } = require("../ton-packages/Metadata.js");
const { StorageContract } = require("../ton-packages/Storage.js");
const { GiverContract } = require("../ton-packages/Giver.js");
const { SetcodeMultisigWalletContract } = require("../ton-packages/SetcodeMultisigWallet.js");
const fs = require('fs');
const pathJson = '../keys/DeployerColection.json';

const dotenv = require('dotenv').config();
const networks = ["http://localhost",'net1.ton.dev','main.ton.dev','rustnet.ton.dev','https://gql.custler.net'];
const hello = ["Hello localhost TON!","Hello dev net TON!","Hello main net TON!","Hello rust dev net TON!","Hello fld dev net TON!"];
const networkSelector = process.env.NET_SELECTOR;

const zeroAddress = '0:0000000000000000000000000000000000000000000000000000000000000000';


TonClient.useBinaryLibrary(libNode);

async function logEvents(params, response_type) {
  // console.log(`params = ${JSON.stringify(params, null, 2)}`);
  // console.log(`response_type = ${JSON.stringify(response_type, null, 2)}`);
}

async function main(client) {
  let response;

  const rootDeployerAddr = JSON.parse(fs.readFileSync(pathJson,{encoding: "utf8"})).address;
  const rootDeployerKeys = JSON.parse(fs.readFileSync(pathJson,{encoding: "utf8"})).keys;

  console.log("address of deployerCollection:", rootDeployerAddr);

  const rootDeployerAcc = new Account(DeployerColectionContract, {
    address:rootDeployerAddr,
    signer: rootDeployerKeys,
    client,
  });


  const giverNTDAddress = process.env.MAIN_GIVER_ADDRESS;
  const giverNTDKeys = signerKeys({
    public: process.env.MAIN_GIVER_PUBLIC,
    secret: process.env.MAIN_GIVER_SECRET
  });
  const giverNTDAcc = new Account(SetcodeMultisigWalletContract, {address: giverNTDAddress,signer: giverNTDKeys,client,});

  console.log("deploy Collection for:", giverNTDAddress);

  const { body } = (await client.abi.encode_message_body({
    abi: rootDeployerAcc.abi,
    call_set: {
      function_name: "deployColection",
      input: {
        addrOwner:giverNTDAddress,
        fees:10,
        costMint:1000000000,
      },
    },
    is_internal: true,
    signer: signerNone(),
  }));

  console.log(body);


  response = await giverNTDAcc.run("sendTransaction", {
    dest: rootDeployerAddr,
    value: 1500000000,
    bounce: true,
    flags: 3,
    payload: body,
  });

  console.log("Deployed collection for owner address:", giverNTDAddress, response.decoded.output);

}

(async () => {
  const client = new TonClient({network: { endpoints: [networks[networkSelector]],},});
  try {
    console.log(hello[networkSelector]);
    await main(client);
    process.exit(0);
  } catch (error) {
    if (error.code === 504) {
      console.error(`Network is inaccessible. Pls check connection`);
    } else {
      console.error(error);
    }
  }
  client.close();
})();
