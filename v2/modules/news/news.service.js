const axios = require('axios')

const getNews = async () => {
  const newsRequest = await axios.get(process.env.KIELSTEIN_API + '/news')
  return newsRequest.data
}

module.exports = {
  getNews
}
