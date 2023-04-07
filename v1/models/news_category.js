const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const newsCategories = sequelize.define('news_categories', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  })

  newsCategories.registerRelationships = (model) => {
    newsCategories.hasMany(model.news, {
      foreignKey: 'news_category_id'
    })
  }

  return newsCategories
}
