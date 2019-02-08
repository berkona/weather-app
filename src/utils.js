
/**
 * Formats a unitted number for display to the user
 * temp: Number - the temp in 'units'
 * precision: integer - how many decimal points to keep
 * unitSym: string - short unit label to append to the end of formatted number
 */
export const formatUnit = (temp, precision, unitSym) => {
  return Number.parseFloat(temp).toPrecision(precision) + unitSym
}

/**
 * Take a temp in kelvins (Number type) and convert to celsius
 */
export const convertKToC = (temp) => {
  return temp - 273.15
}

/**
 * Take a temp in kelvins (Number type) and convert to fahrenheit
 */
export const convertKToF = (temp) => {
  return 1.8 * ( temp - 273.15 ) + 32
}

/**
 * A wrapper for the navigator.geolocation API which uses a promise for async instead of callbacks
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
    })
  })
}

const IMAGE_BASE_PATH = '/images/'

export const getImageForWeather = (weather) => {
  let code = Number.parseInt(weather.id);
  if (code >= 200 && code < 600) {
    return IMAGE_BASE_PATH + 'rainy.jpg';
  }
  else if (code >= 600 && code < 700) {
    return IMAGE_BASE_PATH + 'snowy.png';
  }
  else if (code === 800 || code === 801) {
    return IMAGE_BASE_PATH + 'sunny.jpg';
  }
  // TODO: are there any codes < 200? Handle more exotic forms of weather
  else {
    return IMAGE_BASE_PATH + 'cloudy.jpg'
  }
}

/**
 * A localStorage-unique prefix for all keys stored in StorageService
 */
export const STORAGE_PREFIX = 'com.solipsisdev.weatherApp';

/**
 * A wrapper for localStorage which handles marshalling & prefixing keys to make them unique
 */
export class StorageService {
  static get(key) {
    try {
      return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}.${key}`));
    } catch (err) {
      return null;
    }
  }

  static set(key, value) {
    localStorage.setItem(`${STORAGE_PREFIX}.${key}`, JSON.stringify(value))
  }
}
