import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "./Loader";
import api from "../services/api";

function FileUpload({selectedDocumentId, setSelectedDocumentId}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getUploadedFiles = async () => {
    try {
      const response = await api.get("/files");
      setUploadedFiles(response.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  useEffect(() => {
    getUploadedFiles();
  }, []);

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;

    const fileId = Date.now();
    const fileObject = {
      _id: fileId,
      originalFileName: selectedFile.name,
      status: "uploading",
    };

    setUploadedFiles((prev) => [...prev, fileObject]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      const document = response.data.document;

      setUploadedFiles((prev) =>
        prev.map((item) =>
          item._id === fileId
            ? {
                ...item,
                _id: document._id,
                originalFileName: document.originalFileName,
                status: document.status,
              }
            : item,
        ),
      );
    } catch (error) {
      alert("Upload failed");

      setUploadedFiles((prev) => prev.filter((item) => item._id !== fileId));
    }
  };

  useEffect(() => {
    const hasProcessingFiles = uploadedFiles.some(
      (file) => file.status !== "ready" && file.status !== "failed",
    );

    if (!hasProcessingFiles) return;

    const interval = setInterval(() => {
      getUploadedFiles();
    }, 5000);

    return () => clearInterval(interval);
  }, [uploadedFiles]);

  const deleteFile = async (_id) => {
    try {
      await api.delete(`/delete/${_id}`);
      await getUploadedFiles();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    noClick: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        handleUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`relative shadow-md w-full h-full text-white border transition-colors ${
        isDragActive ? "border-gray-400 bg-[#1a1a1a]" : "border-gray-700"
      }`}
    >
      <input {...getInputProps()} />

      <div className="px-6 pt-4 text-lg font-normal mb-4">Sources</div>

      <hr className="w-full border-gray-700 mb-5" />

      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(file);
            e.target.value = "";
          }
        }}
      />

      <div className="px-6 flex items-center gap-3">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full border border-gray-600 bg-[#212121] text-white text-sm font-medium
          cursor-pointer
          hover:bg-[#333333] transition-colors"
        >
          <AddIcon fontSize="small" />
          Add sources
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-10">
          {uploadedFiles.map((item) => (
            <div
              key={item._id}
              className="p-2 flex items-center gap-3 mx-6 rounded-lg hover:bg-[#333333] transition-colors"
            >
              <input
                type="checkbox"
                className="h-4 w-4 mr-2 cursor-pointer"
                checked={selectedDocumentId === item._id}
                onChange={(e) => {
                  const documentId = e.target.checked ? item._id : "";
                  setSelectedDocumentId(documentId);
                }}
              />

              <PdfIcon sx={{ fontSize: 28 }} />

              <span
                className="ml-2 text-white text-base font-medium truncate min-w-0"
                title={item.originalFileName}
              >
                {item.originalFileName}
              </span>

              <button
                onClick={() => deleteFile(item._id)}
                disabled={item.status !== "ready" && item.status !== "failed"}
                className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="flex items-center justify-center">
                  {item.status !== "ready" && item.status !== "failed" ? (
                    <Loader size={20} />
                  ) : (
                    <DeleteIcon sx={{ fontSize: 23 }} />
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {isDragActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded pointer-events-none gap-3">
          <DescriptionIcon sx={{ fontSize: 50 }} />

          <p className="text-white text-base font-medium">
            Drop files here to add to chat
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
