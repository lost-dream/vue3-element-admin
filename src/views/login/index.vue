<template>
  <!-- TODO 显示隐藏密码效果优化 -->
  <div class="login-container">
    <el-form ref="loginFormWrapper" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">Login Form</h3>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          autocomplete="on"
        >
          <template #prepend>
            <i class="el-icon-user-solid"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keydown="checkCapsLock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          >
            <template #prepend>
              <i class="el-icon-lock"></i>
            </template>

            <template #append>
              <i class="el-icon-view" @click="showPassword"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.prevent="handleLogin"
        >Login</el-button
      >

      <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from '@/store'
import { validUsername } from '@/utils/validate'
import { LocationQueryValue, LocationQuery, useRoute, useRouter } from 'vue-router'

interface Form {
  username: string
  password: string
}

type keys = keyof Form

interface State {
  loginForm: Form // form 表单内容
  loginRules: {
    // 每条表单校验
    [K in keys]: [{ required: boolean; trigger: 'blur'; validator: Function }]
  }
  passwordType: 'password' | '' // 填写密码的类型
  capsTooltip: boolean // 是否显示切换大小写的提示
  loading: boolean // 是否为加载状态
  redirect: undefined | LocationQueryValue // 重定向路由参数
  otherQuery: { [index: string]: any } // 页面其他路由 query
}

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const validateUsername = (rule: Function, value: string, callback: Function) => {
      if (!validUsername(value)) {
        callback(new Error('please enter the correct user name'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule: Function, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    const loginFormWrapper = ref()
    const username = ref()
    const password = ref()

    const state = reactive<State>({
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    })

    const checkCapsLock = function(e: KeyboardEvent) {
      console.log('e :>> ', e.key)
      const { key } = e
      state.capsTooltip = Boolean(key && key.length === 1 && key >= 'A' && key <= 'Z')
    }

    const showPassword = () => {
      if (state.passwordType === 'password') {
        state.passwordType = ''
      } else {
        state.passwordType = 'password'
      }
    }

    const handleLogin = () => {
      loginFormWrapper.value.validate((valid: any) => {
        if (valid) {
          state.loading = true
          store.dispatch('user/login', state.loginForm).then(() => {
            router.push({
              path: state.redirect || '/',
              query: state.otherQuery
            })

            state.loading = false
          })
        }
      })
    }

    const getOtherQuery = (query: LocationQuery) => {
      return Object.keys(query).reduce((acc: { [index: string]: any }, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    watch(
      () => route,
      route => {
        const query = route.query
        if (query) {
          state.redirect = query.redirect as LocationQueryValue
          state.otherQuery = getOtherQuery(query)
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      if (state.loginForm.username === '') {
        username.value.focus()
      } else if (state.loginForm.password === '') {
        password.value.focus()
      }
    })

    return {
      loginFormWrapper,
      username,
      password,
      ...toRefs(state),
      checkCapsLock,
      showPassword,
      handleLogin
    }
  }
})
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  width: 100%;
  background-color: #283443;
  overflow: hidden;
  ::v-deep .el-input {
    input {
      background: transparent;
      border: 0px;
      padding: 12px 15px 12px 15px;
      color: #eee;
      height: 47px;
    }
    .el-input-group__prepend,
    .el-input-group__append {
      background: transparent;
      border: 0px;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}

.login-form {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}

.title {
  font-size: 26px;
  color: #eee;
  margin: 0px auto 40px auto;
  text-align: center;
}
</style>
