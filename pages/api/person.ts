import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  response: {
    person: Person | null;
    homeworld: Planet | null;
    starships: Starship[];
    species: Species[];
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        const { id } = req.query;
        const personResponse = await fetch(
          `https://swapi.dev/api/people/${id}`
        );
        const person: Person = await personResponse.json();
        const starshipUrls = person.starships;
        let starships: Starship[] = [];
        for (const starshipUrl of starshipUrls) {
          const starshipUrlResponse = await fetch(starshipUrl);
          await starshipUrlResponse.json().then((ship: Starship) => {
            starships = [...starships, ship];
          });
        }
        const homeworldUrl: string = person.homeworld;
        const homeworldUrlResponse = await fetch(homeworldUrl);
        const homeworld: Planet = await homeworldUrlResponse.json();
        const speciesUrls: string[] = person.species;
        let allSpecies: Species[] = [];
        for (const speciesUrl of speciesUrls) {
          const speciesResponse = await fetch(speciesUrl);
          await speciesResponse.json().then((species: Species) => {
            allSpecies = [...allSpecies, species];
          });
        }
        res.status(200).json({
          message: "GET success",
          response: {
            person: person,
            homeworld: homeworld,
            starships: starships,
            species: allSpecies,
          },
        });
        break;
    }
  } catch (e) {
    res.status(500).json({
      message: "GET failed",
      response: {
        person: null,
        homeworld: null,
        starships: [],
        species: [],
      },
    });
  }
}