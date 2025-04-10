'use client'
import { cn } from '@/lib/utils';
import { spawn } from 'child_process';
import { Span } from 'next/dist/trace';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';


// all the differnt values of call status 
enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName,
    userId,
    type }: AgentProps) => {
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    // initially call is inactive 
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [message, setMessage] = useState<SavedMessage[]>([]);
    const[lastMessage, setLastMessage] = useState<string>("");


    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        }
        const onCallFinish = () => {
            setCallStatus(CallStatus.FINISHED);
        }
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript };
                // add the new message in the list using spread 
                setMessage((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => {
            setIsSpeaking(true);
        };
        const onSpeechEnd = () => {
            setIsSpeaking(false);
        };

        const onError = (e:Error)=> console.log('Error',e);

        // these are vapi event listeners 
        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallFinish);
        vapi.on('message',onMessage);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);
        vapi.on('error',onError);


        return () => {
            // when not using close the listeners so that its doesnt slow our application  
            vapi.off('call-start',onCallStart);
            vapi.off('call-end',onCallFinish);
            vapi.off('message',onMessage);
            vapi.off('speech-start',onSpeechStart);
            vapi.off('speech-end',onSpeechEnd);
            vapi.off('error',onError);
        }

    }, [])


    useEffect(() => {

        // if(message.length>0) setLastMessage(message[message.length - 1]?.content);
        // if(callStatus === CallStatus.FINISHED){
        //     if(type === 'generate') router.push('/');
        // }

      if(callStatus === CallStatus.FINISHED) router.push('/');

    },[message,callStatus,type,userId]);
    // whenever the message callastatus type and userid changes trigger this useEffect 


    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        // try{
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
            variableValues: {
                username : userName,
                userid:userId,
            },
        
        });
    // } catch (e) {
    //     console.error('Call failed:', e);
    //     setCallStatus(CallStatus.INACTIVE);
    // }
}


    const disconnectCall = async()=>{
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const latestMessage = message[message.length - 1]?.content;
    const callInactive = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/inter.png' alt='interview cover' width={120} height={130} className='object-cover rounded-full' />
                        {isSpeaking && <span className='animate-speak'></span>}
                    </div>
                    <h3>AI INTERVIEWER</h3>
                </div>

                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user.png' height={60} width={60} alt='user' className='rounded-full object-cover size-[120px]' />
                        {/* {isSpeaking && <span className='animate-speak'></span>}  */}
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {message.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')} >
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== 'CONNECTING' && "hidden"
                            )}
                        />
                        <span>{callInactive ? 'Call' : '....'}</span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={disconnectCall}>END CALL</button>
                )}
            </div >
        </>
    )
}

export default Agent

