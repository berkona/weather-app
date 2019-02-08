import React, { Component } from 'react'
import ReactCardFlip from 'react-card-flip';
import * as request from 'superagent'
import { baseUrl, apiKey } from './config'
import Settings from './Settings'
import Display from './Display'
import { getCurrentPosition, StorageService } from './utils'

import './App.css'

const EXPIRATION_TIME = 1000 * 60 * 60

/**
 * Root-level container which manages application state & persistance
 * Defers actual rendering to two component 'pages'
 */
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false,
      currentLocation: null,
      fetchingData: false,
      lastUpdatedAt: 0,
      weather: {},
      conditions: {},
      settings: StorageService.get('settings') || { tempScale: 'C' },
    }
  }

  componentDidMount = () => {
    this.refreshDataCached()
  }

  /**
   * Conditionally fetch data if the current stored data is not fresh enough
   */
  refreshDataCached = async () => {
    const lastUpdatedAt = StorageService.get('lastUpdatedAt')
    const cachedLocation = StorageService.get('currentLocation')
    const cachedWeather = StorageService.get('weather')
    const cachedConditions = StorageService.get('conditions')

    // check if we can use stored data and if so use that instead
    if (Date.now() - lastUpdatedAt < EXPIRATION_TIME
      && cachedLocation != null
      && cachedWeather != null
      && cachedConditions != null) {
        this.setState({
          lastUpdatedAt: lastUpdatedAt,
          currentLocation: cachedLocation,
          weather: cachedWeather,
          conditions: cachedConditions,
        })
        // bail
        return
    }

    await this.refreshData()
  }

  /**
   * Fetch data from the API about the user's current location
   * Does not perform any cached item checking
   * Threw this into a single fn just for simplicity
   */
  refreshData = async () => {
    const pos = await getCurrentPosition()
    const currentLocation = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    }

    this.setState({ fetchingData: true })

    const response = await request.get(`${baseUrl}/weather?appid=${apiKey}&lat=${currentLocation.lat}&lon=${currentLocation.lon}`)

    const weather = response.body.weather && response.body.weather[0]
    const conditions = response.body.main

    this.setState({
      currentLocation,
      weather, conditions,
      lastUpdatedAt: Date.now(),
      fetchingData: false
    })

    StorageService.set('lastUpdatedAt', this.state.lastUpdatedAt)
    StorageService.set('currentLocation', this.state.currentLocation)
    StorageService.set('weather', this.state.weather)
    StorageService.set('conditions', this.state.conditions)
  }

  onSettingsClick = () => {
    this.setState({ showSettings: true })
  }

  onSettingsSubmit = (settings) => {
      this.setState({
        showSettings: false,
        settings: settings,
      });
      StorageService.set('settings', settings);
  }

  render() {
    let page;
    // waiting for location
    if (this.state.currentLocation === null) {
      page = <p>Locating you (click allow!)...</p>
    }
    // fetching from API
    else if (this.state.fetchingData) {
      page =  <p>Fetching data...</p>
    }
    // TODO: add a state if user has blocked geolocation access
    else {
      page = (
        <ReactCardFlip isFlipped={this.state.showSettings}>
          <Display
            key="front"
            lastUpdatedAt={this.state.lastUpdatedAt}
            conditions={this.state.conditions}
            weather={this.state.weather}
            settings={this.state.settings}
            refreshData={this.refreshData}
            onSettingsClick={this.onSettingsClick}
          />
          <Settings
            key="back"
            settings={this.state.settings}
            onSubmit={this.onSettingsSubmit}
          />
        </ReactCardFlip>
      )
    }
    return <div className="App">{page}</div>
  }
}

export default App;
