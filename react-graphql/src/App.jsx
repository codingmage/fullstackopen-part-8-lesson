import { useApolloClient, useQuery, useSubscription, useMutation } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries'
import { useState } from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'

export const updateCache = (cache, query, addedPerson) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k= item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson))
    }
  })
}

const App = () => {
  const result = useQuery(ALL_PERSONS)

  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)}, 10000)
  }

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      //console.log(data)
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)

/*       client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons}) => {
        return {
          allPersons: allPersons.concat(addedPerson)
        }
      }) */
    }
  })

    // fetches every 2 seconds, a lot of pointless web traffic

  /* const result = useQuery(ALL_PERSONS, {
      pollInterval: 2000
    }) */

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App