#!/usr/bin/env node
'use strict'
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  const { start } = require('../dist/index.cjs')
  start()
}

else {
  const { start } = await import('../dist/index.mjs')
  start()
}

