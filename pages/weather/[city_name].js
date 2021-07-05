import Head from 'next/head'
import Link from 'next/link'
import Styles from '../../styles/Result.module.css'
import WeatherCard from '../../Components/weather-card'
import { useState } from 'react'
export default function WeatherSearch({dataWeather,latLonData}) {
  let befPos = 0;
  const dragStart = (event,elemName) =>{
    befPos =  event.pageX
    let elem = document.getElementById(elemName)
    elem.onmousemove = (e) => dragging(e,elemName)
  }
  const dragging = (event,elemName) =>{
    let elem = document.getElementById(elemName)
    let dx = befPos-event.pageX
    befPos =  event.pageX
    elem.scrollBy(dx,0)
  }
  const dragEnd = (elemName) =>{
    let elem = document.getElementById(elemName)
    elem.onmousemove = ()=>{}
  }
  const setInputRangeLabel = (e,labelSpan)=>{
    e = e.target
    let labelSpanObj = document.getElementById(labelSpan)
    labelSpanObj.innerHTML = e.value
    if(e.id == "filterTemperatureFrom"){
      document.getElementById("filterTemperatureTo").min = e.value
    }
    if(e.id == "filterTemperatureTo"){
      document.getElementById("filterTemperatureFrom").max = e.value
    }
  }
 
  const getResultWeather = async () =>{
    let data = {
      "DailyWeather":dataWeather.daily,
      "Filters":{
        "Temperature":{"From":document.getElementById("filterTemperatureFrom").value,"To":document.getElementById("filterTemperatureTo").value},
        "WeatherType":document.getElementById("filterWeatherType").value
      }
    }
    let response = await fetch("../api/FilterWeather", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    response = await response.json()
    setResultWeather(response)
  }
  
  let [resultWeather, setResultWeather] = useState(0)

  const getResult = () => {
    if(dataWeather === null) return(<>
        <span style={{fontSize:"20px",fontWeight:"500"}}>Localization not found :(</span><br/>
      </>
    )
    else{
      return(
        <>
        {/* here is 2 main panels*/}
          <div className={"row"}>
            <div className={"col-sm-12 col-lg-6 my-4 " + Styles.MainLeft}>
              <span style={{fontSize:"65px",fontWeight:"500"}}>{latLonData[0].name}, {latLonData[0].country}</span><br/>
              <div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:"65px"}}>{Math.round(dataWeather.current.temp)}°C</span><img width="128" height="128" src={`http://openweathermap.org/img/wn/${dataWeather.current.weather[0].icon}@4x.png`} className={Styles.WeatherIconImg}/></div><br/>
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
          {/* here is daily weather that you can drag*/}
          <div id="DraggableDaysWeather" className={Styles.WeatherDaysCarousel} onMouseDown={(e)=>dragStart(e,"DraggableDaysWeather")} onMouseUp={()=>dragEnd("DraggableDaysWeather")} onMouseLeave={()=>dragEnd("DraggableDaysWeather")}>
            {dataWeather.daily.map((dayWeather,idx)=>{
              return(<WeatherCard timezoneOffset={dataWeather.timezone_offset} WeatherData={dayWeather} key={idx}/>)
            })}
          </div>
          {/* here is fitring panel */}
          <div className={"m-4 p-4 "}>
            
            <div className="row" style={{fontSize:"23px"}}>
              <div className={"col-sm-12 col-md-6 my-1 mb-4 p-4 "+Styles.filterPanelContainer}>
                <span style={{fontWeight:"500",fontSize:"30px"}}>Filter the weather</span>
                <div>Temperature - from <input style={{width:"60px"}} id="filterTemperatureFrom" type="range" min="-25" max="20" onChange={(e)=>setInputRangeLabel(e,"inputRangeLabelTempFrom")} defaultValue="-5"/> <span id="inputRangeLabelTempFrom">-5</span>°C to <input style={{width:"60px"}} id="filterTemperatureTo" type="range" min="-5" max="50" onChange={(e)=>setInputRangeLabel(e,"inputRangeLabelTempTo")} defaultValue="20"/> <span id="inputRangeLabelTempTo">20</span>°C.</div>
                <div>Weather type - {" "}
                  <select id="filterWeatherType"className="Btn" style={{padding:"5px 10px",fontSize:"17px",width:"130px"}} name="weatherList">
                    <option name="Whatever">Whatever</option>
                    <option name="Clear">Clear</option>
                    <option name="Clouds">Clouds</option>
                    <option name="Rain">Rain</option>
                    <option name="Thunderstorm">Thunderstorm</option>
                    <option name="Snow">Snow</option>
                    <option name="Drizzle">Drizzle</option>
                    <option name="Mist">Mist</option>
                    <option name="Smoke">Smoke</option>
                    <option name="Haze">Haze</option>
                    <option name="Dust">Dust</option>
                    <option name="Fog">Fog</option>
                    <option name="Sand">Sand</option>
                    <option name="Ash">Ash</option>
                    <option name="Squall">Squall</option>
                    <option name="Tornado">Tornado</option>
                  </select>
                </div>
                <button className="Btn" onClick={getResultWeather} style={{padding:"5px 70px",margin:"0"}}>Filter</button>
              </div>
              <div className={"col-sm-12 col-md-6 my-1"}>
                <div id="DraggableResultWeather" className={"mx-1 " +Styles.WeatherDaysCarousel} onMouseDown={(e)=>dragStart(e,"DraggableResultWeather")} onMouseUp={()=>dragEnd("DraggableResultWeather")} onMouseLeave={()=>dragEnd("DraggableResultWeather")}>
                  {resultWeather ? !resultWeather.isError ? resultWeather.result.map((dayWeather,idx)=>{
                    return(<WeatherCard timezoneOffset={dataWeather.timezone_offset} WeatherData={dayWeather} key={idx}/>)
                  }):<div><span style={{color:"red",fontWeight:"500"}}>ERROR!</span><br/>{resultWeather.errorMessage}</div> : null}
                </div>
              </div>
              
            </div>
            
            
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