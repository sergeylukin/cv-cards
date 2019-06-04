import fetch from 'isomorphic-unfetch';

const Index = props => (
  <div>
    <h1>Candidates</h1>
    <ul>
      {props.candidates.map(candidate => (
        <li key={candidate.id}>
          <p>{candidate.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

Index.getInitialProps = async function() {
  const res = await fetch('http://hs-resume-data.herokuapp.com/');
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  let obj = {
    candidates: data.map((entry, key) => {
      return {
        id: key,
        name: entry.contact_info.name.formatted_name,
        experience: "bla bla",
      }
    })
  };
  console.log(obj)
  return obj
};

export default Index;
