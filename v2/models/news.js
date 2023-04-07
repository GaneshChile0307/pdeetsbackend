const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const news = sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    news_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT,
      get () {
        const url = this.getDataValue('image_url')
        return url ? `${process.env.HOST}${url}` : null
      }
    }
  })

  return news
}
