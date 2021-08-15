import Head from 'next/head'
import Link from 'next/link'
import Styles from '../../styles/Result.module.css'
import WeatherCard from '../../Components/weather-card'
const { countryCodeEmoji } = require('country-code-emoji');
import { useEffect, useState } from 'react'
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
      SetFilterTemperatureFrom(e.value)
      document.getElementById("filterTemperatureTo").min = e.value
    }
    if(e.id == "filterTemperatureTo"){
      SetFilterTemperatureTo(e.value)
      document.getElementById("filterTemperatureFrom").max = e.value
    }
  }
 
  const getResultWeather = async () =>{
    ReloadWeatherTags()
    let data = {
      "DailyWeather":dataWeather[weatherType],
      "WeatherType":weatherType,
      "Filters":{
        "Temperature":{"From":FilterTemperatureFrom,"To":FilterTemperatureTo},
        "WeatherTags":WeatherTags
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
  
  const ReloadWeatherTags=(e)=>{
    const tagsIDS = ["filtersWeatherCheckClear","filtersWeatherCheckClouds","filtersWeatherCheckRain","filtersWeatherCheckDrizzle","filtersWeatherCheckSnow","filtersWeatherCheckThunderstorm","filtersWeatherCheckAtmosphere"]
    const availableTags = ["Clear","Clouds","Rain","Drizzle","Snow","Thunderstorm","Atmosphere"]
    let resultTags = []
    tagsIDS.map((tagID,idx)=>{
      if(document.getElementById(tagID).checked) resultTags.push(availableTags[idx])
    })
    WeatherTags = resultTags
  }

  let WeatherTags = ["Clear","Clouds","Rain","Drizzle","Snow","Thunderstorm","Atmosphere"]
  let [resultWeather, setResultWeather] = useState(0)
  let [weatherType,setWeatherType] = useState("daily")

  let [FilterTemperatureOpen,SetFilterTemperatureOpen] = useState(false)
  let [FilterTemperatureFrom,SetFilterTemperatureFrom] = useState(-20)
  let [FilterTemperatureTo,SetFilterTemperatureTo] = useState(40)
  let [FilterWeatherOpen,SetFilterWeatherOpen] = useState(false)

  useEffect(()=>setResultWeather({isError:false,errorMessage:"",result:[]}),[weatherType])

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
              <span style={{fontSize:"60px",fontWeight:"500",whiteSpace:"nowrap"}}>{countryCodeEmoji(latLonData[0].country)} {latLonData[0].name}</span><br/>
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
          <div className={"DailyHourBar"} >
            <div id="DailyChoose" className={"DailyHourlyChoose Active"} onClick={()=>{setWeatherType("daily");setResultWeather({isError:false,errorMessage:"",result:[]});document.getElementById("HourlyChoose").classList.remove("Active");document.getElementById("DailyChoose").classList.add("Active")}}>daily<hr/></div>|<div id="HourlyChoose" className={"DailyHourlyChoose"} onClick={()=>{setWeatherType("hourly");setResultWeather({isError:false,errorMessage:"",result:[]});document.getElementById("DailyChoose").classList.remove("Active");document.getElementById("HourlyChoose").classList.add("Active")}}>hourly<hr/></div>
          </div>
          <div id="DraggableDaysWeather" className={Styles.WeatherDaysCarousel} onMouseDown={(e)=>dragStart(e,"DraggableDaysWeather")} onMouseUp={()=>dragEnd("DraggableDaysWeather")} onMouseLeave={()=>dragEnd("DraggableDaysWeather")}>
            {dataWeather[weatherType].map((dayWeather,idx)=>{
              return(<WeatherCard timezone={dataWeather.timezone} timezoneOffset={dataWeather.timezone_offset} WeatherData={dayWeather} key={idx} weatherType={weatherType}/>)
            })}
          </div>
          {/* here is fitring panel */}
          <div className={"my-4 p-3"}>
            {/* here are filters */}
            <div className="row">
              
              <div className={"col-sm-12 col-md-6 my-1"} style={{fontSize:"20px"}}>
                <div className={"p-3 "+Styles.filterPanelContainer}>
                 <span style={{fontWeight:"500",fontSize:"30px"}} className="my-3">Filter the weather</span>
                  <div>
                    <span onClick={()=>SetFilterTemperatureOpen(!FilterTemperatureOpen)}>Temperature {FilterTemperatureOpen ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}</span>
                    {FilterTemperatureOpen ? <div className="ml-3">
                      from <input style={{width:"100px"}} id="filterTemperatureFrom" type="range" min="-20" max="40" onChange={(e)=>setInputRangeLabel(e,"inputRangeLabelTempFrom")} defaultValue={FilterTemperatureFrom}/> <span id="inputRangeLabelTempFrom">{FilterTemperatureFrom}</span>°C<br/>
                      to <input style={{width:"100px"}} id="filterTemperatureTo" type="range" min="-20" max="40" onChange={(e)=>setInputRangeLabel(e,"inputRangeLabelTempTo")} defaultValue={FilterTemperatureTo}/> <span id="inputRangeLabelTempTo">{FilterTemperatureTo}</span>°C.
                    </div>:null} 
                  </div>
                  <div>
                    <span onClick={()=>SetFilterWeatherOpen(!FilterWeatherOpen)}>Weather {FilterWeatherOpen ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}</span>
                    <div className="ml-3" style={FilterWeatherOpen?{display:"block"}:{display:"none"}}>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckClear" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckClear" style={{margin:"0px"}}>Clear</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckClouds" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckClouds" style={{margin:"0px"}}>Clouds</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckRain" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckRain" style={{margin:"0px"}}>Rain</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckDrizzle" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckDrizzle" style={{margin:"0px"}}>Drizzle</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckSnow" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckSnow" style={{margin:"0px"}}>Snow</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckThunderstorm" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckThunderstorm" style={{margin:"0px"}}>Thunderstorm</label> <br/>
                      <input type="checkbox" defaultChecked id="filtersWeatherCheckAtmosphere" onChange={(e)=>ReloadWeatherTags(e)}/> <label htmlFor="filtersWeatherCheckAtmosphere" style={{margin:"0px"}}>Atmosphere</label> <br/>
                    </div>
                  </div>
                  <button className={"Btn px-5 py-2 mx-0"} onClick={getResultWeather}>Filter!</button>
                </div>
              </div>

              {/* here are results of filters */}
              <div className={"col-sm-12 col-md-6 my-1 p-0"}>
                <div id="DraggableResultWeather" className={"my-1 " +Styles.WeatherDaysCarousel} onMouseDown={(e)=>dragStart(e,"DraggableResultWeather")} onMouseUp={()=>dragEnd("DraggableResultWeather")} onMouseLeave={()=>dragEnd("DraggableResultWeather")}>
                  {resultWeather ? !resultWeather.isError ? resultWeather.result.map((dayWeather,idx)=>{
                    return(<WeatherCard timezoneOffset={dataWeather.timezone_offset} WeatherData={dayWeather} weatherType={weatherType}key={idx}/>)
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