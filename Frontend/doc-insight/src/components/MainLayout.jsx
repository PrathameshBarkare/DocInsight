import FileUpload from "./FileUpload";
import ChatSection from "./ChatSection";
import { useEffect, useState } from "react";
import Login from "./Login";
import api from "../services/api";

function MainLayout() {
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("user");
      setIsCheckingSession(false);
      return () => {
        isMounted = false;
      };
    }

    api.get("/auth/me")
      .then(({ data }) => {
        if (!isMounted) return;
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        if (!isMounted) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking your session...
      </div>
    );
  }

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
        <ChatSection selectedDocumentId={selectedDocumentId} onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default MainLayout;
