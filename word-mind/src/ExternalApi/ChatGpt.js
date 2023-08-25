import React, { useState } from 'react';
import axios from 'axios';


function ChatGpt() {

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  };

  const [userInput, setUserInput] = useState({
    system: '',
    user: '',
    assistant: '',
    prompt: '',
    model: 'gpt-3.5-turbo-16k',
  });

  console.log(userInput)
  const [assistantResponse, setAssistantResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserInput = (e) => {
    console.log('e.target',e.target.value);
    setUserInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendUserInput = async () => {
    setLoading(true);

    const data = {
      model: userInput.model,
      messages: [
        {
          role: 'system',
          content: 
          // userInput.system
          'You are an AI language model trained to assist recruiters in refining job posts. Please provide Enticing content, language, and information in the job posts. Number of words in the response should be equal to or more than the job post that a recruiter is giving to you. you strictly have to follow the same persona given to you. also you have to follow the job post that recruiter will give you. you will make it more enticing and follow the persona of Lou Adler'
             },
        {
          role: 'user',
          content: 
          userInput.user 
          // 'When rewriting the job description, use a language model acting as a recruitment expert or consultant. In this context, take on the persona of Lou Adler. Your role is to be enticing with the reader and emphasize the benefits and opportunities associated with the job position, while presenting the information in an enticing manner.'
            },
        {
          role: 'assistant',
          content:
            // userInput.assistant 
            'You are an AI assistant trained to help recruiters refine their job posts. You can provide suggestions, make the language more enticing, and ensure all necessary information is included. If any details are missing or ambiguous, please ask for more information to provide the best possible suggestions. Take your time to answer the best.'
             },
        {
          role: 'user',
          content:
            userInput.prompt 
            },
      ],
      temperature: 0.2
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data,
        { headers }
      );
      const { choices } = response.data;
      const assistantResponse = choices[0].message.content;
      setLoading(false);
      setAssistantResponse(assistantResponse);
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };

  const formatAssistantResponse = (response) => {
    const paragraphs = response.split('\n\n');

    const formattedResponse = paragraphs.map((paragraph, index) => (
      <p key={index} className="text-left mb-4">
        {paragraph}
      </p>
    ));

    return formattedResponse;
  };

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-4">Chat :</h1>
    {loading ? (
      <>
        <h1 className="spinner">hi</h1>
      </>
    ) : (
      <>
        <div className="bg-gray-100 p-4 mb-4">
          {formatAssistantResponse(assistantResponse)}
        </div>
      </>
    )}

    <section className='m-6'>
      
    <div className="mb-4 ">
      <label className="block mb-2">
        Model:
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full"
          name="model"
          value={userInput.model}
          onChange={handleUserInput}
        >
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
          <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
          <option value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</option>
          {/* <option value="text-davinci-003">text-davinci-003</option> */}
        </select>
      </label>
    </div>
    <div className="mb-4">
      {/* <label className="block mb-2">
        System Role:
        <textarea
           className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          rows={4}
          name="system"
          value={userInput.system}
          onChange={handleUserInput}
        />
      </label> */}
    </div>
    <div className="mb-4">
<label className="block mb-2">
  User Role:
  <textarea
     className="border border-gray-300 rounded px-4 py-2 w-full"
    rows={4}
    name="user"
    value={userInput.user}
    onChange={handleUserInput}
  />
</label>
</div>

    <div className="mb-4">
      {/* <label className="block mb-2">
        Assistant Role:
        <textarea
      
     
        className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          rows={4}
          name="assistant"
          value={userInput.assistant}
          
          onChange={handleUserInput}
        />
      </label> */}
    </div>
    <div className="mb-4">
      <label className="block mb-2">
        Prompt:
        <textarea
          className="border border-gray-300 rounded px-4 py-2 w-full"
          name='prompt'
          type="text"
          rows={4}
        onChange={handleUserInput}
        />
      </label>
    </div>
   
    </section>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      onClick={sendUserInput}
    >
      Send
    </button>
  </div>
  );
}

export default ChatGpt;