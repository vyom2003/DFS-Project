import React, {useState} from 'react';
import axios from 'axios';

export const Test = () => {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  return (
    <div className="App">
      <form onSubmit={e=> e.preventDefault()}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </form>
    </div>
  );
}