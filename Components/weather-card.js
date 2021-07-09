import Styles from '../styles/weather-card.module.css'
export default function WeatherCard({WeatherData,timezoneOffset,weatherType}){
    function getTemperature(weatherType){
        if(weatherType=="daily") return <>{Math.round(WeatherData.temp.day)}°C / {Math.round(WeatherData.temp.night)}°C</>
        if(weatherType=="hourly") return <>{Math.round(WeatherData.temp)}°C</>
    }
    function getTime(weatherType){
        if(weatherType=="daily") return <>{days[CardDate.getDay()]+" " +CardDate.getDate()}</>
        if(weatherType=="hourly") return <>{days[CardDate.getDay()]+" " +CardDate.getDate()}<br/>{CardDate.toLocaleTimeString('en-US', {hour: '2-digit',minute:'2-digit'})}</>
    }
    let CardDate = new Date((WeatherData.dt+timezoneOffset)*1000)
    const days = ["Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat."]
    return(
    <div className={Styles.CardContainer}>
        <span style={{fontWeight:"500"}}>{getTime(weatherType)}</span><br/>
        <img className={Styles.Image}draggable="false" width="128" height="128" src={`http://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@4x.png`}/><br/>
        <span style={{fontSize:"15px",fontWeight:"500"}}>{WeatherData.weather[0].description}</span><br/>
        <span style={{fontSize:"16px",fontWeight:"500"}}>{getTemperature(weatherType)}</span>
    </div>)
}