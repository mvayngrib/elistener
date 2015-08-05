# elistener

## Usage

```js
var EventEmitter = require('events').EventEmitter
var elistener = require('elistener')

var cat = new EventEmitter()
var owner = {}
elistener.install(owner) // or just elistener(owner)

owner.listenTo(cat, 'meow', feed)
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')
cat.emit('meow')

// should print:
// fed cat
// petted cat
// sold cat

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
```

## Methods

### listenTo(emitter, event, handler)

### listenOnce(emitter, event, handler)

### stopListening([emitter, event, handler])
