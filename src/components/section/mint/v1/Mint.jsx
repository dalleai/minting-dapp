import { useState } from "react";
import { useModal } from "../../../../utils/ModalContext";
import { Slider, SliderItem } from "../../../../common/slider/Slider";
import Button from "../../../../common/button";

import thumb1 from "../../../../assets/images/nft/emoji-img4.png";
import thumb2 from "../../../../assets/images/nft/emoji-img5.png";
import thumb3 from "../../../../assets/images/nft/emoji-img6.png";

import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useEffect } from "react";
import {
  maxSupplyCall,
  totalMintedCall,
  maxMintPerWalletCall,
  publicMintCostCall,
  publicMintCall
} from "../../../../contract/config";

import MintStyleWrapper from "./Mint.style";
import { ethers } from "ethers";
const Mint = () => {
  let [count, setCount] = useState(1);
  let [price, setPrice] = useState(0.001);
  const { mintModalHandle } = useModal();

  const slideImages = [thumb1, thumb2, thumb3];

  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    speed: 500,
    fade: true,
    autoplaySpeed: 500,
    centerMode: true,
    centerPadding: "0px",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleChenge = () => { };

  const [totalSupply, setTotalSupply] = useState(9999);
  const [totalMinted, setTotalMinted] = useState(4583);
  const [remainingItem, setRemainingItem] = useState(4583);
  const [maxMintPerWallet, setMaxMintPerWallet] = useState(2);
  const [publicMintCost, setPublicMintCost] = useState(0.15);

  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const { data: maxSupplyData } = useContractRead({ ...maxSupplyCall })
  const { data: totalMintedData } = useContractRead({ ...totalMintedCall })
  const { data: maxMintPerWalletData } = useContractRead({ ...maxMintPerWalletCall })
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
      if (maxSupplyData && totalMintedData) {
        setRemainingItem(totalSupply - totalMinted);
      }
      if (maxMintPerWalletData) {
        setMaxMintPerWallet(maxMintPerWalletData.toString());
      }
      if (publicMintCostData) {
        setPublicMintCost(publicMintCostData.toString() / 1000000000000000000);
      }
    }
  })

  const decreaseCount = () => {
    count -= 1;
    price = publicMintCost * count;
    if (count < 1) {
      count = 1;
      setCount(1);
      setPrice(publicMintCost);
    }
    else {
      setCount(count);
      setPrice(price);
    }
  }

  const increaseCount = () => {
    count += 1;
    price = publicMintCost * count;
    if (count > maxMintPerWallet) {
      count = maxMintPerWallet;
      setPrice(publicMintCost * maxMintPerWallet);
    }
    else {
      setCount(count);
      setPrice(price);
    }
  }

  const mintNow = () => {
    write?.();
  }

  return (
    <MintStyleWrapper>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="mint_left">
              <Slider {...settings}>
                {slideImages?.map((thumb, idx) => (
                  <SliderItem key={idx}>
                    <div className="mint_thumb">
                      <img src={thumb} alt="thumb" />
                    </div>
                  </SliderItem>
                ))}
              </Slider>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mint_right">
              <ul className="mint_count_list">
                <li>
                  <h5>Remaining</h5>
                  <h5>
                    {remainingItem} / <span>{totalSupply}</span>
                  </h5>
                </li>
                <li>
                  <h5>Price</h5>
                  <h5>{publicMintCost} ETH</h5>
                </li>
                <li>
                  <h5>Quantity</h5>
                  <div className="mint_quantity_sect">
                    <button
                      className="input_number_decrement"
                      onClick={() => decreaseCount()}
                    >
                      -
                    </button>
                    <input
                      className="input_number"
                      type="text"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    />
                    <button
                      className="input_number_increment"
                      onClick={() => increaseCount()}
                    >
                      +
                    </button>
                  </div>
                  <h5>
                    <span>{parseFloat(price).toFixed(3)}</span> ETH
                  </h5>
                </li>
              </ul>
              <Button lg variant="mint" onClick={() => mintNow()}>
                {" "}
                Mint now
              </Button>
              <p>
                By clicking “MINT”, You agree to our{" "}
                <a href="#">Terms of Service</a> and our{" "}
                <a href="#">Privacy Policy.</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MintStyleWrapper>
  );
};

export default Mint;
