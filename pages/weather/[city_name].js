import Head from 'next/head'
import Link from 'next/link'
import Styles from '../../styles/Result.module.css'
import WeatherCard from '../../Components/weather-card'
export default function WeatherSearch({dataWeather,latLonData}) {

  const getResult = () => {
    if(dataWeather === null) return(<>
        Localization not found :( <br/>
      </>
    )
    else{
      return(
        <>
          <div className={"row"}>
            <div className={"col-sm-12 col-lg-6 my-4 " + Styles.MainLeft}>
              <span style={{fontSize:"65px",fontWeight:"500"}}>{latLonData[0].name}</span><br/>
              <div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:"65px"}}>{Math.round(dataWeather.current.temp)}°C</span><img width="128" height="128" src={`http://openweathermap.org/img/wn/${dataWeather.current.weather[0].icon}@4x.png`}/></div><br/>
              <span style={{fontSize:"35px"}}>{dataWeather.current.weather[0].description}</span>
            </div>
            <div className={"col-sm-12 col-lg-6 my-4 " + Styles.MainRight}>
              <div className={"mx-5 " + Styles.MainRigtContentBox}>
                Wind: {dataWeather.current.wind_speed} m/s<br/> <hr style={{width:"100%",margin:"10px 0px"}}/>
                Pressure: {dataWeather.current.pressure} hPa<br/> <hr style={{width:"100%",margin:"10px 0px"}}/>
                Humidity: {dataWeather.current.humidity}%<br/> <hr style={{width:"100%",margin:"10px 0px"}}/>
                Cloudiness: {dataWeather.current.clouds}%<br/> <hr style={{width:"100%",margin:"10px 0px"}}/>
                UV index: {dataWeather.current.uvi}
              </div>
            </div>
          </div>
          <div className={"row "+Styles.WeatherDaysCarousel}>
            {dataWeather.daily.map((dayWeather,idx)=>{
              return(<WeatherCard WeatherData={dayWeather} key={idx}/>)
            })}
          </div>
        </>
      )
    }

    
    
  }
  return (
    <div className={Styles.container}>
      <Head>
        <title>WeatherFilter</title>
        <meta name="description" content="Find day by weather with WeatherFilter!" />
      </Head>
      {getResult()}
      <Link href="/">
        <button className="Btn">Back to home</button>
      </Link>
    </div>
  )
}
export async function getServerSideProps(context) {
  //get lat and lon
  let dataWeather = null
  let latLonData = await fetch(encodeURI(`http://api.openweathermap.org/geo/1.0/direct?q=${context.query.city_name}&limit=1&appid=187db54233cfd9ab55e609decd15cc0d`))
  latLonData = await latLonData.json()
  if(latLonData[0] == null) return {props: {dataWeather,latLonData}} 
  let lat = latLonData[0].lat
  let lon = latLonData[0].lon
  //get weather
  dataWeather = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=187db54233cfd9ab55e609decd15cc0d`)
  dataWeather = await dataWeather.json()
  return {
    props: {dataWeather,latLonData}
  }
}