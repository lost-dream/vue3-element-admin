export enum MenubarStatus {
  PCE, // 电脑展开
  PCN, // 电脑合并
  PHE, // 手机展开
  PHN // 手机合并
}
export interface Layout {
  // 左侧导航栏
  menubar: {
    status: MenubarStatus
    menuList: Array<MenubarList>
    isPhone: boolean
  }
  // 用户信息
  userInfo: {
    name: string
    role: Array<string>
  }
  // 标签栏
  tags: {
    tagsList: Array<TagsList>
    cachedViews: Array<string>
  }
  ACCESS_TOKEN: string
  theme: number
  isLoading: boolean
}
interface Menubar {
  parentId?: number | string
  id?: number | string
  name: string
  path: string
  redirect?: string | { name: string }
  meta: {
    icon: string
    title: string
    permission?: Array<string>
    activeMenu?: string
    noCache?: boolean
  }
  hidden?: boolean
}
export interface MenubarList extends Menubar {
  component: () => Promise<typeof import('*.vue')>
  children?: Array<MenubarList>
}
export interface MenubarRoute extends Menubar {
  component: string
  children?: Array<MenubarRoute>
}

export interface TagsList {
  name: string
  title: string
  path: string
  isActive: boolean
}
