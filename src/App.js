import React, { useEffect, useState } from'react';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        const sortedData = sortData(data);
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' 
        ? 'https://disease.sh/v3/covid-19/all' 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
  }

  return (
    <div className="app">

      <div className="app-left">
        <div className="app-header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app-dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
                
            </Select>
          </FormControl>
        </div>

        <div className="app-stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)} />
          
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)} />
          
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} />
        </div>


        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app-right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app-graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app-graph" casesType={casesType} />
        </CardContent>


      </Card>

    </div>
  );
}

export default App;