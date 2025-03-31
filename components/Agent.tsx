import { cn } from '@/constants/utils';
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
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
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