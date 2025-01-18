import React, { useState, useEffect } from 'react';
import './UserDasboard.css'; 

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskImage, setTaskImage] = useState(null);
  const [activePage, setActivePage] = useState('userProfile');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activePage === 'userProfile') {
      fetch('http://127.0.0.1:1234/application/user_service/view_user_profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          try {
            if (data.status_code === 200) {
              setUserProfile(data.data);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        })
        .catch((error) => console.error('Error fetching user profile:', error));
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'taskAssigned') {
      fetch('http://127.0.0.1:1234/application/user_service/view_task/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status_code === 200) {
            setTasks(data.data);
          }
        })
        .catch((error) => console.error('Error fetching tasks:', error));
    }
  }, [activePage]);

  const handleTaskUpdate = (taskId, appId) => {
    const formData = new FormData();
    
    // Append task_id, app_id, and the screenshot to the form data
    formData.append('task_id', taskId);  // task_id as int
    formData.append('app_id', appId);    // app_id as app_id
    formData.append('upload_screenshot', taskImage);  // file (image)
  
    // Send the form data to the update task API endpoint
    fetch('http://127.0.0.1:1234/application/user_service/task_by_user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Make sure the token is correct
      },
      body: formData, // Send the FormData as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          alert('Task updated successfully!');
        } else {
          alert('Failed to update task.');
        }
      })
      .catch((error) => console.error('Error updating task:', error));
  };
  

  const handleImageChange = (e) => {
    setTaskImage(e.target.files[0]);
  };

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        <button onClick={() => setActivePage('userProfile')}>User Profile</button>
        <button onClick={() => setActivePage('taskAssigned')}>Task Assigned</button>
        <button onClick={() => setActivePage('updateTask')}>Update Task</button>
      </div>

      <div className="main-content">
        {activePage === 'userProfile' && userProfile && (
          <div>
            <h2>User Profile</h2>
            <p><strong>Username:</strong> {userProfile.username}</p>
            <p><strong>First Name:</strong> {userProfile.first_name}</p>
            <p><strong>Last Name:</strong> {userProfile.last_name}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
          </div>
        )}

        {activePage === 'taskAssigned' && tasks.length > 0 && (
          <div>
            <h2>Assigned Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.task_id}>
                  <p>Task ID: {task.task_id}</p>
                  <p>App ID: {task.app}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

{activePage === 'updateTask' && (
  <div>
    <h2>Update Task</h2>
    <select 
      onChange={(e) => {
        const [taskId, appId] = e.target.value.split(',');  // Split the value into taskId and appId
        setSelectedTask({
          task_id:taskId,
          app_id:appId
        });
        console.log('Selected Task:', { taskId, appId }); // Log both task_id and app_id
      }}
    >
      
      <option value="">Select Task</option>
      {tasks.map((task) => (
        <option key={task.task_id} value={`${task.task_id},${task.app}`}>
          {`Task ID: ${task.task_id} - App ID: ${task.app}`}
        </option>
      ))}
    </select>

    <input type="file" onChange={handleImageChange} />
    <button
      disabled={!selectedTask || !taskImage}
      onClick={() => {
        const selected = tasks.find((t) => t.task_id === selectedTask);
        console.log('Selected Task ID:', selectedTask.task_id); // Log selected task ID
        if (selectedTask) {
          // Use selected.task_id and selected.app to update the task
          handleTaskUpdate(selectedTask.task_id, selectedTask.app_id);
        } else {
          console.error('Selected task not found');
        }
      }}
    >
      Update Task
    </button>
  </div>
)}




      </div>
    </div>
  );
};

export default UserDashboard;
