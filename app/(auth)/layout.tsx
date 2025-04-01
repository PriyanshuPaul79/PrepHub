import React,{ReactNode} from 'react'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';


const AuthLayout = async ({children}:{children:ReactNode}) => {


  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout