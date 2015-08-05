
// based on Backbone.JS listenTo/stopListening

var EventEmitter = require('events').EventEmitter
var ID_PROP = '_cleanListenId'

module.exports = mixin
module.exports.install = mixin

function mixin (obj) {
  var count = 0
  var allListeners = {}

  if (obj.listen || obj.stopListening) {
    throw new Error('refusing to override existing properties')
  }

  obj.listenTo = function (emitter, event, handler) {
    ensureEmitter(emitter)
    if (!(ID_PROP in emitter)) {
      emitter[ID_PROP] = count++
    }

    var id = emitter[ID_PROP]
    if (!allListeners[id]) allListeners[id] = {}

    var listeners = allListeners[id]
    if (!listeners[event]) {
      listeners[event] = []
    }

    listeners[event].push(handler)
    emitter.on(event, handler)
  }

  obj.stopListening = function (emitter, event, handler) {
    var id
    var listeners
    if (emitter) {
      ensureEmitter(emitter)
      id = emitter[ID_PROP]
      listeners = allListeners[id]
      ensureSubscribed(id)
    } else {
      // stop listening to everything
      for (id in allListeners) {
        stopListeningToEmitter(emitter, listeners)
      }

      return
    }

    if (!event) {
      // stop listening to an emitter
      ensureSubscribed(id)
      stopListeningToEmitter(emitter, listeners)
      return
    }

    if (!handler) {
      // remove a single listener
      stopListeningToEvent(emitter, listeners, event)
      return
    }

    var handlers = listeners[event]
    var idx = handlers.indexOf(handler)
    if (idx !== -1) {
      handlers.splice(idx, 1)
      emitter.removeListener(event, handler)
    }
  }

  obj.listenOnce = function (emitter, event, handler) {
    obj.listenTo(emitter, event, oneTimeThang)

    function oneTimeThang () {
      obj.stopListening(emitter, event, oneTimeThang)
      handler.apply(null, arguments)
    }
  }

  return obj
}

function stopListeningToEmitter (emitter, listeners) {
  if (!listeners) return

  for (var event in listeners) {
    stopListeningToEvent(emitter, listeners, event)
  }
}

function stopListeningToEvent (emitter, listeners, event) {
  var eventSpecific = listeners[event]
  for (var i = 0; i < eventSpecific.length; i++) {
    emitter.removeListener(event, eventSpecific[i])
  }

  delete listeners[event]
}

function ensureEmitter (emitter) {
  if (!(emitter instanceof EventEmitter)) {
    throw new Error('expected EventEmitter')
  }
}

function ensureSubscribed (id) {
  if (typeof id === 'undefined') {
    throw new Error('not subscribed to this emitter')
  }
}
