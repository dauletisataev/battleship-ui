import { ethers, Wallet } from "ethers";
import { Coordinate, signShipCoordinates } from "./utils";

const provider = new ethers.providers.JsonRpcProvider(
  "https://zero.alt.technology"
);
const battleshipContractAddress = "0x2349A826DDfFF201De6319dF7D6c134d11a05ad4";
const battleshipContractABI = [
  "function joinGame(bytes[] memory _playerShips) public",
];

export const joinGame = async (
  playerDeployedShips: { occupiedBlocks: string[] }[],
  signer: Wallet
) => {
  const shipCoordinates: Coordinate[][] = playerDeployedShips.map((ship) => {
    return ship.occupiedBlocks.map((block) => {
      const x = block[0];
      const y = block[1];
      return { x: parseInt(x), y: parseInt(y) };
    });
  });

  const signedShips = await signShipCoordinates(shipCoordinates, signer);

  // Step 1: Populate the transaction
  const battleshipContract = new ethers.Contract(
    battleshipContractAddress,
    battleshipContractABI,
    signer
  );
  const txRequest = await battleshipContract.populateTransaction.joinGame(
    signedShips.flat()
  );

  console.log("txRequest", txRequest);

  const currentNonce = await provider.getTransactionCount(
    signer.address,
    "latest"
  );
  txRequest.nonce = currentNonce;

  // Step 2: Sign the transaction
  const signedTx = await signer.signTransaction(txRequest);

  // Step 3: Send the transaction via the provider
  const txResponse = await provider.sendTransaction(signedTx);
  console.log("provider");

  console.log(`Transaction hash: ${txResponse.hash}`);

  await txResponse.wait();
  console.log(`Transaction confirmed in block: ${txResponse.blockNumber}`);
};
