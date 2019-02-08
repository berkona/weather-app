import React from 'react'
import './Weather.css'
import WeatherIcon from 'react-icons-weather';

export default (props) => {
	return (
    <div className="Weather-wrapper">
			<div className="Weather-icon">
				<WeatherIcon name="owm" iconId={props.icon} /> 
			</div>
      <p className="Weather-description">{props.description}</p>
		</div>
	)
}
