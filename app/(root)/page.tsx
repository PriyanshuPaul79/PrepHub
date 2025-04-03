import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser, getInterviewsByUserId } from '@/lib/actions/auth.action';

const page = async () => {

  const user = await getCurrentUser();
  const userInterviews = await getInterviewsByUserId(user?.id!);
  const pastInterviews = userInterviews?.length > 0 ;


  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg '>
          <h2>Where Practice Meets Perfection!</h2>
          <p className='text-lg'>Your Virtual Interview Playground.</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robo" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interview Hub</h2>

        <div className='interviews-section'>
          {dummyInterviews.map((interview) =>(
            <InterviewCard {...interview} key={interview.id}/>
          ))}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2> Lets take an interview </h2>

        <div className='interviews-section'>
        {
          pastInterviews ? (
            userInterviews?.map((interview) =>(
              <InterviewCard {...interview} key={interview.id}/>
            ))) : (
              <p> No Interviews yet </p>
            )
        }
        </div>
      </section>

    </>
  )
}

export default page