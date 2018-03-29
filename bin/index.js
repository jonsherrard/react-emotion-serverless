#!/usr/bin/env node
'use strict'

require('dotenv').config()

const spawn = require('react-dev-utils/crossSpawn')
const command = process.argv[2]
const args = process.argv.slice(3)

const validCommands = ['start', 'build', 'dev']

if (command && !validCommands.includes(command)) {
  console.log(`\n${command} is not a valid command.\n`)
  process.exit(0)
}

spawn.sync('node', [require.resolve(`./${command || 'dev'}`)].concat(args), {
  stdio: 'inherit'
})