const express = require('express')
const app = express()


const env = process.env.NODE_ENV;

const port = env === 'ci' ? 8090 : env === 'dev' ? 8080 : 8080;

app.use('*', express.static('dist/index.html'))


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})