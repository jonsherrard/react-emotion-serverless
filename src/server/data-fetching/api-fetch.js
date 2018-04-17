import chalk from 'chalk'
import fetcher from './fetcher'
import timing from '../utilities/timing'
import { log } from '../utilities/logger'

const apiFetch = (url, allowEmptyResponse = false) => {
  timing.start(`fetch: ${url}`)
  return fetcher(url)
    .then(resp => {
      const { ok, status, statusText } = resp
      log.debug(`API Fetch: Response for ${chalk.green(url)}`, {
        ok,
        status,
        statusText
      })
      if (!ok) {
        throw {
          // Fetch library properties
          name: 'FetchError',
          type: 'http-error',
          // Traditional request properties
          status,
          statusText,
          // Tapestry properties (we should remove these)
          message: statusText,
          code: status
        }
      } else {
        return resp
      }
    })
    .then(resp => resp.json())
    .then(apiData => {
      timing.end(`fetch: ${url}`)
      log.silly(`API Fetch: Data from ${chalk.green(url)}`, apiData)
      if (apiData.length == false && allowEmptyResponse !== true) {
        throw {
          name: 'FetchError',
          type: 'http-error',
          statusText: 'WP-API returned no results',
          message:
            'WP-API returned no results and empty results are not allowed on this route',
          code: 404
        }
      } else {
        return apiData
      }
    })
    .catch(err => log.error(`API Fetch: Catch error`, err))
}

export default apiFetch
