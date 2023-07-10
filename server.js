const express = require('express')
const app = express()


const env = process.env.NODE_ENV;

const port = env === 'ci' ? 8090 : env === 'dev' ? 8080 : 8080;

app.use('*', express.static('dist/index.html'))
app.use('/account/register', express.static('dist/index.html'))
app.use('/account/register', express.static('dist/index.html'))
app.use('/account/login', express.static('dist/index.html'))
app.use('/users', express.static('dist/index.html'))
app.use('/users/edit/:id', express.static('dist/index.html'))
app.use('/users/add', express.static('dist/index.html'))
app.use('/operations', express.static('dist/index.html'))
app.use('/operations/edit/:id', express.static('dist/index.html'))
app.use('/operations/add', express.static('dist/index.html'))
app.use('/records', express.static('dist/index.html'))
app.use('/records/edit/:id', express.static('dist/index.html'))
app.use('/records/add', express.static('dist/index.html'))


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})