export default function SearchResults(people: Person[]) {
  return (
    <>
      {people.length > 0 ? (
        people.map((person) => (
          <div key={person.url}>
            <div>Name: {person.name}</div>
          </div>
        ))
      ) : (
        <div></div>
      )}
    </>
  );
}
