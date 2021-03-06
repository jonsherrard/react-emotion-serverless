import 'isomorphic-unfetch'
import 'promis'

import React from 'react'
import { hydrate } from 'react-dom'
import { loadComponents } from 'loadable-components'

import config from '../config/config-proxy'
import Root from './root'

// Hydrate server rendered CSS with either Emotion or Glamor
require('emotion').hydrate(window.__TAPESTRY_DATA__.ids)

loadComponents().then(() =>
  hydrate(<Root {...config} />, document.getElementById('root'))
)
