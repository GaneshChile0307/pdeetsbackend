const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const question = sequelize.define('questions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })

  question.registerRelationships = (models) => {
    question.hasMany(models.question_option, {
      foreignKey: 'question_id'
    })
  }

  return question
}
