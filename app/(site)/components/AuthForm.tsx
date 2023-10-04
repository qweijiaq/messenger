'use client'

import axios from 'axios'
import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '@/app/components/inputs/Input'
import Button from '@/app/components/Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Variant = '登录' | '注册'

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('登录')
  const [isLoading, setIsLoading] = useState(false)
  const toggleVariant = useCallback(() => {
    if (variant === '登录') {
      setVariant('注册')
    } else {
      setVariant('登录')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    if (variant === '注册') {
      axios
        .post('/api/register', data)
        .then(() => toast.success('注册成功'))
        .catch(() => {
          const { name, email, password } = data
          if (name === '') {
            toast.error('请输入用户名')
          } else if (email === '') {
            toast.error('请输入邮箱')
          } else if (password === '') {
            toast.error('请输入密码')
          } else {
            toast.error('该邮箱已存在，请更换邮箱')
          }
        })
        .finally(() => setIsLoading(false))
    }
    if (variant === '登录') {
      console.log(1)
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            console.log(2)
            toast.error('登录失败')
            window.location.href = '/'
          }
          if (callback?.ok) {
            console.log(3)
            toast.success('登录成功')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)
    // NextAuth Social Sign In
  }

  return (
    <div
      className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
          "
    >
      <div
        className="
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
              "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === '注册' && (
            <Input
              id="name"
              label="用户名"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="邮箱"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="密码"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullwidth type="submit">
              {variant === '登录' ? '登录' : '注册'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
                    absolute
                    inset-0
                    flex
                    items-center
                  "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">第三方登录</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
          </div>
        </div>

        <div
          className="
          flex
          gap-2
          justify-center
          text-sm
          mt-6
          px-2
          text-gray-500
        "
        >
          <div>{variant === '登录' ? '来都来了，不注册一下吗？' : '已经有一个账号了吗？'}</div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === '登录' ? '注册' : '登录'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
function useRoute() {
  throw new Error('Function not implemented.')
}
