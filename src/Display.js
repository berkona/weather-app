import React, { Component } from 'react'
import { getImageForWeather } from './utils'
import { MdSettings, MdRefresh } from 'react-icons/md'
import Weather from './Weather'
import Conditions from './Conditions'
import './Display.css'

class Display extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let backgroundStyle = {
      backgroundImage: `url(${getImageForWeather(this.props.weather)})`,
      backgroundSize: "cover",
    }
    return (
      <div className="Display" style={backgroundStyle}>
        <div className="Display-header">
          <p>Last updated at {new Date(this.props.lastUpdatedAt).toLocaleTimeString()}</p>
          <p><button className="btn btn-primary" onClick={this.props.refreshData}><MdRefresh /></button></p>
        </div>
        <div className="Display-body">
          <Conditions
            tempScale={this.props.settings.tempScale}
            temp={this.props.conditions.temp}
            tempMin={this.props.conditions.temp_min}
            tempMax={this.props.conditions.temp_max}
            humidity={this.props.conditions.humidity}
          />
          <Weather
            icon={this.props.weather.id}
            description={this.props.weather.description}
          />
        </div>
        <div className="Display-footer">
          <button className="btn" onClick={this.props.onSettingsClick}><MdSettings /></button>
        </div>
      </div>
    )
  }
}

export default Display
