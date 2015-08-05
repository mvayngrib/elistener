
// based on Backbone.JS listenTo/stopListening

var EventEmitter = require('events').EventEmitter
var ID_PROP = '_elistenerId'
var LISTENERS_PROP = '_elisteners'
var count = 0

module.exports = mixin
module.exports.install = mixin

function mixin (obj) {
  if (obj.listenTo || obj.stopListening) {
    throw new Error('refusing to override existing properties')
  }

  obj.listenTo = function (emitter, event, handler) {
    var infos = this[LISTENERS_PROP]
    if (!infos) {
      infos = this[LISTENERS_PROP] = {}
    }

    ensureEmitter(emitter)
    if (!(ID_PROP in emitter)) {
      emitter[ID_PROP] = count++
    }

    var id = emitter[ID_PROP]
    if (!infos[id]) {
      infos[id] = {
        emitter: emitter,
        listeners: {}
      }
    }

    var listeners = infos[id].listeners
    if (!listeners[event]) {
      listeners[event] = []
    }

    listeners[event].push(handler)
    emitter.on(event, handler)
  }

  obj.stopListening = function (emitter, event, handler) {
    var infos = this[LISTENERS_PROP]
    if (!infos) {
      throw new Error('not listening to anything')
    }

    var id
    var info
    if (emitter) {
      ensureEmitter(emitter)
      id = emitter[ID_PROP]
      info = infos[id]
      if (emitter !== info.emitter) {
        throw new Error('emitter id was compromised')
      }

      ensureSubscribed(id)
    } else {
      // stop listening to everything
      for (id in infos) {
        info = infos[id]
        stopListeningToEmitter(info.emitter, info.listeners)
      }

      return
    }

    if (!event) {
      // stop listening to an emitter
      ensureSubscribed(id)
      stopListeningToEmitter(emitter, info.listeners)
      return
    }

    if (!handler) {
      // remove a single listener
      stopListeningToEvent(emitter, info.listeners, event)
      return
    }

    var handlers = info.listeners[event]
    var idx = handlers.indexOf(handler)
    if (idx !== -1) {
      handlers.splice(idx, 1)
      emitter.removeListener(event, handler)
    }
  }

  obj.listenOnce = function (emitter, event, handler) {
    var self = this
    this.listenTo(emitter, event, oneTimeThang)

    function oneTimeThang () {
      self.stopListening(emitter, event, oneTimeThang)
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
