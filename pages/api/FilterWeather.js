export default (req, res) => {
  if(req.body.DailyWeather==null) {res.status(200).json({"isError":true,"errorMessage":"body.DailyWeather is null!","result":[]});return}
  let weather = req.body.DailyWeather
  if(req.body.Filters==null){res.status(200).json({"isError":true,"errorMessage":"body.Filters is null!","result":[]});return}
  let filters = req.body.Filters
  if(parseInt(filters.Temperature.From)==null) {res.status(200).json({"isError":true,"errorMessage":"can not convert body.Filters.Temperature.From to int","result":[]});return}
  if(parseInt(filters.Temperature.To)==null) {res.status(200).json({"isError":true,"errorMessage":"can not convert body.Filters.Temperature.To to int","result":[]});return}
  if(parseInt(filters.Temperature.To) < parseInt(filters.Temperature.From)) {res.status(200).json({"isError":true,"errorMessage":"body.Filters.Temperature.From is greater than body.Filters.Temperature.To","result":[]});return}
  let result = []
  if(weather.map == null) {res.status(200).json({"isError":true,"errorMessage":"body.DailyWeather is not an array!","result":[]});return}
  weather.map((elem)=>{
    if(elem.temp.day>=parseInt(filters.Temperature.From) && elem.temp.day<=parseInt(filters.Temperature.To)){
      if(filters.WeatherTags.includes(elem.weather[0].main)) result.push(elem)
    }
  })
  res.status(200).json({"isError":false,"errorMessage":"","result":result})
}
