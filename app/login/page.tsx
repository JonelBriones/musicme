"use server";
import { getProviders, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Login from "../../components/Login";

const page = async () => {
  return <Login />;
};

export default page;

// export async function getServerSideProps() {
//   const providers = await getProviders();
//   return {
//     props: {
//       providers,
//     },
//   };
// }
