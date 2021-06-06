import Head from 'next/head'
import Link from 'next/link'

export default function WeatherSearch({dataWeather}) {
  const getResult = () => {
    if(dataWeather === null) return("city not found")
    else return(`Now it\'s: ${dataWeather.current.weather[0].main}`)
  }
  return (
    <div>
      <Head>
        <title>WeatherFilter</title>
        <meta name="description" content="Find day by weather with WeatherFilter!" />
      </Head>
      <main>
        {getResult()} <br/>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </main>
    </div>
  )
}
export async function getServerSideProps(context) {
  //get lat and lon
  let dataWeather = null
  let latLonData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${context.query.city_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}&limit=1&appid=187db54233cfd9ab55e609decd15cc0d`)
  latLonData = await latLonData.json()
  if(latLonData[0] == null) return {props: {dataWeather}} 
  let lat = latLonData[0].lat
  let lon = latLonData[0].lon
  dataWeather = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=187db54233cfd9ab55e609decd15cc0d`)
  dataWeather = await dataWeather.json()
  return {
    props: {dataWeather}
  }
}