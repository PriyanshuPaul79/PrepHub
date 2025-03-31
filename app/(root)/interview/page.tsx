import React from 'react'
import Agent from '@/components/Agent'
const page = () => {
  return (
    <>
    <h2>Interview Generation</h2>
    <Agent userName="user" userID='userid' type='generate' />
    </>
  )
}

export default page