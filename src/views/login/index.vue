<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <p class="title">后台登录</p>
      </div>
      <div class="form-body">
        <el-form-item prop="username" class="form-item">
        <span class="svg-container"><svg-icon icon-class="user" /></span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container"><svg-icon icon-class="password" /></span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /></span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:22px;" @click.native.prevent="handleLogin">
          登录
        </el-button>
        <div class="tip">
          请输入正确的用户名密码
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能为空，且不能低于6个字符长度'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 32px;
    width: 85%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      color: #515a6e;
      height: 32px;
      caret-color: #515a6e;
      padding: 0 3px;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    line-height: 32px;
    .el-form-item__content{
      line-height: 32px;
      border: 1px solid #f3f3f3;
      border-right: 4px;
      background: #fff;
    }
  }
}
  .tip{
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #c3c3c3;
    margin-bottom: 15px;
  }
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("../../assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  .login-form {
    position: absolute;
    width: 300px;
    transform: translateY(-60%);
    right: 160px;
    top: 50%;
    overflow: hidden;
    background: #fff;
    border-radius:4px;
  }
  .form-body{
    padding: 16px;
  }

  .svg-container {
    padding: 0 7px 0 7px;
    color: #515a6e;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    border-bottom: 1px solid #e8eaec;
    padding: 14px 16px;
    line-height: 1;
    .title {
      font-size: 14px;
      color: #17233d;
      height: 20px;
      line-height: 20px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      display: inline-block;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

</style>
