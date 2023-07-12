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

export async function getServerSideProps() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return {
    props: { apiBaseUrl },
  };
}

export default function Home(props: any) {
  const [peopleNamesAndIds, setPeopleNamesAndIds] = useState<
    PersonNameAndId[] | null
  >(null);
  const [loadingPeople, setLoadingPeople] = useState<boolean>(false);
  const [loadingPerson, setLoadingPerson] = useState<boolean>(false);
  const [queryChanged, setQueryChanged] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [personData, setPersonData] = useState<PersonNameAndId[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [activeCharacter, setActiveCharacter] =
    useState<CharacterDetails | null>(null);

  async function getAllPeopleNamesAndIds() {
    if (peopleNamesAndIds == null) {
      let res = await fetch(`${props.apiBaseUrl}peopleNamesAndIds`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const apiRes = await res.json();
      const peopleNamesAndIds = apiRes.response;
      setPeopleNamesAndIds(peopleNamesAndIds);
    }
  }

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
      let results: PersonNameAndId[] = [];
      if (peopleNamesAndIds && peopleNamesAndIds.length > 0) {
        for (const person of peopleNamesAndIds) {
          if (person.name.toLowerCase().includes(query.toLowerCase())) {
            results = [...results, person];
          }
        }
      }
      setPersonData(results);
      setLoadingPeople(false);
    }
  }

  async function getPerson(id: string) {
    setLoadingPerson(true);
    const res = await fetch(`${props.apiBaseUrl}person?id=${id}`, {
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
      if (peopleNamesAndIds == null) getAllPeopleNamesAndIds();
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <>
      <VStack m="1rem">
        <HStack spacing="4">
          <Text fontSize="5xl">Star Wars Archive</Text>
        </HStack>
        {peopleNamesAndIds && peopleNamesAndIds.length > 0 ? (
          <Center>
            <Box>
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
                <CircularProgress
                  isIndeterminate
                  color="cyan.300"
                ></CircularProgress>
              ) : personData && personData.length > 0 ? (
                <Box
                  className={utilStyles.roundedBorder}
                  overflowY="auto"
                  maxHeight="30em"
                  width="25rem"
                  minH="2em"
                >
                  {" "}
                  {personData.map((person: PersonNameAndId, index: number) => (
                    <Center key={person.id}>
                      <Box
                        className={
                          utilStyles.characterRow +
                          " " +
                          (index == activeIndex
                            ? utilStyles.selectedCharacter
                            : "")
                        }
                        textAlign="center"
                        width="100%"
                        padding=".5rem"
                        cursor="pointer"
                        onClick={() => handleCharacterClick(index, person.id)}
                      >
                        {person.name}
                      </Box>
                    </Center>
                  ))}
                </Box>
              ) : (
                <Center mt=".5rem">
                  <Text fontSize="md" color="gray.400">
                    No Results
                  </Text>
                </Center>
              )}
              {loadingPerson ? (
                <Center mt=".5rem">
                  <CircularProgress
                    isIndeterminate
                    color="cyan.300"
                  ></CircularProgress>
                </Center>
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
            </Box>
          </Center>
        ) : (
          <Center>
            <VStack>
              <Text fontSize="md" color="gray.400">
                Connecting to the archive...
              </Text>
              <CircularProgress
                isIndeterminate
                color="cyan.300"
              ></CircularProgress>
            </VStack>
          </Center>
        )}
      </VStack>
    </>
  );
}
