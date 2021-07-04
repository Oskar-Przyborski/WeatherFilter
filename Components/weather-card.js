import Styles from '../styles/weather-card.module.css'
export default function WeatherCard({WeatherData}){
    let CardDate = new Date(WeatherData.dt*1000)
    const days = ["Mon.","Tue.","Wed.","Thu.","Fri.","Sat.","Sun."]
    return(
    <div className={Styles.CardContainer}>
        <span style={{fontWeight:"500"}}>{days[CardDate.getDay()]+" " +CardDate.getDate()}</span>
        <img width="128" height="128" src={`http://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@4x.png`}/>
    </div>)
}