import {
	createStore
} from 'vuex'
import core from './core.js'
import message from './message.js'
import dictionaries from './dictionaries.js'

export default createStore({
	modules: {
		core, message, dictionaries
	}
})
