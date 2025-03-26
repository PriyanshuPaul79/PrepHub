import React from 'react'
import dayjs from 'dayjs'
import { getRandomInterviewCover } from '@/constants/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DisplayTech from './DisplayTech';


// import { getFeedbackByInterviewId } from '@/lib/actions/feedback.actions';

const InterviewCard = async ({ id,
    userId,
    role,
    type,
    techstack,
    level,
    timeCreated }: InterviewCardProps) => {

    const feedback = null as Feedback | null;
    // if teh user have mixed technical  with beahviuoral then do this 

    const normalise = /mix/gi.test(type) ? 'Mixed' : type;

    const formattedDate = dayjs(feedback?.timeCreated || timeCreated || Date.now()).format('DD/MM/YYYY');

    const badge = {
        Behavioral: 'ng-light-400',
        Mixed: "bg-light-600",
        Technical: "bg-light-800",
    }
    [normalise] || "bg-light-600";

    return (
        <div className='card-border w-[410px] max-sm:w-full min-h-96'>
            <div className='card-interview'>
                <div>
                    <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                        <p className='badge-text'>{normalise}</p>
                    </div>
                    <Image src={getRandomInterviewCover()} alt='interview cover' width={90} height={90} className='rounded-full object-fit size-[90px]' />

                    <h3 className='mt-5 capitalize'>
                        {role} Interview
                    </h3>

                    <div className='flex flex-row gap-5 mt-3'>
                        <div className='flex flex-row gap-2'>
                            <Image src='/calendar.svg' alt='calender' width={20} height={20} />
                            <p>{formattedDate}</p>
                        </div>

                        <div className='flex flex-row gap-2 items-center'>
                            <Image src='/star.svg' alt='star' height={22} width={22} />
                            <p>{feedback?.totalScore || '---'}/100</p>
                        </div>
                    </div>

                    <p className='line-clamp-2 mt-5'>{feedback?.finalAssessment || 'You have not taken this interview yet'}</p>
                </div>

                <div className='flex flex-row justify-between'    >
                    <DisplayTech techStack={techstack} />                <Button className='btn-primary'>
                        <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                            {feedback ? 'Check Feedback' : 'View Interview'}</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
// here 

export default InterviewCard;