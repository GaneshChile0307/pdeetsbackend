const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const questionOption = sequelize.define('question_options', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return questionOption
}
