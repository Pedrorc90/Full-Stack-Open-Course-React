import React, { useState, useEffect } from 'react'
import phoneBookService from './services/Phonebook'

const Filter = ({inputValue, onChangeHandler}) =>  <div>Search: <input value={inputValue} onChange={onChangeHandler} /></div>
const PersonForm = ({nameInputValue, nameOnChangeHandler, numberInputValue, numberOnChangeHandler}) => <div>
                              <div>name: <input value={nameInputValue} onChange={nameOnChangeHandler} /></div>
                              <div>number: <input value={numberInputValue} onChange={numberOnChangeHandler}/></div>
                              <div>
                                <button type="submit">add</button>
                              </div>
                            </div>

const Persons = ({list}) => <div><h2>Numbers</h2>{list}</div>

const NotificationError = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}


const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('');
  const [ nameToFind, setNameToFind] = useState('');
  const [ errorMessage, setErrorMessage] = useState(null)
  const [ successMessage, setSuccessMessage] = useState(null)

  useEffect(() =>  phoneBookService.getAll().then(persons => setPersons(persons)), []);

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber }
    phoneBookService.getByName(newName).then(response => {
      let flt = response.filter(r => r.name === newName)
      if (flt.length !== 0) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          phoneBookService.update( flt[0].id, newPerson)
          .then(r =>  {
            setPersons(persons.map(person => person.id !== r.id ? person : r))
            setSuccessMessage(`User ${r.name} updated successfully`)
            setTimeout(() => setSuccessMessage(null),5000)
          })
          .catch(err => {
            setErrorMessage('content missing')
            setTimeout( () => setErrorMessage(null), 5000)
          })
        }
      } else {
        phoneBookService.create( newPerson )
        .then(response => {
          setPersons(persons.concat( response ))
          setSuccessMessage(`User ${response.name} created successfully`)
          setTimeout( () => setSuccessMessage(null), 5000)
        })
        .catch(err => {
          setErrorMessage(err.response.data.error)
          setTimeout( () => setErrorMessage(null), 5000)
        })
      }
    })

  }

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleNameToFind = (event) => setNameToFind(event.target.value);
  const handleOnClickDelete = ( id, name ) => {
    if (window.confirm(`Delete ${id}`)) {
      phoneBookService.remove(id)
      .then( ( _ ) => phoneBookService.getAll().then(r => setPersons(r)))
      .catch(err => {
        console.log(err)
        setErrorMessage(`Information of ${name} has already been removed from server`)
        setTimeout( () => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  const peopleList = (event) => persons.map(person => {
    if (person.name.toLowerCase().includes(event.toLowerCase())) {
      return <li key={person.id}>{person.name} - {person.number} <button onClick={() => {handleOnClickDelete(person.id, person.name )}}>Delete</button></li> 
    }
  });
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <NotificationError message={errorMessage}/>
      <form onSubmit={addNewPerson}>
        <Filter inputValue={nameToFind} onChangeHandler={handleNameToFind}/>
        <h2>Add a new</h2>
        <PersonForm nameInputValue={newName} nameOnChangeHandler={handleNameChange} numberInputValue={newNumber} numberOnChangeHandler={handleNumberChange} />
      </form>
     <Persons list={peopleList(nameToFind)} />
    </div>
  )
}





export default App