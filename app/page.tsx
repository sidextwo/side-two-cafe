import { getImages } from "@/lib/getImages";
import HomeClient from "./home-client";

export default function Page() {
  const images = getImages();

  return <HomeClient images={images} />;
}