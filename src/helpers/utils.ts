import { ethers, Signer, Wallet } from "ethers";

export type ShipShotProof = {
  signature: string;
  shotBy: string;
};

export type Coordinate = {
  x: number;
  y: number;
};
export type Ship = Array<Coordinate>;

export async function signShipCoordinates(ships: Array<Ship>, signer: Wallet) {
  let signedShips = [];

  for (const ship of ships) {
    let signedShip = [];
    for (const coord of ship) {
      let { flatSig } = await signCoordinate(coord, signer);
      signedShip.push(flatSig);
    }
    signedShips.push(signedShip);
  }
  return signedShips;
}

export async function signCoordinate(coord: Coordinate, signer: Signer) {
  let hashedCoord: string | Uint8Array = ethers.utils.solidityKeccak256(
    ["uint8", "uint8"],
    [coord.x, coord.y]
  );
  hashedCoord = ethers.utils.arrayify(hashedCoord);
  let flatSig = await signer.signMessage(hashedCoord);
  return { flatSig, hashedCoord };
}

export async function generateShipShotProof(
  player: Signer,
  enemy: string,
  battleshipGame: any
) {
  let shotReports = [];
  let playerShot = await battleshipGame.playerShots(enemy);
  let { flatSig } = await signCoordinate(playerShot, player);
  let report: ShipShotProof = {
    signature: flatSig,
    shotBy: enemy,
  };
  shotReports.push(report);

  return shotReports;
}

export const getCurrentUser = async () => {
  const storedWallet = localStorage.getItem("wallet");
  if (storedWallet) {
    const parsedStoredWallet = JSON.parse(storedWallet);
    const newWallet = new Wallet(parsedStoredWallet.privateKey);
    return newWallet;
  } else {
    const newWallet = Wallet.createRandom();
    localStorage.setItem(
      "wallet",
      JSON.stringify({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
      })
    );
    return newWallet;
  }
};
