import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function UpdateUser({fetchUsers, toggleEditForm , EditedUserID }) {
    const [previewImage, setPreviewImage] = useState(EditedUserID.picture || "https://www.w3schools.com/howto/img_avatar.png");
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      phone: "",
      email: ""
    });
      const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
     const [loading, setLoading] = useState(false);
  
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result); // Base64 string
          };
          reader.readAsDataURL(file);
        }
      };

    useEffect(() => {
        if (EditedUserID) {
          setFormData({
            firstName: EditedUserID.firstName || "",
            lastName: EditedUserID.lastName || "",
            phone: EditedUserID.phone || "",
            email: EditedUserID.email || ""
          });
          setPreviewImage(EditedUserID.picture || "https://www.w3schools.com/howto/img_avatar.png");
        }
      }, [EditedUserID]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = async () => {
        console.log(formData , previewImage,'formData')
      try {
        setLoading(true);
        const response = await axios.put(
          `https://dummyapi.io/data/v1/user/${EditedUserID.id}`,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            picture: previewImage || EditedUserID.picture || "https://www.w3schools.com/howto/img_avatar.png",
          },
          {
            headers: {
                "app-id": "64fc4a747b1786417e354f31", 
              "Content-Type": "application/json"
            }
          }
        );
        console.log("User edited:", response.data);
        fetchUsers(); // Fetch updated user list after creation
        toggleEditForm(null); // Close the form after successful submission
      } catch (error) {
        console.error("Error:", error);

        if (error.response) {
          const responseData = error.response.data;
          if (responseData.data) {
            // If there are field-specific errors (like email)
            const firstFieldError = Object.values(responseData.data)[0];
            setError(firstFieldError || "An unknown error occurred.");
          } else if (responseData.error) {
            // Otherwise, just show the general error
            setError(responseData.error);
          } else {
            setError("An unknown error occurred.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false); // always stop loading
      }
    };

  return (
    <div className=" bg-white w-full flex justify-between flex-col px-5 py-10 min-h-[520px] ">
        {error && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
    {error}
  </div>
)}
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-24 h-24 mb-2">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={previewImage || "https://www.w3schools.com/howto/img_avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 text-white"
        >
          <img src="/camera.png" alt="cam" className=" h-4 w-4" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <p className="text-gray-700">Upload Photo</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <input
         type="text"
         name="firstName"
         placeholder="First Name"
         value={formData.firstName}
         onChange={handleInputChange}
         className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0"
 
      />
      <input
       type="text"
       name="lastName"
       placeholder="Last Name"
       value={formData.lastName}
       onChange={handleInputChange}
       className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0"
      />
      <input
     type="tel"
     name="phone"
     placeholder="Phone Number"
     value={formData.phone}
     onChange={handleInputChange}
     className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0"
      />
    </div>

    <div className="flex justify-between">
      <button
        onClick={()=>toggleEditForm(null)}
        className="px-[4rem] py-3 rounded-full bg-[#D9D9D9] text-gray-800"
      >
        Cancel
      </button>
      <button       onClick={handleSubmit} className="px-[4rem] py-3  rounded-full bg-[#1BB0F0] text-white">
      {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
  )
}

export default UpdateUser