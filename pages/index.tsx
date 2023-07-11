import {
  Text,
  Button,
  HStack,
  Input,
  VStack,
  CircularProgress,
  Box,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import utilStyles from "../styles/utils.module.css";

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

  const handleKeyDown = (event: any) => {
    if (searchTerm !== "" && event.key === "Enter") {
      getPeople();
    }
  };

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
      return (
        <Box
          className={utilStyles.roundedBorder}
          overflowY="auto"
          maxHeight="30em"
          width="29rem"
          minH="2em"
        >
          {" "}
          {data.response.map((person) => (
            <Center>
              <Box
                className={utilStyles.characterRow}
                textAlign="center"
                width="100%"
                padding=".5rem"
                key={person.url}
                cursor="pointer"
              >
                {person.name}
              </Box>
            </Center>
          ))}
        </Box>
      );
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
            onKeyDown={handleKeyDown}
          />

          <Button onClick={getPeople}>GET</Button>
        </HStack>
        {showResults()}
      </VStack>
    </>
  );
}
