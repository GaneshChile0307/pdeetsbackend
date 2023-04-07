const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('swagger.yaml')

module.exports = (app) => {
  app.use('/v2/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      requestInterceptor: (request) => {
        request.header.origin = `http://localhost:${process.env.PORT}`
        return request
      }
    }
  }))
}
