import React, { useEffect } from "react";
import { Wallet } from "ethers";
import { getShortenedAddress } from "@/helpers/helper";

const TitleBar = ({ wallet, setWallet }) => {
  const initWallet = async () => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      const parsedStoredWallet = JSON.parse(storedWallet);
      const newWallet = new Wallet(parsedStoredWallet.privateKey);
      setWallet(newWallet);
    } else {
      const newWallet = Wallet.createRandom();
      localStorage.setItem(
        "wallet",
        JSON.stringify({
          address: newWallet.address,
          privateKey: newWallet.privateKey,
        })
      );
      setWallet(newWallet);
    }
  };

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <div className="navbar">
      <h5>Battle Ship</h5>
      <div className="navbar__wallet">
        <div className="navbar__wallet__title">
          {wallet && getShortenedAddress(wallet.address)}
        </div>
      </div>
    </div>
  );
};

TitleBar.displayName = "TitleBar";

export default TitleBar;
