import CountdDown from "../../../../common/countDown"
import Counter from "../../../../common/counter";
import Button from "../../../../common/button";
import MintStyleWrapper from "./Mint.style";

import checkIcon from "../../../../assets/images/icon/mint-right-text-icon.svg";
import data from "../../../../assets/data/mintItems";

import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useState, useEffect } from "react";
import {
  maxSupplyCall,
  totalMintedCall,
  publicMintCostCall,
  publicMintCall
} from "../../../../contract/config";
import { ethers } from "ethers";

const Mint = () => {
  let [count, setCount] = useState(1);
  let [price, setPrice] = useState(0.001);

  const [totalSupply, setTotalSupply] = useState(5555);
  const [totalMinted, setTotalMinted] = useState(5555);
  const [publicMintCost, setPublicMintCost] = useState(0.15);

  const { isConnected } = useAccount();

  const { data: maxSupplyData } = useContractRead({ ...maxSupplyCall })
  const { data: totalMintedData } = useContractRead({ ...totalMintedCall })
  const { data: publicMintCostData } = useContractRead({ ...publicMintCostCall })

  const { config } = usePrepareContractWrite({
    ...publicMintCall,
    args: [count,
      {
        gasLimit: "285000",
        value: ethers.utils.parseEther(price.toString())
      }],
  })
  const { write } = useContractWrite(config)

  useEffect(() => {
    if (isConnected) {
      if (maxSupplyData) {
        setTotalSupply(maxSupplyData.toString());
      }
      if (totalMintedData) {
        setTotalMinted(totalMintedData.toString());
      }
      if (publicMintCostData) {
        setPublicMintCost(publicMintCostData.toString() / 1000000000000000000);
      }
    }
  })

  const changeAmount = (amount) => {
    count = amount;
    price = amount * publicMintCost;
  }

  const mintNow = (mintAmount) => {
    changeAmount(mintAmount);
    write?.();
  }

  return (
    <MintStyleWrapper>
      <div className="container">
        <div className="mint_header">
          <div className="row align-items-end mint_header_row">
            <div className="col-md-4">
              <h4 className="text-uppercase counter_title">
                Public Mint end in
              </h4>
              <CountdDown date={Date.now() + 1675076996} />
            </div>
            <div className="col-md-4 text-center">
              <div className="mint_counter">
                <Counter end={totalMinted} duration={totalMinted} />
                <span> / {totalSupply}</span>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="sale_status text-right">
                WHITELIST : SOLDOUT
                <span>
                  <img src={checkIcon} alt="icon" />
                </span>
              </h4>
            </div>
          </div>
        </div>

        <div className="mint_items">
          <div className="row mint_items_row">
            {data?.map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div className="mint_item_card">
                  <span className="mint_offer_tag"> {item.featuredText} </span>
                  <div className="mint_thumb">
                    <img src={item.thumb} alt="mint thumb" />
                  </div>

                  <div className="item_content">
                    <h4>{item.title}</h4>
                    <span className="access_text">{item.accessText}</span>
                    <span>Unti Price: {item.unitPrice}</span>
                    <span>Total: {item.totalPrice}</span>
                  </div>
                  <Button lg variant="mint" onClick={() => mintNow(item.btnOnClick)}>
                    {item.btnText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MintStyleWrapper>
  );
};

export default Mint;
