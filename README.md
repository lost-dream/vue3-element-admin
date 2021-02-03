# Q & A

## ts 混合 interface 定义

```typescript
interface UserForm {
  username: string
  password: string
}

type keys = keyof UserForm

interface State {
  loginForm: UserForm
  loginRules: {
    [K in keys]: [{ required: boolean; trigger: 'blur'; validator: Function }]
  }
}
```

## TODO

- [ ] @/utils/clipboard.ts line25: 不使用`declare module 'clipboard'`下, 报错`类型“ClipboardJS”上不存在属性“onClick”。ts(2339)`,怎么解决
