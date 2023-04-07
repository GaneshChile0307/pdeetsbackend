const reviewStars = [3, 4, 5]
const reviewText = [
  'Amazing doctor, always took time to listen and provide great care.',
  "Couldn't be more pleased with this doctor's knowledge and attention.",
  'This doctor went above and beyond for me, truly cared for my well-being.',
  'Exceptionally explained everything and answered all my questions.',
  'Consistently excellent care from this doctor over the years.',
  "Impressed by this doctor's ability to understand and address my concerns.",
  'Kind and patient, really appreciate the care from this doctor.',
  'This doctor made sure I received the best possible care.',
  'Attentive and ensured I was comfortable and understood everything.',
  'Very professional and caring towards patients, great doctor.'
]

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const getRandomReview = async () => {
  return {
    reviewStars: getRandomElement(reviewStars),
    reviewText: getRandomElement(reviewText)
  }
}

module.exports = {
  getRandomReview
}
