import React, { useState } from 'react'

function MainLayout() {

  const[file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if(selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
    else {
      alert('Please select a PDF file');
      e.target.value = "";
    }
  }
  
  return (
    <div className='flex w-full h-full'>
      <div className='px-36 pt-6 h-full border border-gray-300 text-2xl font-bold'>
        DocInsight
      </div>
      <div>
        Upload
        <input 
          type="file"
          accept=".pdf" 
          className='border p-2 rounded w-full'
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default MainLayout