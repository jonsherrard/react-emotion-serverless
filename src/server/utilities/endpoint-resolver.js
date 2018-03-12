import idx from 'idx'
import isPlainObject from 'lodash.isplainobject'
import resolvePaths from './resolve-paths'
import fetcher from './fetcher'

let query = null
let origin = null
let preview = false
let fetchRequests = []

const fetchJSON = endpoint => {
  // set default JSON source
  let url = `${origin}/api/v1/${endpoint}`
  // detect if preview source required
  if (preview) {
    const queryPrefix = endpoint.indexOf('?') > -1 ? '&' : '?'
    const queryParams = `tapestry_hash=${query.tapestry_hash}&p=${query.p}`
    url = `${origin}/api/preview/v1/${endpoint}${queryPrefix}${queryParams}`
  }
  // return fetch as promise
  return fetcher(url).then(resp => resp.json())
}
const mapArrayToObject = (arr, obj) => {
  const keys = Object.keys(obj)
  return arr.reduce((prev, curr, i) => {
    prev[keys[i]] = arr[i]
    return prev
  }, {})
}

// handle promise resolution
const handleResolve = (endpoint, resp, cb) => {
  // if this request is not the latest (i.e. the last item in the array) ignore
  if (fetchRequests[fetchRequests.length - 1] !== endpoint) {
    return
  }
  cb(null, { data: resp })
  // reset queued requests
  fetchRequests = []
}

const handleReject = (err, cb) => {
  cb(err)
}

// loadFrom: string | object | array
// apiUrl: 'string' - CMS location
export default ({ loadFrom, apiURl , params, cb }) => {
  // save data for use in util functions
  query = idx(loadContext, _ => _.location.query)
  origin = loadContext.serverUri || window.location.origin
  preview = idx(loadContext, _ => _.location.query.tapestry_hash)
  // fetch each endpoint
  const endpoint = resolvePaths({
    paths: loadFrom,
    params,
    cb: fetchJSON
  })

  // save reference of API request
  fetchRequests.push(endpoint.paths)

  const isArray = Array.isArray(endpoint.paths)
  const isObject = isPlainObject(endpoint.paths)

  // handle endpoint configurations
  // can be one of Array, Object, String
  const result =
    isArray || isObject ? Promise.all(endpoint.result) : endpoint.result
  // wait for all to resolve
  return result
    .then(resp => {
      // update response to original object schema (Promise.all() will return an ordered array so we can map back onto the object correctly)
      if (isObject) return mapArrayToObject(resp, endpoint.paths)
      else return resp
    })
    .then(resp => handleResolve(endpoint.paths, resp, cb))
    .catch(err => handleReject(err, cb))
}
