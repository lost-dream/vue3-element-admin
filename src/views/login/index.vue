<template>
  <div class="layout-login" @keyup="enterSubmit">
    <el-form ref="ruleForm" label-position="right" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="pwd" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <p class="leading-5">
          账号: admin 密码: admin
        </p>
        <p class="leading-5">
          账号: dev 密码: dev
        </p>
        <p class="leading-5">
          账号: test 密码: test
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'

interface Form {
  name: string
  pwd: string
}

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()

    const form = reactive<Form>({
      name: 'admin',
      pwd: 'admin'
    })
    const ruleForm = ref(null)

    const onSubmit = async () => {
      const { name, pwd } = form
      await store.dispatch('layout/login', { username: name, password: pwd })
      ElNotification({
        title: '欢迎',
        message: '欢迎回来',
        type: 'success'
      })
    }

    const enterSubmit = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSubmit()
      }
    }

    const rules = reactive({
      name: [
        {
          validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => void) => {
            if (!value) {
              return callback(new Error('用户名不能为空'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],
      pwd: [
        {
          validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => void) => {
            if (!value) {
              return callback(new Error('密码不能为空'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ]
    })

    return {
      ...toRefs(form),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      ruleForm,
      rules,
      onSubmit,
      enterSubmit
    }
  }
})
</script>

<style scoped>
.layout-login {
  padding-top: 200px;
  width: 400px;
  margin: 0 auto;
}
</style>
