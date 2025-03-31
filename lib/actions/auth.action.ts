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


        return {
            success: true,
            message: "User created successfully please sign in"
        }
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


export async function signIn(params: SignInParams) {
    // const { email, idToken } = params;

    // try {
    //     const userRecord = await auth.getUserByEmail(email);
    //     if (!userRecord) {
    //         return {
    //             success: false,
    //             message: "User not found"
    //         }
    //     }

    //     await setSessionCookie(idToken);

    // } catch (e) {
    // console.log(e);

    // return {
    //     success: false,
    //     message: "Something went wrong"
    //     }
    // }


    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found"
            }
        }

        const sessionResult = await setSessionCookie({ idToken });

        if (!sessionResult.success) {
            return {
                success: false,
                message: sessionResult.message
            };
        }

        return {
            success: true,
            message: "Signed in successfully"
        };

    } catch (e) {
        console.log("Error in signIn:", e);

        return {
            success: false,
            message: "Something went wrong"
        }
    }
}


export async function setSessionCookie(params: SignInParams) {
    //    working fine 
    // const cookieStore = await cookies()
    // const sessionCookie = await auth.createSessionCookie(params.idToken, {
    //     expiresIn: 60 * 60 * 24 * 7 * 1000,
    // });
    // cookieStore.set('session', sessionCookie, {
    //     maxAge: 60 * 60 * 24 * 7,
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     path: '/',
    //     sameSite: 'lax'
    // });

    try {
        const decodedToken = await auth.verifyIdToken(params.idToken); // ✅ Verify ID token
        const sessionCookie = await auth.createSessionCookie(params.idToken, {
            expiresIn: 60 * 60 * 24 * 7 * 1000,
        });

        const cookieStore = cookies();
        cookieStore.set('session', sessionCookie, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });

        return { success: true, message: "Session created", uid: decodedToken.uid };
    } catch (error) {
        console.error("Error in setSessionCookie:", error);
        return { success: false, message: "Invalid ID token" };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: decodedClaims.id,
        } as User
    }
    catch (e) {
        console.log(e);
        return null;
    }
};


export async function isAuthenticated() {
    const user = await getCurrentUser();

    // either user exist or not can be a boolean value thats why we are using !! here to get the actual value 
    return !!user;
}