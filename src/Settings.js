import React, { Component } from 'react'
import './Settings.css'
import { MdSave } from 'react-icons/md'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: props.settings
    }
  }

  handleOptionChange = changeEvent => {
      this.setState({
        settings: Object.assign({}, this.state.settings, { tempScale: changeEvent.target.value })
      })
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      settings: Object.assign({}, this.state.settings, { [name]: value })
    })
  }

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    this.props.onSubmit(this.state.settings);
  }

  render() {
    return (
      <form className="Settings" onSubmit={this.handleFormSubmit}>
        <div className="Settings-header">
          Settings
        </div>
        <div className="Settings-body">
          <div className="form-group">
            <label>Temperature Scale</label>
            <div className="form-check">
              <label>
                <input
                  type="radio"
                  name="tempScale-c"
                  className="form-check-input"
                  value="C"
                  checked={this.state.settings.tempScale === 'C'}
                  onChange={this.handleOptionChange}
                />
                Celsius
              </label>
            </div>
            <div className="form-check">
              <label>
                <input
                  type="radio"
                  name="tempScale-f"
                  className="form-check-input"
                  value="F"
                  checked={this.state.settings.tempScale === 'F'}
                  onChange={this.handleOptionChange}
                />
                Fahrenheit
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <div className="form-check">
              <input
                type="checkbox"
                name="useLocation"
                className="form-check-input"
                checked={this.state.settings.useLocation}
                onChange={this.handleInputChange}
              />
              Automatically determine location
            </div>
          </div>
            {
              ( !this.state.settings.useLocation ) &&
              (
                <div className="form-group">
                  <label>Zipcode</label>
                  <div className="form-check">
                    <input
                      type="text"
                      name="zipcode"
                      className="form-check-input"
                      value={this.state.settings.zipcode}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              )
            }
        </div>
        <div className="Settings-footer">
          <button className="btn" type="submit"><MdSave /></button>
        </div>
      </form>
    )
  }
}

export default Settings;
