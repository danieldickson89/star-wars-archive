import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  response: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(`https://swapi.dev.api/people/1/`);
    const data = await response.json();
    console.log(data);
    res.status(200).json({
      message: "Get Success",
      response: data,
    });
  } catch (e) {
    console.log(e);
  }
}
