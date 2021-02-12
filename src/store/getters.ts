import { AllState } from './interface'

const getters = {
  sidebar: (state: AllState) => state.app.sidebar,
  permissionRoutes: (state: AllState) => state.permission.routes,
  errorLogs: (state: AllState) => state.errorLog.logs,
  avatar: (state: AllState) => state.user.avatar,
  cachedViews: (state: AllState) => state.tagsView.cachedViews
}

export default getters
