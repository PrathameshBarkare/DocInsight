import FileUpload from "./FileUpload";
import ChatSection from "./ChatSection";
import { useState } from "react";
import Login from "./Login";

function MainLayout() {
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-[400px]">
        <FileUpload
          selectedDocumentId={selectedDocumentId}
          setSelectedDocumentId={setSelectedDocumentId}
        />
      </div>

      <div className="flex-1">
        <ChatSection selectedDocumentId={selectedDocumentId} />
      </div>
    </div>
  );
}

export default MainLayout;
