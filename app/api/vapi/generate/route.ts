import {generateText} from 'ai'
import {google} from "@ai-sdk/google"
import { getRandomInterviewCover } from '@/constants/utils';
import { db } from '@/firebase/admin';

export async function GET() {
    return Response.json({ success: true, message: 'Hello from Vapi' }, {
        status: 200,
    });
}

// export async function POST(request: Request) {
//     const {type,role,level,techstack,amount,userid}= await request.json();
//     try{
//         const {text:questions}= await generateText({
//             model:google('gemini-2.0.flash-001'),
//             prompt: `Prepare questions for a job interview.
//             The job role is ${role}.
//             The job experience level is ${level}.
//             The tech stack used in the job is: ${techstack}.
//             The focus between behavioural and technical questions should lean towards: ${type}.
//             The amount of questions required is: ${amount}.
//             Please return only the questions, without any additional text.
//             The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//             Return the questions formatted like this:
//             ["Question 1", "Question 2", "Question 3"]
            
//             Thank you! <3
//         `,
//         })

//         const interview = {
//             role,
//             level,
//             type,
//             techstack:techstack.split(','),
//             questions:JSON.parse(questions),
//             userId:userid,
//             finalized:true,
//             coverImage:getRandomInterviewCover(),
//             crearedAt:new Date().toISOString(),
//         }

//         await db.collection('interviews').add(interview);

//         return Response.json({ success: true, message: 'Interview created successfully' }, {
//             status: 200,
//         })


//     }catch(e){
//         console.log(e);
//         return Response.json({ success: false, message: 'Something went wrong' }, {
//             status: 500,
//         });
//     }
// }



import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();
    
    try {
        // Correct model name and initialization
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" // Updated model name
        });

        const prompt = `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]`;

        // Generate content with proper method
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const questions = JSON.parse(response.text());

        const interview = {
            role,
            level,
            type,
            techstack: techstack.split(','),
            questions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection('interviews').add(interview);

        return Response.json({ 
            success: true, 
            message: 'Interview created successfully' 
        }, { status: 200 });

    } catch (e) {
        console.error('API Error:', e);
        return Response.json({ 
            success: false, 
            message: 'Failed to generate interview questions',
            error: e instanceof Error ? e.message : 'Unknown error'
        }, { status: 500 });
    }
}