import * as React from "react";
import ComponentUser from "./component";

import type { Metadata } from "next";

type PropsUser = {
  params: { id: string };
};

export async function generateMetadata({ params }: PropsUser): Promise<Metadata> {
  const decodedId = decodeURIComponent(params?.id);
  const paramsUser = decodedId.split("@");

  return {
    title: `BookHub | ${paramsUser[1]}`,
    description: `Ini merupakan halaman profil ${paramsUser[1]}`,
  };
}

const UserProfil: React.FC<PropsUser> = ({ params }) => {
  const decodedId = decodeURIComponent(params?.id);
  const splitParams = decodedId.split("@");
  const username = splitParams[1];

  return <ComponentUser username={username} />;
};

export default UserProfil;
