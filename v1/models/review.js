const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const review = sequelize.define('reviews', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    number_of_stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review_text: {
      type: DataTypes.TEXT
    }
  })

  return review
}
