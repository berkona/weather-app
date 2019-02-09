import React, { Component } from 'react'
import ReactCardFlip from 'react-card-flip'
import Settings from './Settings'
import Display from './Display'
import { getCurrentPosition, StorageService, OpenWeatherMapService } from './utils'

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
      currentLocation: StorageService.get('currentLocation') || "",
      fetchingData: false,
      lastUpdatedAt: StorageService.get('lastUpdatedAt') || 0,
      weather: StorageService.get('weather') || { id: '800', description: 'Sunny' },
      conditions: StorageService.get('conditions') || {},
      settings: StorageService.get('settings') || {
        useLocation: true,
        zipcode: 91601,
        tempScale: 'C'
      },
    }
  }

  componentDidMount = () => {
    this.refreshDataCached()
  }

  /**
   * Conditionally fetch data if the current stored data is not fresh enough
   */
  refreshDataCached = async () => {
    // check if we can use stored data and if so use that instead
    if (Date.now() - this.state.lastUpdatedAt < EXPIRATION_TIME) {
        // bail
        return
    }
    await this.refreshData()
  }

  /**
   * Fetch data from the API about the user's current location
   * Does not perform any cached item checking
   */
  refreshData = async () => {
    let response;
    this.setState({ fetchingData: true })
    if (this.state.settings.useLocation) {
      const pos = await getCurrentPosition()
      response = await OpenWeatherMapService.getLatLon(pos.coords.latitude, pos.coords.longitude);
    } else {
      response = await OpenWeatherMapService.getZip(this.state.settings.zipcode);
    }

    const currentLocation = response.body.name
    const weather = response.body.weather && response.body.weather[0]
    const conditions = response.body.main

    this.setState({
      currentLocation,
      weather, conditions,
      lastUpdatedAt: Date.now(),
      fetchingData: false,
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
    // detect if we need to force an update
    let needsRefresh = this.state.settings.useLocation != settings.useLocation
     || this.state.settings.zipcode != settings.zipcode;
    this.setState({
      showSettings: false,
      settings: settings,
    }, () => {
      if (needsRefresh) {
          this.refreshData()
      }
    });
    StorageService.set('settings', settings)
  }

  render() {
    let page;
    // fetching from API
    if (this.state.fetchingData) {
      page =  <p>Fetching data...</p>
    }
    // TODO: add a state if user has blocked geolocation access
    else {
      page = (
        <ReactCardFlip isFlipped={this.state.showSettings}>
          <Display
            key="front"
            locationName={this.state.currentLocation}
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
