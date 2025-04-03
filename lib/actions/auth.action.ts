'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const user = await db.collection("users").doc(uid).get();
        if (user.exists) {
            return {
                success: false,
                message: "User already exist please login",
            };
        }

        await db.collection("users").doc(uid).set({
            name,
            email,
        });


        return {
            success: true,
            message: "User created successfully please sign in"
        };
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
        };
    }
}


export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found",
            };
        }

        await setSessionCookie(idToken);

    } catch (e:any) {
    console.log("");

    return {
        success: false,
        message: "Something went wrong",
        };
    }
}


export async function signOut() {
    const cookieStore = await cookies();
  
    cookieStore.delete("session");
  }

export async function setSessionCookie(idToken: string) {
    //    working fine 
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000,
    });
    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}


export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};


// export async function getCurrentUser(): Promise<User | null> {
//     try {
//       const cookieStore = await cookies()
//       const sessionCookie = cookieStore.get('session')?.value
  
//       if (!sessionCookie) return null
  
//       // Verify session cookie with Firebase
//       const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
  
//       // Additional check with database
//       const userDoc = await db.collection("users").doc(decodedClaims.uid).get()
//       return userDoc.exists ? { ...userDoc.data(), id: userDoc.id } as User : null
//     } catch (error) {
//       console.error('Authentication error:', error)
//       return null
//     }
//   }


export async function isAuthenticated() {
    const user = await getCurrentUser();

    // either user exist or not can be a boolean value thats why we are using !! here to get the actual value 
    return !!user;
}



export async function getInterviewsByUserId(userId:string): Promise<Interview[] | null> {
    const interviews = await db.collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

    return interviews.docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
    })) as Interview[];
}




export async function getLatestInterviews(params:GetLatestInterviewsParams): Promise<Interview[] | null> {
    const {userId,limit=20} = params ; 

    const interviews = db.collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get();

    return (await interviews).docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
    })) as Interview[];
}