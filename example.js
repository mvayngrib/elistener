var EventEmitter = require('events').EventEmitter
var elistener = require('./')

var cat = new EventEmitter()

function Owner () {}
elistener.install(Owner.prototype) // or just elistener(Owner.prototype)

var owner = new Owner()
owner.listenTo(cat, 'meow', feed)
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')

function feed () {
  console.log('fed cat')
  owner.stopListening(cat, 'meow', feed) // remove handler
  owner.listenTo(cat, 'meow', pet)
}

function pet () {
  console.log('petted cat')
  owner.stopListening(cat, 'meow') // remove all handlers for event
  owner.listenTo(cat, 'meow', sell)
}

function sell () {
  console.log('sold cat')
  owner.stopListening(cat) // remove all handlers
}
