# ts 混合 interface 定义

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
