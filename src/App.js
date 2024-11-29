import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [arved, setArved] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (searchValue === '') {
      fetch('http://localhost:3000/MaksmataArved')
        .then((response) => response.json())
        .then((data) => setArved(data));
    }
  }, [searchValue]);

  useEffect(() => {
    fetch('http://localhost:3000/MaksetahtaegUletatud')
      .then((response) => response.json())
      .then((data) => setArved(data));
  }, []);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Maksmata arved</h1>
      <select style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}>
        <option value="all">All Maksmata</option>
        <option> Ületähtaja</option>
        <option>Maksmata </option>
      </select>
      <input type="text" placeholder="Search by consumer name" style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }} onChange={handleSearch} />

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            {['Date', 'Consumption', 'Amount', 'Payment Status', 'Due Date', 'Paid Amount', 'Payment Date', 'Consumer Name', 'Phone Number', 'Email', 'Street', 'House', 'City', 'Postal Code'].map(header => (
              <th key={header} style={{ padding: '12px 15px', backgroundColor: '#4CAF50', color: 'white', textAlign: 'left' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arved.map((arve, index) => (
            <tr key={arve._date} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px 15px' }}>{arve._date}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumption}</td>
              <td style={{ padding: '12px 15px' }}>{arve._amount}</td>
              <td style={{ padding: '12px 15px' }}>{arve._paymentStatus._paymentStatus ? 'Paid' : 'Unpaid'}</td>
              <td style={{ padding: '12px 15px' }}>{arve._paymentStatus._dueDate}</td>
              <td style={{ padding: '12px 15px' }}>{arve._paymentStatus._paidAmount}</td>
              <td style={{ padding: '12px 15px' }}>{arve._paymentStatus._paymentDate}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._name}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._contactInfo._phoneNumber}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._contactInfo._email}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._location._street}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._location._house}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._location._city}</td>
              <td style={{ padding: '12px 15px' }}>{arve._consumer._location._postalCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
