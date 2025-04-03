import { getRandomInterviewCover } from '@/constants/utils';
import { getInterviewsDetailsById } from '@/lib/actions/other.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import DisplayTech from '@/components/DisplayTech';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';


const page = async ({params}:RouteParams) => {
  const {id} = await params;
  const interview = await getInterviewsDetailsById(id);
  if(!interview) redirect('/');
    const user = await getCurrentUser();
  
  
    return (
    <>
    <div className='felx flex-row gap-4 justify-between '>
        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
            <div className='flex flex-row gap-4 items-center'>
                <Image src={getRandomInterviewCover()}  alt="interviewCover" width={40} height={40} className='rounded-full object-cover size-[40px]'/>
                <h3 className='capitalize'>{interview.role} Interview </h3>

            </div>
            <DisplayTech techStack={interview.techstack}/>
        </div>

        <p className='bg-dark-200 rounded-lg h-fit capitalize px-4 py-2'>{interview.type}</p>
    </div>
    <Agent userName={user?.name} userId={user?.id} type='interview' interviewId={id} questions={interview.questions}/>
    </>
  )
}

export default page