'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const user = await db.collection('users').doc(uid).get();
        if (user.exists) {
            return {
                success: false,
                message: "User already exist please login"
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email
        })
    } catch (e: any) {
        console.error('Error creating user:', e);
        if (e.code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: "Email already exist"
            }
        }

        return {
            success: false,
            message: "Something went wrong"
        }
    }

}


export async function signin(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found"
            }
        }

        await setSessionCookie(idToken);
    } catch (e) {
    console.log(e);

    return {
        success: false,
        message: "Something went wrong"
        }
    }
}


export async function setSessionCookie(params: SignInParams) {
    const cookie = await cookies()
    const sessionCookie = await auth.createSessionCookie(params.idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000,
    });
    cookie.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
} 