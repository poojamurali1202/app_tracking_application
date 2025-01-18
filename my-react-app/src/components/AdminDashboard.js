// import React, { useState, useEffect, useCallback } from 'react';
// import './AdminDashboard.css';

// const AdminDashboard = () => {
//   const [activePage, setActivePage] = useState('Apps'); // Default page is "Apps"
//   const [data, setData] = useState(null); // State to store fetched data
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [formData, setFormData] = useState({
//     app_name: '',
//     app_link: '',
//     app_category: '',
//     app_subcategory: '',
//     app_points: '',
//     image: null,
//   }); // Form data for Create App
//   const [selectedApp, setSelectedApp] = useState('');
// const [selectedUser, setSelectedUser] = useState('');

//   // Helper function to get the token
//   const getToken = () => localStorage.getItem('token');

//   // Reusable fetch function with token
//   const fetchData = useCallback(async (apiUrl) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`, // Adding token for authentication
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch data');
//       const result = await response.json();
//       setData(result); // Update the data state
//     } catch (error) {
//       setError(error.message); // Update error state
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }, []);

//   // Effect to fetch data for the default "Apps" page on mount or active page change
//   useEffect(() => {
//     if (activePage === 'Apps') {
//       fetchData('http://127.0.0.1:1234/application/admin_service/view_apps/');
//     } else if (activePage === 'Users') {
//       fetchData('http://127.0.0.1:1234/application/admin_service/view_users/');
//     }
//   }, [activePage, fetchData]);

//   // Function to handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: files[0], // For file inputs
//       }));
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value, // For text inputs
//       }));
//     }
//   };

//   // Function to handle form submission for create task
//   const taskFormSubmit = async (e) => {
//     e.preventDefault();

//     // Fetch Apps data when form is submitted
//     try {
//       const appsResponse = await fetch('http://127.0.0.1:1234/application/admin_service/view_apps/');
//       const appsData = await appsResponse.json();
//       setApps(appsData.data);

//       const usersResponse = await fetch('http://127.0.0.1:1234/application/admin_service/view_users/');
//       const usersData = await usersResponse.json();
//       setUsers(usersData.data);
//     } catch (error) {
//       setError('Failed to fetch data.');
//       return;
//     }

//     // Ensure both app and user are selected
//     if (!selectedApp || !selectedUser) {
//       alert('Please select an app and a user.');
//       return;
//     }

//     const payload = {
//       app_id: selectedApp,
//       user_id: selectedUser,
//     };

//     setLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:1234/application/admin_service/create_task/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error('Failed to create task');
//       const result = await response.json();
//       alert('Task created successfully!');
//     } catch (error) {
//       setError(error.message);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle form submission for Create App
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const apiUrl = 'http://127.0.0.1:1234/application/admin_service/create_app/';
//     const multipartData = new FormData();

//     // Append form data
//     for (const key in formData) {
//       multipartData.append(key, formData[key]);
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: multipartData,
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to create app');
//       const result = await response.json();
//       alert('App created successfully!');
//       setActivePage('Apps'); // Redirect to Apps after successful creation
//     } catch (error) {
//       alert(error.message); // Show error message
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   // UI for loading, error, and data display
//   const renderContent = () => {
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;
  
//     if (activePage === 'Apps') {
//       const apps = data?.data; // Access the 'data' array inside the Apps response
//       return (
//         <div>
//           {apps && Array.isArray(apps) && apps.length > 0 ? (
//             apps.map((app, index) => (
//               <div key={index} className="app-item">
//                 <h3>{app.app_name}</h3>
//                   <img 
//                     src={`${process.env.PUBLIC_URL}${app.app_logo}`}
//                     alt={app.app_name} 
//                     style={{ width: '200px', height: 'auto' }} 
//                   />
//                 <p>App Name: {app.app_name}</p>
//                 <p>Points: {app.app_points}</p>
//               </div>
//             ))
//           ) : (
//             <p>No apps available.</p>
//           )}
//         </div>
//       );
//     }
  
//     if (activePage === 'Users') {
//       const users = data?.data; // Access the 'data' array inside the Users response
//       return (
//         <div>
//           {users && Array.isArray(users) && users.length > 0 ? (
//             users.map((user, index) => (
//               <div key={index} className="user-item">
//                 <p>
//                   <strong>User ID:</strong> {user.user_id}   <strong>Full Name:</strong> {user.first_name} {user.last_name}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p>No users available.</p>
//           )}
//         </div>
//       );
//     }
  
