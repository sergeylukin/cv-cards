import fetch from 'isomorphic-unfetch';
import styled from 'styled-components'
import moment from 'moment'
import getConfig from 'next/config'

const { API_URL } = getConfig().publicRuntimeConfig

const Container = styled.div`
  ${props => props.theme.screens.smallUp} {
    column-count: 2;
    column-gap: 0;
    height: 200%;
    max-width: 1000px;
    margin: auto auto;
  }
`

const ExpandButton = styled.a`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  cursor: pointer;
  text-decoration: underline;
`

const Title = styled.h1`
  font-weight: normal;

  ${props => props.theme.screens.onlySmall} {
    position: absolute;
    top: 110px;
    left: 20px;
    color: white;
    background-color: rgba(0, 0, 0, .5);
    padding: .5rem 1rem;
  }

  ${props => props.theme.screens.smallUp} {
    color: black;
    padding: 1rem 0 0 1rem;
  }
`

const AvatarExperienceContainer = styled.div`
  ${props => props.theme.screens.smallUp} {
    display: flex;
    flex-direction: row;
  }
  padding: 0 0 1rem;
`

const Experience = styled.ul`
  list-style: none;
  padding: 1rem;
  ${props => props.theme.screens.smallUp} {
    padding: 0 1rem 0;
  }

  li {
    padding: 0 0 1rem;
  }
`

const Item = styled.div`
  break-inside: avoid;
  overflow: hidden;
  padding: 1rem;
`

const Avatar = styled.div`
  background-size: cover;
  background-position: center;

  ${props => props.theme.screens.onlySmall} {
    min-height: 200px;
  }

  ${props => props.theme.screens.smallUp} {
    background-repeat: no-repeat;
    width: 100px;
    height: 100px;
    min-height: 100px;
    margin-left: 1rem;
  }
`

const Card = styled.article`
  font-family: 'Verdana';
  position: relative;

  background-color: rgba(211, 211, 211, .3);

  box-shadow: 0 0 6px rgba(0, 0, 0, .3);
`

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      candidatesFullViewToggleMap: props.candidates.map(candidate => (
        false
      ))
    };
  }

  toggleCandidateFullView(id) {
    this.setState({
      candidatesFullViewToggleMap: this.state.candidatesFullViewToggleMap.map((value, index) => (id === index) ? !value : value)
    })
  }

  render() {
    const { props, state } = this

    return (
      <Container>
        {props.candidates.map(candidate => (
          <Item key={candidate.id}>
            <Card>
              <Title>{ candidate.CANDIDATE_NAME }</Title>
              <AvatarExperienceContainer>
                <Avatar style={{backgroundImage: `url(${candidate.AVATAR_URL})`}} />
                {candidate.experience.length > 0 ?
                  <Experience>
                    {candidate.experience.map((experience, index) => {
                      if (index < 2 || state.candidatesFullViewToggleMap[candidate.id]) {
                        return (
                          <li key={index}>
                            { experience.IS_GAP ?
                                <p>{`Gap in VC for ${experience.GAP_PERIOD}`}</p>
                              : (
                                <div>
                                  <p>Worked as <strong>{experience.JOB_TITLE}</strong></p>
                                  <small>{ `from ${experience.START_DATE} To ${experience.END_DATE}` }</small>
                                </div>
                              )}
                          </li>
                        )
                      } else {
                        return null
                      }
                    })}
                  </Experience>
                  :
                    <Experience><li>No work experience :(</li></Experience>
                }
                {candidate.experience.length > 2 ?
                  (this.state.candidatesFullViewToggleMap[candidate.id] ? (
                      <ExpandButton onClick={this.toggleCandidateFullView.bind(this, candidate.id)}>Collapse</ExpandButton>
                    ) : (
                      <ExpandButton onClick={this.toggleCandidateFullView.bind(this, candidate.id)}>See All ({candidate.experience.length})</ExpandButton>
                    )
                  )
                  : null
                }
              </AvatarExperienceContainer>
            </Card>
          </Item>
        ))}
      </Container>
    )
  }
}

Index.getInitialProps = async function() {
  const res = await fetch(API_URL);
  const data = await res.json();

  console.log(`Data fetched from ${API_URL}. Total items: ${data.length}`);

  let myObj = {
    candidates: data.map((entry, key) => {
      return {
        id: key,
        CANDIDATE_NAME: entry.contact_info.name.formatted_name,
        AVATAR_URL: entry.contact_info.image_url,
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

  // add gaps
  myObj.candidates.forEach((candidate, index) => {
    if (candidate.experience.length > 0) {
      let experience = []
      for (let i = candidate.experience.length - 1; i >= 0; i--) {
        let current = candidate.experience[i]

        if (i == 0) {
          experience.push(current)
        } else {
          let next = candidate.experience[i-1]
          let currentEndDate = moment(current.END_DATE, 'MMM/DD/YYYY'),
              nextStartDate = moment(next.START_DATE, 'MMM/DD/YYYY')

          let gap_days = nextStartDate.diff(currentEndDate, 'days')
            if (gap_days > 1) {
              experience.push(current)
              experience.push({
                IS_GAP: true,
                GAP_PERIOD: nextStartDate.to(currentEndDate, true),
                JOB_TITLE: 'GAP',
                START_DATE: current.END_DATE,
                END_DATE: next.START_DATE,
              });
            } else {
              experience.push(current)
            }
        }
      }
      myObj.candidates[index].experience = [].concat(experience).reverse()
    }
  })

  return myObj
};

export default Index;
