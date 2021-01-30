import LayoutState from './modules/layout/interface'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RootState {}

export interface AllState extends RootState {
  layout: LayoutState
}
