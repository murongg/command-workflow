#!/usr/bin/env node
'use strict'
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  console.log('commonjs')
  require('../dist/index.cjs')
}

else {
  import('../dist/index.mjs')
  console.log('esmodule')
}

