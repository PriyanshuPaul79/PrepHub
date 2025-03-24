"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {toast} from 'sonner'
import FormField from '@/components/FormField'
import { useRouter } from 'next/navigation'



const AuthFormSchema = (type:FormType)=>{



    return z.object({
        name:type === "sign-up"? z.string().min(3) :z.string().optional(),
        email: z.string().email(),  
        password: z.string().min(6),

    })
}


const Auth = ({ type }:{ type: FormType }) => {
    const router = useRouter();
    const formSchema = AuthFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === 'sign-up'){
                toast.success('Account Created Successful !!!');
                router.push('/sign-in');
            }else{
                toast.success('Login Successful !!!');
                router.push('/');;               
            }
        }catch(error){
            console.log(error);
            toast.error(`Here's the error : ${error} `)
        }
    }

    const isSignin = type === "sign-in";

    return (
        <div className='card-border lg:min-w-[566px]'>
            <div className='flex flex-col gap-6 card py-14 px-10 '>

                <div className='flex flex-row gap-2 justify-center'>
                    <Image src='/logo.svg' alt="logo" height={32} width={38} />
                    <h2 className='text-primary-100'>PrepHub</h2>
                </div>
                <h3>
                    Practice for your next interview with AI
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form ">
                        {!isSignin && (
                            <FormField 
                            control={form.control}
                            name='name'
                            label='Name'
                            placeholder='Enter your Name' />
                        )}

                            <FormField 
                            control={form.control}
                            name='email'
                            label='Email'
                            placeholder='Enter your Email'
                            type='email' />

                            <FormField 
                            control={form.control}
                            name='password'
                            label='Password'
                            placeholder='Enter your Password'
                            type='password' />

                        <Button className='btn' type="submit">{isSignin ? "Sign In" : "Create an Account"}</Button>
                    </form>
                </Form>

                <p className='text-center'>{isSignin ? "Don't have an account?" : "Already have an account?"}
                    <Link href={!isSignin ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {!isSignin ? 'Sign-in' : 'Sign-up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Auth