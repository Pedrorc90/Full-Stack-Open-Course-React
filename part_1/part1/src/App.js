import React from 'react'

const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}


const App = () => { 

  const name= 'Pedro';
  const age= 31;

 return (
   <div>
     <h1>Greetings</h1>
     <Hello name={name} age={age}/>
     <Hello name="Sandra" age={27+2}/>
     
   </div>
 )
}


export default App