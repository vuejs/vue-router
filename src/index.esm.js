import RouterView from './components/view'
import RouterLink from './components/link'
import { START as START_LOCATION } from './util/route'
import { isNavigationFailure, NavigationFailureType } from './util/errors'
import VueRouter from '.'

export default VueRouter
export { isNavigationFailure, NavigationFailureType, RouterLink, RouterView, START_LOCATION }
