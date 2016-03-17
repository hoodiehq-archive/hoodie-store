var Hapi = require('hapi')
var PouchDB = require('pouchdb')
var memdown = require('memdown')
var inert = require('inert')
var path = require('path')
var hapiStore = require('./server')

var server = new Hapi.Server({})

server.connection({
  port: 4663
})

server.register(inert, function (err) {
  if (err) throw err
})

server.register({
  register: hapiStore,
  options: {
    PouchDB: PouchDB.defaults({
      db: memdown
    })
  }
}, function (error) {
  if (error) throw error
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file(path.join(__dirname, 'public', 'index.html'))
    }
  })

  server.route({
    method: 'GET',
    path: '/client.js',
    handler: function (request, reply) {
      reply.file(path.join(__dirname, 'public', 'client.js'))
    }
  })
})

server.start(function () {
  console.log('Server running at %s', server.info.uri)
})
