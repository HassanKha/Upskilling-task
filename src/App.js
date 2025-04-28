import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setshowEditForm] = useState(false);
  const [Contacts, setContacts] = useState([]);
  const [EditedUserID, setEditedUserID] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const contactsPerPage = 2; // Number of contacts per page
  // const totalPages = Math.ceil(Contacts.length / contactsPerPage);

  const toggleAddForm = () => setShowAddForm(!showAddForm);

  const toggleEditForm = (id) => {
    setEditedUserID(id);
    setshowEditForm(!showEditForm);
  };



  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://dummyapi.io/data/v1/user", {
        headers: {
          "app-id": "64fc4a747b1786417e354f31", // replace this with your real app-id
        },
      });
      setContacts(response.data.data);
      console.log(Contacts, response.data.data); // response.data.data is the array of users
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
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`https://dummyapi.io/data/v1/user/${id}`, {
        headers: {
          "app-id": "64fc4a747b1786417e354f31", // replace this with your real app-id
        },
      });

      console.log( response.data.data);
      await fetchUsers(); // response.data.data is the array of users
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
    }finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

 

  const filteredContacts = Contacts.filter((contact) =>
    (contact.firstName + " " + contact.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );


  useEffect(() => {
    const newTotalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredContacts, currentPage]);

  return (
    <div className="bg-[url('/public/Background.jpg')] bg-cover flex justify-center items-center bg-center h-screen">
      <div
        className={`relative w-full max-w-5xl ${
          !showAddForm && !showEditForm ? "px-20" : ""
        }  border-[1px] !border-white shadow-lg shadow-black/25 mx-auto overflow-hidden rounded-3xl`}
      >
        {/* Content container */}
        <div
          className={`relative z-10   ${
            !showAddForm && !showEditForm ? "p-6 max-sm:p-2 max-sm:py-12" : ""
          } w-full  min-h-[520px] flex flex-col`}
        >
          {/* Search bar - full width */}
          {loading && (
    <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  )}
{error && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
    {error}
  </div>
)}
          {showEditForm && (
            <UpdateUser
              fetchUsers={fetchUsers}
              toggleEditForm={toggleEditForm}
              EditedUserID={EditedUserID}
            />
          )}
          {showAddForm && (
            <CreateUser fetchUsers={fetchUsers} toggleAddForm={toggleAddForm} />
          )}
          {!showAddForm && !showEditForm && (
            <>
              <div className="w-full  mb-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => {
                      setCurrentPage(1); // reset to page 1 when searching
                      setSearchTerm(e.target.value);
                    }}
                    className="w-full pl-4 text-lg max-md:text-md max-sm:text-sm max-[320px]:text-[12px] pr-10 py-3 h-10 rounded-full bg-white border-0 text-black outline-none"
                  />
                </div>
              </div>

              {/* Add New Contact button - positioned at right */}
              <div className="flex justify-end max-sm:justify-center  mb-8">
                <button
                  onClick={toggleAddForm}
                  className="flex items-center max-sm:justify-center text-lg max-md:text-md max-sm:!flex-col max-[320px]:text-[12px] max-sm:text-sm bg-[#1BB0F0] hover:bg-blue-600 text-white rounded-full max-[320px]:px-2 max-[320px]:py-2 px-6 py-3"
                >
                  {/* <Plus className="mr-2 h-5 w-5" /> */}
                  <img src="/plus.png" alt="plus" className="mr-2 h-5 w-5 max-sm:h-3 max-sm:w-3" />
                  Add New Contact
                </button>
              </div>

              {/* Contact List */}
              <div className="flex-1  pr-2">
                {currentContacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className={`flex items-center max-sm:gap-2 max-sm:flex-col justify-between py-6 ${
                      index < currentContacts.length - 1
                        ? "border-b border-white/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-16 w-16 max-md:h-14  max-md:w-14 max-[320px]:h-10 max-[320px]:w-10 max-sm:h-12 max-sm:w-12  rounded-full overflow-hidden border-2 border-white">
                        <img
                          src={contact.picture || "https://www.w3schools.com/howto/img_avatar.png"}
                          alt={contact.firstName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl max-[320px]:text-[12px] max-md:text-md max-sm:text-sm font-medium text-white">
                          {contact.firstName + " " + contact.lastName}
                        </h3>
                        <p className="text-white/80">{contact.email}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEditForm(contact)}
                        className="h-10 w-10 hover:bg-slate-200 max-md:h-7 max-md:w-7 rounded-md bg-white text-blue-500 border-0 flex items-center justify-center"
                      >
                        <img src="/edit.png" alt="edit" className="h-5 w-5 max-md:h-3 max-md:w-3" />
                      </button>
                      <button    onClick={() => deleteUser(contact.id)} className="h-10 w-10 hover:bg-slate-200 max-md:h-7 max-md:w-7 rounded-md bg-white text-red-500 border-0 flex items-center justify-center">
                        <img src="/del.png" alt="del" className="h-5 w-5 max-md:h-3 max-md:w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - positioned at bottom right */}
              <div className="flex items-center max-sm:justify-center justify-end mt-6">
                <button
                  className="h-10 w-6 cursor-pointer  text-white border-0 mr-1 flex items-center justify-center"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <img src="/left.png" alt="left" className="h-4 w-3" />
                </button>

                <span className="text-white mx-2">
                  {currentPage}/{totalPages}
                </span>

                <button
                  className="h-10 w-6 cursor-pointer  text-white border-0 ml-1 flex items-center justify-center"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <img src="/right.png" alt="right" className="h-4 w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
