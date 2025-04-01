import { cn } from '@/constants/utils';
import { spawn } from 'child_process';
import { Span } from 'next/dist/trace';
import Image from 'next/image'
import React from 'react'


enum callStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps) => {
    const isSpeaking = true;
    const currentCallStatus: callStatus = callStatus.CONNECTING;
    const transcript = [
        'Hello myself Priyanshu'
    ]
    const last = transcript[transcript.length-1]
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
            {transcript.length>0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={last} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')} >
                        {last}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {currentCallStatus !== callStatus.ACTIVE ? (
                    <button className="relative btn-call">
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                currentCallStatus !== callStatus.INACTIVE && "hidden"
                            )}
                        />
                        {currentCallStatus === callStatus.INACTIVE || currentCallStatus === callStatus.FINISHED
                            ? "Start Call"
                            : "Connecting..."}
                    </button>
                ) : (
                    <button className="btn-disconnect">END CALL</button>
                )}
        </div >
        </>
    )
}

export default Agent