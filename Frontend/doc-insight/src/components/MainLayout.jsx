import React, { useState } from "react";
import FileUpload from "./FileUpload";
import ChatSection from "./ChatSection";

function MainLayout() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-[400px]">
        <FileUpload />
      </div>
      
      <div className="flex-1">
        <ChatSection />
      </div>
    </div>
  );
}

export default MainLayout;