import LayoutState from './modules/layout/interface'
import UserState from './modules/user/interface'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RootState {}

export interface AllState extends RootState {
  layout: LayoutState
}

export interface AllState extends RootState {
  user: UserState
}
