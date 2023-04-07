const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const questionOption = sequelize.define('question_options', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return questionOption
}
