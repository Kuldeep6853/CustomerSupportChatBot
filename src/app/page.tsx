
import { getSession } from "@/lib/getSession";
import HomeClient from "./components/HomeClient";


export default async function Home() {
  const session=await getSession()
  const email=session?.user?.email;
  return (
    <>
    <HomeClient email={email} />
    </>
  );
}
