import fetch from 'isomorphic-unfetch';

const Index = props => (
  <div>
    <h1>Our awesome candidates</h1>
    {props.candidates.map(candidate => (
      <div key={candidate.id} className={ "candidate" }>
        <p>{ `Hello ${candidate.name}` }</p>
        {candidate.experience.length > 0 ?
          <ul>
            {candidate.experience.map(experience => (
              <li>{ `Worked as: ${experience.JOB_TITLE}, From ${experience.START_DATE} To ${experience.END_DATE}` }</li>
            ))}
          </ul>
          :
            <ul><li>No work experience :(</li></ul>
        }
      </div>
    ))}
    <style jsx>{`
      .candidate {
        padding: 2rem;
      }
    `}</style>
  </div>
);

Index.getInitialProps = async function() {
  const res = await fetch('http://hs-resume-data.herokuapp.com/');
  const data = await res.json();

  console.log(`Data fetched. Count: ${data.length}`);

  return {
    candidates: data.map((entry, key) => {
      return {
        id: key,
        name: entry.contact_info.name.formatted_name,
        experience: entry['experience'].map(experience => {
          return {
            JOB_TITLE: experience.title,
            START_DATE: experience.start_date,
            END_DATE: experience.end_date,
          }
        }),
      }
    })
  };
};

export default Index;
