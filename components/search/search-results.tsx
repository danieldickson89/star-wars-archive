interface ApiResponse {
  results: {
    message: string;
    response: Person[];
  };
}

export default function SearchResults(props: { data: ApiResponse }) {
  const currentPeople = props.data.results.response;

  return (
    <>
      {currentPeople.length > 0 ? (
        currentPeople.map((person) => (
          <div key={person.url}>
            <div>{person.name}</div>
          </div>
        ))
      ) : (
        <div>No Results</div>
      )}
    </>
  );
}
