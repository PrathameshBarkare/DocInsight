import React, { useState } from 'react'
import FileUpload from './FileUpload';

function MainLayout() {
  
  return (
    <div className='flex w-full h-full'>
      <div className='px-36 pt-6 h-full border border-gray-300 text-2xl font-bold'>
        DocInsight
      </div>
      <div>
        <FileUpload />
      </div>
    </div>
  )
}

export default MainLayout;