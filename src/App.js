import React, { useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3000'; // Replace with your backend's URL if different.

function App() {
  const [invoices, setInvoices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [consumerName, setConsumerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInvoices = async (filter, name) => {
    if (['consumerUnpaid', 'consumerOverdue', 'consumerAll', 'consumerTotal'].includes(filter) && !name) {
      alert('Please provide a consumer name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let response;
      switch (filter) {
        case 'consumerUnpaid':
          response = await axios.get(`${baseURL}/TarbijaMaksmataArved/${name}`);
          break;
        case 'consumerOverdue':
          response = await axios.get(`${baseURL}/TarbijaMaksetahtaegUletatud/${name}`);
          break;
        case 'consumerAll':
          response = await axios.get(`${baseURL}/TarbijaArved/${name}`);
          break;
        case 'consumerTotal':
          response = await axios.get(`${baseURL}/TarbijaArveteSumma/${name}`);
          setTotalAmount(response.data);
          return;
        default:
          response = await axios.get(`${baseURL}/MaksmataArved`); // Default to unpaid invoices
      }

      setInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to fetch invoices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    appContainer: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f4f4f4',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#333',
      fontSize: '24px',
      marginBottom: '20px',
    },
    inputContainer: {
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      marginRight: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    buttonDisabled: {
      padding: '10px 15px',
      backgroundColor: '#cccccc',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed',
      marginRight: '10px',
    },
    errorMessage: {
      color: 'red',
      fontWeight: 'bold',
    },
    invoicesList: {
      listStyleType: 'none',
      paddingLeft: '0',
    },
    invoiceItem: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    totalAmount: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="App" style={styles.appContainer}>
      <h1 style={styles.header}>Invoice Management</h1>

      {/* Consumer Name Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Consumer Name"
          value={consumerName}
          onChange={(e) => setConsumerName(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={() => fetchInvoices('consumerUnpaid', consumerName)}
          style={consumerName ? styles.button : styles.buttonDisabled}
          disabled={!consumerName}
        >
          Fetch Consumer's Unpaid Invoices
        </button>
        <button
          onClick={() => fetchInvoices('consumerOverdue', consumerName)}
          style={consumerName ? styles.button : styles.buttonDisabled}
          disabled={!consumerName}
        >
          Fetch Consumer's Overdue Invoices
        </button>
        <button
          onClick={() => fetchInvoices('consumerAll', consumerName)}
          style={consumerName ? styles.button : styles.buttonDisabled}
          disabled={!consumerName}
        >
          Fetch Consumer's All Invoices
        </button>
        <button
          onClick={() => fetchInvoices('consumerTotal', consumerName)}
          style={consumerName ? styles.button : styles.buttonDisabled}
          disabled={!consumerName}
        >
          Fetch Consumer's Total Invoice Amount
        </button>
      </div>

      {/* General Actions */}
      <div>
        <button onClick={() => fetchInvoices('unpaid')} style={styles.button}>
          Fetch All Unpaid Invoices
        </button>
        <button onClick={() => fetchInvoices('overdue')} style={styles.button}>
          Fetch All Overdue Invoices
        </button>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}

      {/* Total Amount */}
      {totalAmount > 0 && (
        <p style={styles.totalAmount}>
          <strong>Total Amount for {consumerName}:</strong> {totalAmount} €
        </p>
      )}

      {/* Invoice List */}
      {invoices.length > 0 ? (
        <div>
          <h2>Invoices</h2>
          <ul style={styles.invoicesList}>
            {invoices.map((invoice, index) => (
              <li key={index} style={styles.invoiceItem}>
                <strong>Date:</strong> {invoice._date ? new Date(invoice._date).toLocaleDateString() : "N/A"} <br />
                <strong>Consumption:</strong> {invoice._consumption ?? "N/A"} kWh <br />
                <strong>Amount:</strong> {invoice._amount ?? "N/A"} € <br />
                <strong>Paid Amount:</strong> {invoice._paymentStatus?._paidAmount ?? "N/A"} € <br />
                <strong>Due Date:</strong>{" "}
                {invoice._paymentStatus?._dueDate
                  ? new Date(invoice._paymentStatus._dueDate).toLocaleDateString()
                  : "N/A"}{" "}
                <br />
                <strong>Payment Status:</strong> {invoice._paymentStatus?._paymentStatus ? "Paid" : "Unpaid"} <br />
                <strong>Consumer Name:</strong> {invoice._consumer?._name ?? "N/A"} <br />
                <strong>Phone:</strong> {invoice._consumer?._contactInfo?._phoneNumber ?? "N/A"} <br />
                <strong>Email:</strong> {invoice._consumer?._contactInfo?._email ?? "N/A"} <br />
                <strong>Address:</strong>{" "}
                {`${invoice._consumer?._location?._street ?? "N/A"}, ${invoice._consumer?._location?._house ?? "N/A"}, ${
                  invoice._consumer?._location?._city ?? "N/A"
                }, ${invoice._consumer?._location?._postalCode ?? "N/A"}`} <br />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>No invoices to display.</p>
      )}
    </div>
  );
}

export default App;
