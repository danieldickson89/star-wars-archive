import Navbar from "@/components/navbar/navbar";
import SearchResults from "@/components/search/search-results";
import { VStack } from "@chakra-ui/react";

const searchTerm = "c";

export async function getServerSideProps() {
  const res = await fetch(
    `http://localhost:3000/api/people?searchTerm=${searchTerm}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const results = await res.json();
  return {
    props: { results },
  };
}

export default function Home(results: any) {
  return (
    <>
      <VStack>
        <Navbar />
        <SearchResults data={results} />
      </VStack>
    </>
  );
}
