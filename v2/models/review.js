const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const review = sequelize.define('reviews', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.INTEGER,
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
