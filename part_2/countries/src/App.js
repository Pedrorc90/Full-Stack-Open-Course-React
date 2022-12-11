import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';


const Filter = ({countryToFilter, handleCountryChange}) => 
  <div>
    <p>Find Countries</p>
    <input value={countryToFilter} onChange={handleCountryChange} placeholder="Type a country to filter"></input>
  </div>

const Results = ({country}) => {
  const [weatherInfo, setWeatherInfo] = useState([])
  const api_key = process.env.REACT_APP_API_KEY;
  const apiWeatherUrl=`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`;
  useEffect(() => { axios.get(apiWeatherUrl).then(response => setWeatherInfo(response.data))}, [])

  return (<div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <h2>Languages</h2>
    {Object.values(country.languages).map((lang, idx) => <li key={country.fifa + country.name.common}>{lang}</li>)}
    <img src={country.flags.png}></img>
    <h2>Weather in {country.capital}</h2>
    <h3>temperature: {weatherInfo?.main?.temp}º Celsius</h3>
  </div> )
}



  

const ListCountries = ({list, countryToFind}) => {

  const [showResults, setShowResults] = useState(false)
  let infoToShow = <div></div>;

  const handlerShowButton = () => setShowResults(true)
  if (!countryToFind) {
    infoToShow = list.map(country => <div key={country.fifa + country.name.common}>{country.name.common}</div>);
  } else {
    list.filter(flt => flt.name.common.toLowerCase().includes(countryToFind.toLowerCase()))
    .map((country, idx, arr) => {
      if (arr.length > 10) {
        infoToShow = <div>Too many matches, specify another filter</div>
      } else if (arr.length > 1 && arr.length <= 10) {
        if(showResults) {
          infoToShow = <Results country={country}/>
        } else {
          infoToShow = arr.map(c => 
            <div>
             <li key={c.fifa + c.name.common}>{c.name.common} <button onClick={ () => handlerShowButton(c)}>Show</button></li>
           </div>)
        }
      } else {
        infoToShow = <Results country={country}></Results>
      }
    
    })
  }
return <div>{infoToShow}</div>
}


const App = () => {

  const apiUrl = 'https://restcountries.com/v3.1/all';
  const [countriesFull, setCountriesFull] = useState([])
  const [countryToFind, setCountryToFind] = useState('');
  const handleCountryChange = (event) => setCountryToFind(event.target.value)

  useEffect(() => { axios.get(apiUrl).then(response =>  setCountriesFull(response.data))}, []);
  return (
    <div>
      <Filter countryToFilter={countryToFind} handleCountryChange={handleCountryChange}></Filter>
      <ListCountries list={countriesFull} countryToFind={countryToFind}></ListCountries>
    </div>
  );
}


export default App;
