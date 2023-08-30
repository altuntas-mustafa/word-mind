// deckFunctions.js
export const handleCardChange = (deckInfo, index, field, value) => {
    const newCards = [...deckInfo.cards];
    newCards[index][field] = value;
    return { ...deckInfo, cards: newCards };
  };
  
  export const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        resolve({
          deckName: jsonData.deckName || "",
          language: jsonData.language || "",
          cards: jsonData.cards || [],
        });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };
  