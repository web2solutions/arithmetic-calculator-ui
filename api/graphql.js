import { graphql, buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    dashboard: String,
    users: [],
    records: [],
    operations: [],
  }
`)

// The rootValue provides a resolver function for each API endpoint
const rootValue = {
  dashboard: () => {
    return "Hello world!"
  },
  users: () => {
    return { data: [] }
  },
  records:  () => {
    return { data: [] }
  },
  operations:  () => {
    return { data: [] }
  },
}

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }

async function handler(req, res) {
    console.log(process.env.NODE_ENV);
    const request = req.body;
    console.log(request.query);
    const gresponse = await graphql({
        schema,
        source: request.query,
        rootValue,
    });
    console.log(gresponse)
    return res.status(200).json(gresponse);
    // return 
}

export default allowCors(handler)