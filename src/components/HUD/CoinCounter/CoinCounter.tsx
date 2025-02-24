import imgCoin25 from "../../../../public/img/coin-25.png"
import imgTimes from "../../../../public/img/times.png"
import Image from "next/image"
import { pixelifySans } from "@/fonts"
import styles from './CoinCounter.module.css';

interface CoinCounterProps {
  coins: number
}

const CoinCounter = ({ coins = 0 }: CoinCounterProps) => {
  return (
    <div className="flex justify-between items-end gap-[10px]">
      
      <div className="w-[21px] flex justify-center">
        <Image
          src={imgCoin25}
          alt="coin"
          className={styles.spinCoin}
        />
      </div>

      <Image
        src={imgTimes}
        alt="count"
        width={12.82}
        height={12.82}
        className="w-[12.82px] h-[12.82px] mb-1"
      />
      
      <span className={`${pixelifySans.className} text-3xl leading-6`}>{coins}</span>


    </div>
  )
}

export default CoinCounter