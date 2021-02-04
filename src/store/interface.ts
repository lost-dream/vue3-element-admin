import LayoutState from './modules/layout/interface'
import UserState from './modules/user/interface'
import AppState from './modules/app/interface'
import PermissionState from './modules/permission/interface'
import SettingState from './modules/settings/interface'
import ErrorLogState from './modules/errorLog/interface'
import TagsViewState from './modules/tagsView/interface'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RootState {}

export interface AllState extends RootState {
  layout: LayoutState
}

export interface AllState extends RootState {
  user: UserState
}

export interface AllState extends RootState {
  app: AppState
}

export interface AllState extends RootState {
  permission: PermissionState
}

export interface AllState extends RootState {
  settings: SettingState
}

export interface AllState extends RootState {
  errorLog: ErrorLogState
}

export interface AllState extends RootState {
  tagsView: TagsViewState
}
