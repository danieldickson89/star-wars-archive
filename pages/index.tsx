import {
  Text,
  HStack,
  Input,
  VStack,
  CircularProgress,
  Box,
  Center,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  interface ApiResponse {
    message: string;
    response: Person[];
  }
  const [loadingPeople, setLoadingPeople] = useState<boolean>(false);
  const [loadingPerson, setLoadingPerson] = useState<boolean>(false);
  const [queryChanged, setQueryChanged] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [personData, setPersonData] = useState<ApiResponse>({
    message: "Success",
    response: [],
  });
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [activeCharacter, setActiveCharacter] =
    useState<CharacterDetails | null>(null);

  function updateQuery(text: string) {
    setActiveIndex(-1);
    setActiveCharacter(null);
    setQueryChanged(true);
    // Prevent query from updating if it's only blank spaces
    if (!text.replace(/\s/g, "").length) {
      setQuery("");
    } else {
      setQuery(text);
    }
  }

  const handleKeyDown = (event: any) => {
    if (query !== "" && event.key === "Enter") {
      getPeople();
    } else if (
      // Prevent spacebar from updating query unless there's already some text
      query === "" &&
      (event.code === "Space" || event.keyCode == "32")
    ) {
      event.preventDefault();
    }
  };

  function handleCharacterClick(index: number, url: string) {
    if (activeIndex !== index) {
      setActiveIndex(index);
      getPerson(url);
    }
  }

  async function getPeople() {
    if (query !== "") {
      setActiveCharacter(null);
      setActiveIndex(-1);
      setQueryChanged(false);
      setLoadingPeople(true);
      const res = await fetch(
        `http://localhost:3000/api/people?searchTerm=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const results = await res.json();
      setPersonData(results);
      setLoadingPeople(false);
    }
  }

  async function getPerson(url: string) {
    setLoadingPerson(true);
    const urlArray = url.split("/");
    const id = urlArray[5];
    const res = await fetch(`http://localhost:3000/api/person?id=${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const details = await res.json();
    const characterDetails: CharacterDetails = details.response;
    setActiveCharacter(characterDetails);
    setLoadingPerson(false);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (query !== "") getPeople();
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <>
      <VStack m="1rem">
        <HStack spacing="4">
          <Text fontSize="5xl">Star Wars Archive</Text>
        </HStack>
        <HStack>
          <Input
            textAlign="center"
            width="25rem"
            placeholder={
              query == "" ? "Enter Star Wars character's name..." : query
            }
            onChange={(e) => updateQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </HStack>
        {query === "" || queryChanged || activeCharacter != null ? (
          <div></div>
        ) : loadingPeople ? (
          <CircularProgress isIndeterminate color="cyan.300"></CircularProgress>
        ) : personData &&
          personData.response &&
          personData.response.length > 0 ? (
          <Box
            className={utilStyles.roundedBorder}
            overflowY="auto"
            maxHeight="30em"
            width="25rem"
            minH="2em"
          >
            {" "}
            {personData.response.map((person: Person, index: number) => (
              <Center key={person.url}>
                <Box
                  className={
                    utilStyles.characterRow +
                    " " +
                    (index == activeIndex ? utilStyles.selectedCharacter : "")
                  }
                  textAlign="center"
                  width="100%"
                  padding=".5rem"
                  cursor="pointer"
                  onClick={() => handleCharacterClick(index, person.url)}
                >
                  {person.name}
                </Box>
              </Center>
            ))}
          </Box>
        ) : (
          <div>No Results</div>
        )}
        {loadingPerson ? (
          <CircularProgress isIndeterminate color="cyan.300"></CircularProgress>
        ) : activeCharacter == null ? (
          <div></div>
        ) : (
          <Card width="25rem">
            <CardHeader>
              <Heading size="md">{activeCharacter?.person?.name}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {activeCharacter &&
                activeCharacter.starships &&
                activeCharacter.starships.length <= 0 ? (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      STARSHIPS
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      No starships
                    </Text>
                  </Box>
                ) : (
                  activeCharacter.starships.map(
                    (starship: Starship, index: number) => (
                      <Box key={starship.url}>
                        <Heading size="xs" textTransform="uppercase">
                          STARSHIP{index + 1}
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          Name: {starship.name}
                        </Text>
                        <Text pt="2" fontSize="sm">
                          Cargo: {starship.cargo_capacity}
                        </Text>
                        <Text pt="2" fontSize="sm">
                          Class: {starship.starship_class}
                        </Text>
                      </Box>
                    )
                  )
                )}
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    HOME PLANET
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Name:{" "}
                    {activeCharacter?.homeworld?.name
                      ? activeCharacter?.homeworld?.name
                      : "unknown"}
                  </Text>
                  <Text pt="2" fontSize="sm">
                    Population:{" "}
                    {activeCharacter?.homeworld?.population
                      ? activeCharacter?.homeworld?.population
                      : "unknown"}
                  </Text>
                  <Text pt="2" fontSize="sm">
                    Climate:{" "}
                    {activeCharacter?.homeworld?.climate
                      ? activeCharacter?.homeworld?.climate
                      : "unknown"}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    SPECIES
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Name:{" "}
                    {activeCharacter?.species[0]?.name
                      ? activeCharacter?.species[0]?.name
                      : "unknown"}
                  </Text>
                  <Text pt="2" fontSize="sm">
                    Language:{" "}
                    {activeCharacter?.species[0]?.language
                      ? activeCharacter?.species[0]?.language
                      : "unknown"}
                  </Text>
                  <Text pt="2" fontSize="sm">
                    Lifespan:{" "}
                    {activeCharacter?.species[0]?.average_lifespan
                      ? activeCharacter?.species[0]?.average_lifespan
                      : "unknown"}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </>
  );
}
