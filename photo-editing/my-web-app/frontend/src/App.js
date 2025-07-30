import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const applyFilter = async (filterType) => {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("filter", filterType);

    try {
      const response = await axios.post("http://localhost:8000/edit", formData, {
        responseType: "blob",
      });
      setEditedImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600">Next-Gen AI Photo Editing</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} className="my-4" />
      
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => applyFilter("brightness")}>Brightness</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => applyFilter("contrast")}>Contrast</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => applyFilter("remove_bg")}>Remove Background</button>
      </div>

      {editedImage && <img src={editedImage} alt="Edited" className="mt-4 w-96" />}
    </div>
  );
}

export default App;
