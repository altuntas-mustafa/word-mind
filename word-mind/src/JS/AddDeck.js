import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { setUser } from '../redux/reducers/user';
import Popup from './Popup';
import { handleSubmit } from './createDeckAndLanguage';
import { UserInfo } from './UserInfo'; // Import the user utility function

const AddDeck = () => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const user = useSelector((state) => state.user); // Access user info from Redux store

  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deckInfo, setDeckInfo] = useState({
    deckName: '',
    language: '',
    cards: [
      { front: '', back: '' },
      { front: '', back: '' },
    ],
  });

  const [selectedOption, setSelectedOption] = useState('manual');
  const [uploadedFile, setUploadedFile] = useState(null);


  useEffect(() => {
    // Define an async function
    async function fetchUserInfoAsync() {
      await UserInfo(dispatch); // Await the UserInfo function
    }
  
    // Call the async function
    fetchUserInfoAsync();
  }, [dispatch]);

  const handleCardChange = (index, field, value) => {
    const newCards = [...deckInfo.cards];
    newCards[index][field] = value;
    setDeckInfo({ ...deckInfo, cards: newCards });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      setDeckInfo({
        deckName: jsonData.deckName || "",
        language: jsonData.language || "",
        cards: jsonData.cards || [],
      });
      setUploadedFile(file);
      setSelectedOption("manual");
    };
    reader.readAsText(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    handleSubmit(
      deckInfo,
      user,
      setIsErrorPopupVisible,
      setIsSuccessPopupVisible,
      setErrorMessage,
      setDeckInfo
    );
  };
  

  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-6 bg-gray-100 rounded-lg shadow-md h-screen">
        <h2 className="text-2xl font-semibold mb-4">Create New Deck</h2>
        <nav className="flex space-x-4">
          <div
            className={`py-2 px-4 rounded ${
              selectedOption === "manual"
                ? "bg-blue-500 text-white"
                : "bg-white"
            } cursor-pointer`}
            onClick={() => setSelectedOption("manual")}
          >
            Manual Input
          </div>
          <div
            className={`py-2 px-4 rounded ${
              selectedOption === "upload"
                ? "bg-blue-500 text-white"
                : "bg-white"
            } cursor-pointer`}
            onClick={() => setSelectedOption("upload")}
          >
            Upload JSON File
          </div>
        </nav>
        <form className="w-full max-w-md" onSubmit={handleFormSubmit}>
          {selectedOption === "upload" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Upload JSON File:
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          {(selectedOption === "manual" || uploadedFile) && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Deck Name:
                </label>
                <input
                  type="text"
                  value={deckInfo.deckName}
                  onChange={(e) =>
                    setDeckInfo({ ...deckInfo, deckName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Language:
                </label>
                <input
                  type="text"
                  value={deckInfo.language}
                  onChange={(e) =>
                    setDeckInfo({ ...deckInfo, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-4">
                {deckInfo.cards.map((card, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Front:
                      </label>
                      <input
                        type="text"
                        value={card.front}
                        onChange={(e) =>
                          handleCardChange(index, "front", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Back:
                      </label>
                      <input
                        type="text"
                        value={card.back}
                        onChange={(e) =>
                          handleCardChange(index, "back", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setDeckInfo({
                      ...deckInfo,
                      cards: [...deckInfo.cards, { front: "", back: "" }],
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Card
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Create Deck
                </button>
              </div>
            </div>
          )}
        </form>
         {/* Success Popup */}
      <Popup
        isVisible={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        type="success"
        message="Deck and cards created successfully!"
      />
      
     {/* Error Popup */}
     <Popup
        isVisible={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        type="error"
        message={errorMessage}
      />
      </div>
    </>
  );
};

export default AddDeck;