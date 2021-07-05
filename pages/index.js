import Head from 'next/head'
import Styles from '../styles/Home.module.css'

export default function Home() {
  function shakeHorizontal(element,maxX,shakeTimes) {
    const prevColor = element.style.backgroundColor
    element.style.backgroundColor = "#dc3545"
    element.style.borderColor = "#dc3545"
    let counter=1
    let nextXmove = maxX
    let slowUnit = maxX / shakeTimes
    let reverse = 1
    const shake = () => {
      element.style.transform = `translate(${nextXmove*reverse}px,0px)`;
      if(reverse==1)reverse=-1
      else reverse = 1
      nextXmove -= slowUnit
      console.log(nextXmove*reverse)
      setTimeout(()=>{
        counter += 1
        if(counter <= shakeTimes){
          shake()
        }else{
          element.style.transform = 'translate(0px,0px)';
          element.style.backgroundColor = prevColor
          element.style.borderColor = prevColor
        }
      },100)
    }
    shake()
}

  const search = () => {
    let inputVal = document.getElementById("CityName").value
    if(inputVal=="") shakeHorizontal(document.getElementById("CityName"),30,4)
    else window.open(`${window.location.href}weather/${inputVal}`,"_self")
    
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search()
    }
  }
  return (
    <div className={Styles.container}>
      <Head>
        <title>WeatherFilter</title>
        <meta name="description" content="Find day by weather with WeatherFilter!" />
      </Head>
      <div className={"my-5"}>
        <h1>Welcome in WeatherFilter!</h1>
        <h3>Find day by weather!</h3>
      </div>
      <div className={"my-5"}>
        <input className={Styles.inputBox}id="CityName" type="text" onKeyDown={handleKeyDown} placeholder="Localization"/><br/>
        <input type="button" onClick={search} className="Btn" value="Get weather!"/><br/>
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  await fetch("https://api.countapi.xyz/hit/hejx3WgYernjXEqcE/siteClicks")
  return {
    props: {},
  }
}