import HomeClient from "../components/HomeClient";
import HeroServer from "../components/HeroServer";

export default function Home() {
  return <HomeClient hero={<HeroServer />} />;
}
