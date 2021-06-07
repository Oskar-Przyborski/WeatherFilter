import Head from 'next/head'
import Link from 'next/link'
import Styles from '../../styles/Result.module.css'

export default function WeatherSearch({dataWeather,latLonData}) {

  const getResult = () => {
    if(dataWeather === null) return(<>
        Address not found :( <br/>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </>
    )
    else return(
      <>
        <h3>Localization: {latLonData[0].name}</h3>
        <h5>Weather - {dataWeather.current.weather[0].description} <img className="img-fluid" width="30px" src={`http://openweathermap.org/img/wn/${dataWeather.current.weather[0].icon}.png`}/></h5>
        <h5>Temperature - {dataWeather.current.temp}°C</h5>
        <h5>Perceptible temperature - {dataWeather.current.feels_like}°C</h5>
        <h5>Wind speed - {dataWeather.current.wind_speed} m/s</h5>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </>
    )
  }
  return (
    <div className={Styles.container}>
      <Head>
        <title>WeatherFilter</title>
        <meta name="description" content="Find day by weather with WeatherFilter!" />
      </Head>
      {getResult()}
    </div>
  )
}
export async function getServerSideProps(context) {
  //get lat and lon
  let dataWeather = null
  let latLonData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${context.query.city_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}&limit=1&appid=187db54233cfd9ab55e609decd15cc0d`)
  latLonData = await latLonData.json()
  if(latLonData[0] == null) return {props: {dataWeather,latLonData}} 
  let lat = latLonData[0].lat
  let lon = latLonData[0].lon
  dataWeather = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=187db54233cfd9ab55e609decd15cc0d`)
  dataWeather = await dataWeather.json()
  return {
    props: {dataWeather,latLonData}
  }
}