import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import './App.css';
import { getCovidInfo, getCountriesInfo, getTotalInfo } from './services/requester';
import convertApiData from './services/mapper';
import L from 'leaflet';
import { formatDate, numberToShortString } from './services/utils';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import TimeLineSlider from './components/slider';

const marks = [
  {
    value: 0,
  },
  {
    value: Math.floor((new Date().getTime() - new Date('2020.01.22').getTime() - 1000*60*60*24)/(1000*60*60*24)),
  },
];

class App extends React.Component {
  playInterval = null;

  state = {
    totalInfo: null,
    isTotalDisplay: false,
    speedTime: 300,
    isPaused: true,
    isLoading: true,
    countries: [],
    currentDate: new Date('2020.01.22'),
    currentValue: 0,
  };

  async componentDidMount() {
    const covidInfoByCountries = await getCovidInfo();
    const allCountries = await getCountriesInfo();
    const totalInfo = await getTotalInfo();
    
    const countries = convertApiData(covidInfoByCountries, allCountries);

    this.setState({
      isTotalDisplay: true,
      totalInfo,
      isPaused: false,
      countries,
      covidInfoByCountries,
    });

    this.startPlayAnimation();
  };

  changeDate(newDate) {
    const currentValue = Math.floor((newDate - new Date('2020.01.22').getTime())/(1000*60*60*24));

    this.setState({
      currentDate: newDate,
      currentValue,
    });
  };

  changeCurrentValue(newValue) {
    this.pause();

    const startDate = new Date('2020.01.22');

    this.setState({
      currentDate: new Date(startDate.setDate(startDate.getDate() + newValue)),
      currentValue: newValue,
    });
  }

  setTotalVisible() {
    this.setState({
      isTotalDisplay: !this.state.isTotalDisplay,
    });
  };

  play() {
    this.setState({
      isPaused: false,
    });

    this.startPlayAnimation();
  };

  pause() {
    this.setState({
      isPaused: true,
    });

    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
  };

  startPlayAnimation() {
    const { speedTime } = this.state;

    this.playInterval = setInterval(() => {
      const { isPaused, currentDate, currentValue } = this.state;

      if (!isPaused && currentValue !== marks[1].value) {
        this.changeDate(
          new Date(currentDate.setDate(currentDate.getDate() + 1)),
        );
      } else {
        this.pause();
        clearInterval(this.playInterval);
      }
    }, speedTime);
  };

  render() {
    const {
      currentDate,
      currentValue,
      countries,
      isTotalDisplay,
      totalInfo,
    } = this.state;

    return (
      <div className="App">
        <div id="mapid" style={{width: '100%', height: '90%'}}>
          <MapContainer center={[0, 0]} zoom={3} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {countries.map((country, i) => {
              const { latitude, longitude } = country;
              const { timeline: { cases, deaths, recovered } } = country;

              const casesValue = cases[formatDate(currentDate)];
              const casesString = numberToShortString(casesValue)

              const html = `
                <span class="icon-marker">
                  <span class="icon-marker-tooltip">
                    <h2>${country.name}</h2>
                    <ul>
                      <li>
                        <strong>
                          Confirmed:
                        </strong>
                        ${casesValue}
                      </li>
                      <li>
                        <strong>
                          Deaths:
                        </strong>
                        ${deaths[formatDate(currentDate)]}
                      </li>
                      <li>
                        <strong>
                          Recovered:
                        </strong>
                        ${recovered[formatDate(currentDate)]}
                      </li>
                    </ul>
                  </span>
                  ${ casesString }
                </span>
                `;

              const icon = L.divIcon({
                className: 'custom-marker',
                html,
                iconSize: [30, 30],
                iconAnchor: [latitude, longitude],
                riseOnHover: true,
              });
            
              return <Marker icon={icon} position={[latitude, longitude]} key={i} />
            })}
          </MapContainer>
        </div>

        <div style={{ height: '10%', width: '100%', display: 'flex' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={(this.state.isPaused && (
                <PlayArrowIcon />))
              || (
                <PauseIcon /> 
              )}
            onClick={() => this.state.isPaused
              ? this.play()
              : this.pause()
            }
          >
          </Button>
          <TimeLineSlider marks={marks} currentValue={currentValue} changeCurrentValue={(val) => this.changeCurrentValue(val)} />
        </div>

        <div className='total-info'>
          {(isTotalDisplay && (
            <div className='total-info-open'>
              <ul>
                <li>
                  <strong>
                    Confirmed:
                </strong>
                  {numberToShortString(totalInfo.cases[formatDate(currentDate)])}
                </li>
                <li>
                  <strong>
                    Deaths:
                </strong>
                  {numberToShortString(totalInfo.deaths[formatDate(currentDate)])}
                </li>
                <li>
                  <strong>
                    Recovered:
                </strong>
                  {numberToShortString(totalInfo.recovered[formatDate(currentDate)])}
                </li>
              </ul>
              <button onClick={() => this.setTotalVisible()}>{`->`}</button>
            </div>)
          ) || <button className='button-total' onClick={() => this.setTotalVisible()}>{`<-`}</button>}
        </div>
      </div>
    )
  }
}

export default App;