//     return <p>Feature coming soon!</p>;
//   };
  

//   return (
//     <div className="admin-dashboard-container">
//       <div className="side-nav">
//         <nav className="navigation-pages">
//           <a
//             href="#"
//             onClick={() => setActivePage('Create App')}
//             className={activePage === 'Create App' ? 'active' : ''}
//           >
//             Create App
//           </a>
//           <a
//             href="#"
//             onClick={() => setActivePage('Apps')}
//             className={activePage === 'Apps' ? 'active' : ''}
//           >
//             Apps
//           </a>
//           <a
//             href="#"
//             onClick={() => setActivePage('Users')}
//             className={activePage === 'Users' ? 'active' : ''}
//           >
//             Users
//           </a>
//           <a
//           href="#"
//           onClick={() => setActivePage('Create Task')}
//           className={activePage === 'Create Task' ? 'active' : ''}
//         >
//           Create Task
//         </a>
//         </nav>
//       </div>
//       <div className="content-container">
//   <h1>{activePage}</h1>
//   {activePage === 'Apps' || activePage === 'Users' ? renderContent() : activePage === 'Create App' ? (
//     <form onSubmit={handleFormSubmit} className="create-app-form">
//       <input
//         type="text"
//         name="app_name"
//         placeholder="App Name"
//         value={formData.app_name}
//         onChange={handleInputChange}
//         required
//       />
//       <input
//         type="text"
//         name="app_link"
//         placeholder="App Link"
//         value={formData.app_link}
//         onChange={handleInputChange}
//         required
//       />
//       <input
//         type="text"
//         name="app_category"
//         placeholder="App Category"
//         value={formData.app_category}
//         onChange={handleInputChange}
//         required
//       />
//       <input
//         type="text"
//         name="app_subcategory"
//         placeholder="App Subcategory"
//         value={formData.app_subcategory}
//         onChange={handleInputChange}
//         required
//       />
//       <input
//         type="number"
//         name="app_points"
//         placeholder="App Points"
//         value={formData.app_points}
//         onChange={handleInputChange}
//         required
//       />
//       <input
//         type="file"
//         name="image"
//         accept="image/*"
//         onChange={handleInputChange}
//         required
//       />
//       <button type="submit" disabled={loading}>Create App</button>
//     </form>
//   ) : activePage === 'Create Task' ? (
//     <form onSubmit={taskFormSubmit} className="create-task-form">
//       <label htmlFor="selectApp">Select App</label>
//       <select
//         id="selectApp"
//         value={selectedApp}
//         onChange={(e) => setSelectedApp(e.target.value)}
//         required
//       >
//         <option value="">Select an app</option>
//         {apps && apps.map((app) => (
//           <option key={app.app_id} value={app.app_id}>
//             {app.app_name}
//           </option>
//         ))}
//       </select>

//       <label htmlFor="selectUser">Select User</label>
//       <select
//         id="selectUser"
//         value={selectedUser}
//         onChange={(e) => setSelectedUser(e.target.value)}
//         required
//       >
//         <option value="">Select a user</option>
//         {users && users.map((user) => (
//           <option key={user.user_id} value={user.user_id}>
//             {user.first_name} {user.last_name}
//           </option>
//         ))}
//       </select>

