import idx from 'idx'
import normaliseUrlPath from './normalise-url-path'

export default (config, url) => {
  // Handle preview API path
  if (idx(url, _ => _.query.tapestry_hash))
    return `${normaliseUrlPath(config.siteUrl)}/wp-json/revision/v1`
  // Handle wordpress.com API path
  if (idx(config, _ => _.options.wordpressDotComHosting)) {
    // Remove protocol
    const noProtocolSiteUrl = config.siteUrl.replace(/^https?:\/\//i, '')
    return `https://public-api.wordpress.com/wp/v2/sites/${normaliseUrlPath(
      noProtocolSiteUrl
    )}`
  }
  // Default to standard API path
  return `${normaliseUrlPath(config.siteUrl)}/wp-json/wp/v2`
}
