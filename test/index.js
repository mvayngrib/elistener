
var EventEmitter = require('events').EventEmitter
var test = require('tape')
var toElistener = require('../')

test('basic listen/stopListening', function (t) {
  var e = new EventEmitter()
  var listener = {}
  var event = 'hello'
  var eventArg = 'world'
  var shouldHear
  toElistener(listener)

  function attach () {
    listener.listenTo(e, event, helloHandler)
  }

  function helloHandler (data) {
    t.equal(shouldHear, true)
    t.equal(data, eventArg)
  }

  attach()
  shouldHear = true
  e.emit(event, eventArg)

  listener.stopListening(e, event, helloHandler)
  shouldHear = false
  e.emit(event, eventArg)

  attach()
  shouldHear = true
  e.emit(event, eventArg)

  listener.stopListening(e, event)
  shouldHear = false
  e.emit(event, eventArg)

  attach()
  shouldHear = true
  e.emit(event, eventArg)

  listener.stopListening(e)
  shouldHear = false
  e.emit(event, eventArg)

  listener.listenOnce(e, event, helloHandler)
  shouldHear = true
  e.emit(event, eventArg)
  shouldHear = false
  e.emit(event, eventArg)

  t.end()
})

test('multi stopListening', function (t) {
  var e = new EventEmitter()
  var listener = {}
  var shouldHear
  var count = 0
  toElistener(listener)

  function handler (data) {
    t.equal(shouldHear, true)
    count++
  }

  listener.listenTo(e, 'yo', handler)
  shouldHear = true
  e.emit('yo')
  t.equal(count, 1)

  listener.listenTo(e, 'yo', handler)
  e.emit('yo')
  t.equal(count, 3)

  listener.stopListening(e, 'yo')
  shouldHear = false
  e.emit('yo')
  t.equal(count, 3)

  listener.listenTo(e, 'yo', handler)
  listener.listenTo(e, 'ho', handler)
  listener.stopListening(e)
  shouldHear = false
  e.emit('yo')
  e.emit('ho')
  t.equal(count, 3)

  t.end()
})
