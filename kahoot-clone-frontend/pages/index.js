import Header from "../Components/header";
import styles from "../styles/index.module.css";
import Image from "next/image";
import GameButton from "../Components/GameButton";
import Link from "next/link";
import { useRouter } from "next/router";

function index() {
  const router = useRouter();
  return (
    <div className={`vh100 ${styles.lightGrey} ${styles.center}`}>
      <div className={`${styles.card}`}>
        <div>
          <Image
            src={"/kahootLogo.svg"}
            alt="Kahoot Logo"
            layout="fill"
          ></Image>
        </div>
        <GameButton
          onClick={() => {
            router.push("/play");
          }}
          backgroundStyle={{
            backgroundColor: "rgb(14,78,154)",
          }}
          foregroundStyle={{
            backgroundColor: "rgb(19,104,206)",
            padding: "10px 16px 10px 16px",
          }}
        >
          Play
        </GameButton>
        <GameButton
          onClick={() => {
            router.push("/create");
          }}
          backgroundStyle={{
            backgroundColor: "rgb(14,78,154)",
          }}
          foregroundStyle={{
            backgroundColor: "rgb(19,104,206)",
            padding: "10px 16px 10px 16px",
          }}
        >
          Create
        </GameButton>
      </div>
    </div>
  );
}

export default index;
