import { AllState } from './interface'

const getters = {
  sidebar: (state: AllState) => state.app.sidebar,
  permissionRoutes: (state: AllState) => state.permission.routes,
  errorLogs: (state: AllState) => state.errorLog.logs
}

export default getters
