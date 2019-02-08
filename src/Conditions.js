import React from 'react'
import { convertKToC, convertKToF, formatUnit } from './utils'
import './Conditions.css'

export default (props) => {
	let tempPrecision = props.precision || 2
	let tempScale = props.tempScale || 'C'
	let converterFn = tempScale === 'F' ? convertKToF : convertKToC
	return (
    <div className="Conditions-wrapper">
      <p className="Conditions-current-temp">{formatUnit(converterFn(props.temp), tempPrecision, '°')}</p>
      <p className="Conditions-temp-high">H: {formatUnit(converterFn(props.tempMax), tempPrecision, '°')}</p>
			<p className="Conditions-temp-low">L: {formatUnit(converterFn(props.tempMin), tempPrecision, '°')}</p>
      <p className="Conditions-humidity">{formatUnit(props.humidity, 2, '%')}</p>
			<p className="Conditions-temp-label">Temperature</p>
			<p className="Conditions-humidity-label">Humidity</p>
		</div>
	)
}
