import { getSession } from "@/lib/getSession";
import React from "react";
import EmbedClient from "../components/EmbedClient";

const page = async () => {
  const session = await getSession();

  return <>{session?.user?.id && <EmbedClient ownerId={session.user.id} />}</>;
};

export default page;