//       <button type="submit" disabled={loading}>Create Task</button>
//     </form>
//   ) : (
//     <p>Feature coming soon!</p>
//   )}
// </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('Apps'); // Default page is "Apps"
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [formData, setFormData] = useState({
    app_name: '',
    app_link: '',
    app_category: '',
    app_subcategory: '',
    app_points: '',
    image: null,
  }); // Form data for Create App
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [apps, setApps] = useState([]); // State for Apps
  const [users, setUsers] = useState([]); // State for Users

  // Helper function to get the token
  const getToken = () => localStorage.getItem('token');

  // Reusable fetch function with token
  const fetchData = useCallback(async (apiUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Adding token for authentication
        },
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result); // Update the data state
    } catch (error) {
      setError(error.message); // Update error state
    } finally {
      setLoading(false); // Reset loading state
    }
  }, []);

  // Effect to fetch data for the default "Apps" page on mount or active page change
  useEffect(() => {
    if (activePage === 'Apps') {
      fetchData('http://127.0.0.1:1234/application/admin_service/view_apps/');
    } else if (activePage === 'Users') {
      fetchData('http://127.0.0.1:1234/application/admin_service/view_users/');
    }
  }, [activePage, fetchData]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0], // For file inputs
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // For text inputs
      }));
    }
  };

  // Function to handle form submission for create task
  const taskFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure both app and user are selected
    if (!selectedApp || !selectedUser) {
      alert('Please select an app and a user.');
      return;
    }

    const payload = {
      app_id: selectedApp,
      user_id: selectedUser,
    };

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:1234/application/admin_service/create_task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create task');
      const result = await response.json();
      alert('Task created successfully!');
    } catch (error) {
      setError(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission for Create App
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = 'http://127.0.0.1:1234/application/admin_service/create_app/';
    const multipartData = new FormData();

    // Append form data
    for (const key in formData) {
      multipartData.append(key, formData[key]);
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: multipartData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Failed to create app');
      const result = await response.json();
      alert('App created successfully!');
      setActivePage('Apps'); // Redirect to Apps after successful creation
    } catch (error) {
      alert(error.message); // Show error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // UI for loading, error, and data display
  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    if (activePage === 'Apps') {
      const apps = data?.data; // Access the 'data' array inside the Apps response
      return (
        <div>
          {apps && Array.isArray(apps) && apps.length > 0 ? (
            apps.map((app, index) => (
              <div key={index} className="app-item">
                <h3>{app.app_name}</h3>
                  <img 
                    src={`${process.env.PUBLIC_URL}${app.app_logo}`}
                    alt={app.app_name} 
                    style={{ width: '200px', height: 'auto' }} 
                  />
                <p>App Name: {app.app_name}</p>
                <p>Points: {app.app_points}</p>
              </div>
            ))
          ) : (
            <p>No apps available.</p>
          )}
        </div>
      );
    }
  
    if (activePage === 'Users') {
      const users = data?.data; // Access the 'data' array inside the Users response
      return (
        <div>
          {users && Array.isArray(users) && users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className="user-item">
                <p>
                  <strong>User ID:</strong> {user.user_id}   <strong>Full Name:</strong> {user.first_name} {user.last_name}
                </p>
              </div>
            ))
          ) : (
            <p>No users available.</p>
          )}
        </div>
      );
    }
  
    return <p>Feature coming soon!</p>;
  };
  

  return (
    <div className="admin-dashboard-container">
      <div className="side-nav">
        <nav className="navigation-pages">
          <a
            href="#"
            onClick={() => setActivePage('Create App')}
            className={activePage === 'Create App' ? 'active' : ''}
          >
            Create App
          </a>
          <a
            href="#"
            onClick={() => setActivePage('Apps')}
            className={activePage === 'Apps' ? 'active' : ''}
          >
            Apps
          </a>
          <a
            href="#"
            onClick={() => setActivePage('Users')}
            className={activePage === 'Users' ? 'active' : ''}
          >
            Users
          </a>
          <a
          href="#"
          onClick={() => setActivePage('Create Task')}
          className={activePage === 'Create Task' ? 'active' : ''}>
            Create Task
          </a>
        </nav>
      </div>
      <div className="content-container">
        <h1>{activePage}</h1>
        {activePage === 'Apps' || activePage === 'Users' ? renderContent() : activePage === 'Create App' ? (
          <form onSubmit={handleFormSubmit} className="create-app-form">
            <input
              type="text"
              name="app_name"
              placeholder="App Name"
              value={formData.app_name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="app_link"
              placeholder="App Link"
              value={formData.app_link}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="app_category"
              placeholder="App Category"
              value={formData.app_category}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="app_subcategory"
              placeholder="App Subcategory"
              value={formData.app_subcategory}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="app_points"
              placeholder="App Points"
              value={formData.app_points}
              onChange={handleInputChange}
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              required
            />
            <button type="submit" disabled={loading}>Create App</button>
          </form>
        ) : activePage === 'Create Task' ? (
          <form onSubmit={taskFormSubmit} className="create-task-form">
            <select
  value={selectedApp}
  onChange={(e) => setSelectedApp(e.target.value)}
  required
>
  <option value="">Select App</option>
  {apps && apps.length > 0 ? (
    apps.map((app) => (
      <option key={app.app_id} value={app.app_id}>{app.app_name}</option>
    ))
  ) : (
    <option value="">No apps available</option>
  )}
</select>

<select
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
  required
>
  <option value="">Select User</option>
  {users && users.length > 0 ? (
    users.map((user) => (
      <option key={user.user_id} value={user.user_id}>{user.first_name} {user.last_name}</option>
    ))
  ) : (
    <option value="">No users available</option>
  )}
</select>

            <button type="submit" disabled={loading}>Create Task</button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
