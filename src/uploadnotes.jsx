import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

function UploadEducationalContent({ academyId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState(''); // State for notes
  const [companyId, setCompanyId] = useState(''); // State to hold the Company_Id

  useEffect(() => {
    fetch('info.json')
      .then((response) => response.json())
      .then((data) => {
        setCompanyId(data[0].Company_Id); // Set Company_Id from JSON
      })
      .catch((error) => console.error('Error fetching user info:', error));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('notes', notes); // Include notes in the form data
    formData.append('companyId', companyId); // Include companyId in the form data

    // Debugging logs
    console.log('Form Data:', {
      title,
      description,
      notes,
      companyId,
      file: file ? file.name : 'No file'
    });

    try {
      const response = await fetch('http://localhost:3000/api/upload-educational-content', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success("Content uploaded successfully!");
        setTitle('');
        setDescription('');
        setNotes(''); // Clear notes
        setFile(null);
        document.querySelector('input[type="file"]').value = ''; // Clear the file input
      } else {
        toast.error("Failed to upload content");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Upload Educational Content</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...styles.input, ...styles.textarea }}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes for the PDF"
            style={{ ...styles.input, ...styles.textarea }}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            style={styles.input}
          />
        </div>
        <input
          type="text"
          value={companyId}
          readOnly
          style={{ ...styles.input, backgroundColor: '#e9ecef', position: 'absolute', left: '-9999px' }} // Hide visually
        />
        <button type="submit" style={styles.button}>Upload</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    minHeight: '100px',
    resize: 'vertical',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default UploadEducationalContent;
