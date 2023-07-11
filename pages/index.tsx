import {
  Text,
  Button,
  HStack,
  Input,
  VStack,
  CircularProgress,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  interface ApiResponse {
    message: string;
    response: Person[];
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTermChanged, setSearchTermChanged] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<ApiResponse>({
    message: "Success",
    response: [],
  });

  function updateSearchTerm(text: string) {
    setSearchTermChanged(true);
    setSearchTerm(text);
  }

  async function getPeople() {
    setSearchTermChanged(false);
    setLoading(true);
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
    setData(results);
    setLoading(false);
  }

  function showResults() {
    if (searchTerm === "" || searchTermChanged) {
      return <div></div>;
    } else if (loading) {
      return (
        <CircularProgress isIndeterminate color="cyan.300"></CircularProgress>
      );
    } else if (data && data.response && data.response.length > 0) {
      return data.response.map((person) => (
        <div key={person.url}>
          <div>{person.name}</div>
        </div>
      ));
    } else {
      return <div>No Results</div>;
    }
  }

  return (
    <>
      <VStack>
        <HStack spacing="4">
          <Text fontSize="5xl">Star Wars Archive</Text>
        </HStack>
        <HStack>
          <Input
            textAlign="center"
            width="25rem"
            placeholder={
              searchTerm == ""
                ? "Enter Star Wars character's name..."
                : searchTerm
            }
            onChange={(e) => updateSearchTerm(e.target.value)}
          />

          <Button onClick={getPeople}>GET</Button>
        </HStack>
        {showResults()}
      </VStack>
    </>
  );
}
