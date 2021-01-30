export default interface UserState {
  token: undefined | string
  name: string
  avatar: string
  introduction: string
  roles: Array<any>
}
