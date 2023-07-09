import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  response: Person[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        let currPage = 1;
        let nextPageResults = true;
        let people: Person[] = [];
        const { searchTerm } = req.query;
        while (nextPageResults) {
          const response = await fetch(
            `https://swapi.dev/api/people/?search=${searchTerm}&page=${currPage}`
          );
          const data = await response.json();
          data.results.forEach((person: Person) => {
            people = [...people, person];
          });
          if (data.next != null) {
            currPage++;
          } else {
            nextPageResults = false;
          }
        }
        people.sort((a, b) => {
          return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
        });
        res.status(200).json({
          message: "Get Success",
          response: people,
        });
        break;
    }
  } catch (e) {
    res.status(500).json({
      message: "Get failure",
      response: [],
    });
  }
}
