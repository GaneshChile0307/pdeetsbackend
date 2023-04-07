const newsService = require('./news.service')

const getNews = async (req, res, next) => {
  try {
    const news = await newsService.getNews()
    res.status(200).json({
      message: 'News listing',
      data: {
        news
      }
    })
  } catch (err) {
    next(err)
  }
}

// module level error handler
const newsModuleErrorHandler = (err, req, res, next) => {
  console.log(err)
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'SequelizeDatabaseError':
      res.status(400).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  getNews,
  newsModuleErrorHandler
}
