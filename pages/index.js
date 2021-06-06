import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const search = () => {
    window.open(`${window.location.href}weather/${document.getElementById("CityName").value}`,"_self")
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>WeatherFilter</title>
        <meta name="description" content="Find day by weather with WeatherFilter!" />
      </Head>
      <main className={styles.main}>
        City <input id="CityName" type="text"/>
        <br/>
        <a onClick={search}>Search</a>
      </main>
    </div>
  )
}

export async function getServerSideProps(){
  console.log("Ktoś wszedł na stronę!")
  return {
    props: {},
  }
}