import React, { useState } from "react";
import FileUpload from "./FileUpload";
import ChatSection from "./ChatSection";

function MainLayout() {
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  return (
    <div className="flex h-screen bg-black">
      <div className="w-[400px]">
        <FileUpload
          selectedDocumentId={selectedDocumentId}
          setSelectedDocumentId={setSelectedDocumentId}
        />
      </div>

      <div className="flex-1">
        <ChatSection
          selectedDocumentId={selectedDocumentId}
        />
      </div>
    </div>
  );
}

export default MainLayout;
