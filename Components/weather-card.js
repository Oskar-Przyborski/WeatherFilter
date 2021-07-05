import Styles from '../styles/weather-card.module.css'
export default function WeatherCard({WeatherData,timezoneOffset}){
    let CardDate = new Date((WeatherData.dt+timezoneOffset)*1000)
    const days = ["Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat."]
    return(
    <div className={Styles.CardContainer}>
        <span style={{fontWeight:"500"}}>{days[CardDate.getDay()]+" " +CardDate.getDate()}</span><br/>
        <img className={Styles.Image}draggable="false" width="128" height="128" src={`http://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@4x.png`}/><br/>
        <span style={{fontSize:"15px",fontWeight:"500"}}>{WeatherData.weather[0].description}</span><br/>
        <span style={{fontSize:"16px",fontWeight:"500"}}>{Math.round(WeatherData.temp.day)}°C / {Math.round(WeatherData.temp.night)}°C</span>
    </div>)
}