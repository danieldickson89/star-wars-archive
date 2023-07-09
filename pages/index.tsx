import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/navbar/navbar";
import SearchResults from "@/components/search/search-results";
import { VStack } from "@chakra-ui/react";
import Searchbar from "@/components/search/searchbar";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps() {
  const res = await fetch(`https://swapi.dev/api/people/?search=c`);
  const data = await res.json();
  const results: Person[] = data.results;
  return {
    props: { results },
  };
}

export default function Home(results: Person[]) {
  return (
    <>
      <VStack>
        <Navbar />
        <Searchbar />
      </VStack>
    </>
  );
}
