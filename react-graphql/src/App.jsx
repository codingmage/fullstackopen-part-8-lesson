import { useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'



const App = () => {
  const result = useQuery(ALL_PERSONS)

  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)}, 10000)
    }

    // fetches every 2 seconds, a lot of pointless web traffic

  /* const result = useQuery(ALL_PERSONS, {
      pollInterval: 2000
    }) */


  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App