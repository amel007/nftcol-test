const { TonClient, abiContract, signerKeys } = require("@tonclient/core");
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
  const SEED_PHRASE_WORD_COUNT = 12;
  const SEED_PHRASE_DICTIONARY_ENGLISH = 1;
  const HD_PATH = "m/44'/396'/0'/0/0";
  const { crypto } = client;
  const { phrase } = await crypto.mnemonic_from_random({
    dictionary: SEED_PHRASE_DICTIONARY_ENGLISH,
    word_count: SEED_PHRASE_WORD_COUNT,
  });
  console.log(`Generated seed phrase "${phrase}"`);
  let keyPair = await crypto.mnemonic_derive_sign_keys({
    phrase,
    path: HD_PATH,
    dictionary: SEED_PHRASE_DICTIONARY_ENGLISH,
    word_count: SEED_PHRASE_WORD_COUNT,
  });
  const rootKeys = signerKeys(keyPair);
  console.log(rootKeys);

  const rootDeployerAcc = new Account(DeployerColectionContract, {
    signer: rootKeys,
    client,
  });
  const address = await rootDeployerAcc.getAddress();
  console.log(`Future address of the contract will be: ${address}`);

  const deployMessage = await client.abi.encode_message(await rootDeployerAcc.getParamsOfDeployMessage({
    initFunctionName:"constructor",
    initInput:{
      codeNftRoot:NftRootContract.code,
      codeIndex:IndexContract.code,
      codeData:DataContract.code,
      codeStorage:StorageContract.code,
      codeMetadata:MetadataContract.code,
    },
  }));
  // const deployMessage = await client.abi.encode_message({
  //   abi: rootAcc.abi,
  //   deploy_set: {
  //     tvc: NftRootContract.tvc,
  //     initial_data: {}
  //   },
  //   // can be ommited here for address calculation
  //   call_set: {
  //     function_name: 'constructor',
  //     input: {
  //       codeIndex:IndexContract.code,
  //       codeData:DataContract.code,
  //       codeStorage:StorageContract.code,
  //       codeMetadata:MetadataContract.code,
  //       fees:10,
  //       costMint: 1000000000,
  //       addrOwner: '0:835ebc5dc3b3370b77f15ecf4e62add730f67ef5605c9b2c976e38c0ec6ce3d6'
  //     }
  //   },
  //   signer: rootKeys
  // });

  // Seed phrase: "pelican begin hill vessel energy pledge remind month token clarify thrive season"
  // Raw address: 0:0a3fcf4c8973bbbb1497c4ccf2cc8b140eb3103755c0133db36fe5dc6cc84461


    if (networkSelector == 0) {
      const giver = await Account.getGiverForClient(client);
      await giver.sendTo(address, 100_000_000_000);
      console.log(`Grams were transferred from giver to ${address}`);
    } else if (networkSelector == 1) {
      const giverNTDAddress = JSON.parse(fs.readFileSync('../keys/GiverContractNTD.json',{encoding: "utf8"})).address;;
      const giverNTDKeys = JSON.parse(fs.readFileSync('../keys/GiverContractNTD.json',{encoding: "utf8"})).keys;
      const giverNTDAcc = new Account(GiverContract, {address: giverNTDAddress,signer: giverNTDKeys,client,});
      // Call `sendTransaction` function
      response = await giverNTDAcc.run("sendTransaction", {dest:address,value:1000000000,bounce:false});
      console.log("Giver send 1 ton to address:", address, response.decoded.output);
    } else if (networkSelector == 2){
      console.log('Pls set giver for main.ton.dev');
    } else if (networkSelector == 3){
      const giverRTDAddress = JSON.parse(fs.readFileSync('./GiverContractRTD.json',{encoding: "utf8"})).address;;
      const giverRTDKeys = JSON.parse(fs.readFileSync('./GiverContractRTD.json',{encoding: "utf8"})).keys;
      const giverRTDAcc = new Account(GiverContract, {address: giverRTDAddress,signer: giverRTDKeys,client,});
      // Call `sendTransaction` function
      response = await giverRTDAcc.run("sendTransaction", {dest:rootAddr,value:1000000000,bounce:false});
      console.log("Giver send 1 ton to rootAddr:", response.decoded.output);
    } else if (networkSelector == 4){
      const giverFLDAddress = JSON.parse(fs.readFileSync('./GiverContractFLD.json',{encoding: "utf8"})).address;;
      const giverFLDKeys = JSON.parse(fs.readFileSync('./GiverContractFLD.json',{encoding: "utf8"})).keys;
      const giverFLDAcc = new Account(GiverContract, {address: giverFLDAddress,signer: giverFLDKeys,client,});
      // Call `sendTransaction` function
      response = await giverFLDAcc.run("sendTransaction", {dest:rootAddr,value:1000000000,bounce:false});
      console.log("Giver send 1 ton to rootAddr:", response.decoded.output);
    } else {console.log('networkSelector is incorrect');}

    const keyJson = JSON.stringify({address:address, keys:rootKeys, seed:phrase});
    fs.writeFileSync( pathJson, keyJson,{flag:'w'});

    console.log("Future address of the contract  and keys written successfully to:", pathJson);




  let shard_block_id;
  shard_block_id = (await client.processing.send_message({
      message: deployMessage.message,
      send_events: true,
    }, logEvents,
  )).shard_block_id;
  console.log(`Deploy message was sent.`);

  // Monitor message delivery.
  // See more info about `wait_for_transaction` here
  // https://github.com/tonlabs/TON-SDK/blob/master/docs/mod_processing.md#wait_for_transaction
  const deploy_processing_result = await client.processing.wait_for_transaction({
    abi: abiContract(rootDeployerAcc.abi),
    message: deployMessage.message,
    shard_block_id: shard_block_id,
    send_events: true,
  },
  logEvents,
  );
  // console.log(`Deploy transaction: ${JSON.stringify(deploy_processing_result.transaction, null, 2)}`);
  // console.log(`Deploy fees: ${JSON.stringify(deploy_processing_result.fees, null, 2)}`);
  console.log(`Contract was deployed at address: ${address}`);

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
