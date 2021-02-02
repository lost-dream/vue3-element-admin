import { AllState } from './interface'

const getters = {
  sidebar: (state: AllState) => state.app.sidebar,
  permissionRoutes: (state: AllState) => state.permission.routes
}

export default getters
