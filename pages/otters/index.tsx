import React, { useEffect } from "react";
import Layout from "../../layout/main-layout";
import ItemCard from "../../components/item-card";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import GET_OTTER_LIST from "../../lib/apollo-graphql/queries/getOtterList";
import { initializeApollo } from "../../lib/apollo-graphql/apollo";
import { Otter as OtterType } from "../../lib/apollo-graphql/schema.types";

export default function Home({
  otters,
  res,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  useEffect(() => {
    console.log(otters);
    console.log(process.env);
  }, [otters, res]);
  return (
    <Layout home={true}>
      <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {otters &&
          otters.map((otter: OtterType, index: number) => {
            return (
              <div
                key={otter.id}
                onClick={() => router.push(`/otters/details/${otter.id}`)}
              >
                <ItemCard
                  src={otter.imageUrl || "/otter_1.jpg"}
                  name={otter?.name || ""}
                />
              </div>
            );
          })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const client = initializeApollo();
  const res = await client.query({
    query: GET_OTTER_LIST,
  });
  console.log(res);
  return {
    props: {
      otters: res.data.getOtterList,
      res,
    },
  };
}
