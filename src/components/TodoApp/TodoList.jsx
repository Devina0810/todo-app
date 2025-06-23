import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaPen, FaArrowUp, FaArrowDown, FaCheck, FaList, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';
import TaskModal from './TaskModal'; // NEW: Import TaskModal

export default function TodoList({ onLogout }) {
  // State management
  const [state, setState] = useState({
    lists: [],
    currentListId: null
  });

  // Modal states
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false); // NEW: Task modal state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // NEW: Profile dropdown state
  const [currentTask, setCurrentTask] = useState(null); // NEW: Track task being edited
  const [modalData, setModalData] = useState({
    listName: '',
    listId: '',
    confirmAction: null,
    confirmMessage: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('oliveGroveTodo');
    if (savedData) {
      setState(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('oliveGroveTodo', JSON.stringify(state));
  }, [state]);

  // Helper function to update state
  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // List operations
  const createNewList = (e) => {
    e.preventDefault();
    if (!modalData.listName.trim()) return;

    const newList = {
      id: Date.now().toString(),
      name: modalData.listName,
      tasks: []
    };

    updateState({
      lists: [...state.lists, newList],
      currentListId: newList.id
    });

    setModalData({ ...modalData, listName: '' });
    setShowNewListModal(false);
  };

  const updateList = (e) => {
    e.preventDefault();
    if (!modalData.listName.trim()) return;

    updateState({
      lists: state.lists.map(list => 
        list.id === modalData.listId ? { ...list, name: modalData.listName } : list
      )
    });

    setShowEditListModal(false);
  };

  const deleteList = (listId) => {
    updateState({
      lists: state.lists.filter(list => list.id !== listId),
      currentListId: state.currentListId === listId ? null : state.currentListId
    });
    setShowConfirmModal(false);
  };

  // NEW: Combined task save handler (replaces addNewTask)
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Update existing task
      updateState({
        lists: state.lists.map(list => 
          list.id === state.currentListId
            ? {
                ...list,
                tasks: list.tasks.map(task =>
                  task.id === taskData.id 
                    ? { ...task, text: taskData.text, completed: taskData.completed }
                    : task
                )
              }
            : list
        )
      });
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        text: taskData.text,
        completed: taskData.completed
      };
      
      updateState({
        lists: state.lists.map(list => 
          list.id === state.currentListId 
            ? { ...list, tasks: [...list.tasks, newTask] } 
            : list
        )
      });
    }
  };

  const toggleTaskComplete = (taskId) => {
    updateState({
      lists: state.lists.map(list => 
        list.id === state.currentListId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : list
      )
    });
  };

  const deleteTask = (taskId) => {
    updateState({
      lists: state.lists.map(list => 
        list.id === state.currentListId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      )
    });
    setShowConfirmModal(false);
  };

  const moveTask = (taskId, direction) => {
    updateState({
      lists: state.lists.map(list => {
        if (list.id !== state.currentListId) return list;
        
        const taskIndex = list.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return list;
        
        const newTasks = [...list.tasks];
        const newIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;
        
        if (newIndex >= 0 && newIndex < newTasks.length) {
          [newTasks[taskIndex], newTasks[newIndex]] = 
            [newTasks[newIndex], newTasks[taskIndex]];
        }
        
        return { ...list, tasks: newTasks };
      })
    });
  };

  // Modal handlers
  const showListModal = (listId = null) => {
    if (listId) {
      const list = state.lists.find(l => l.id === listId);
      setModalData({
        ...modalData,
        listName: list.name,
        listId: list.id
      });
      setShowEditListModal(true);
    } else {
      setShowNewListModal(true);
    }
  };

  const showDeleteConfirmation = (message, action) => {
    setModalData({
      ...modalData,
      confirmMessage: message,
      confirmAction: action
    });
    setShowConfirmModal(true);
  };

  // NEW: Handle logout confirmation
  const handleLogout = () => {
    showDeleteConfirmation(
      'Are you sure you want to logout? Your data will remain saved.',
      onLogout
    );
  };

  // Current list data
  const currentList = state.lists.find(list => list.id === state.currentListId);
  const pendingTasks = currentList?.tasks.filter(task => !task.completed).length || 0;

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">Task Trackr</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => showListModal()}
              className="bg-olive-600 hover:bg-olive-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaPlus className="mr-2" /> New List
            </button>
            
            {/* Profile Section with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-olive-600"
                />
                <span className="hidden md:block text-gray-700 font-medium">
                  {userData.name || userData.username || 'User'}
                </span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {userData.name || userData.username || 'User'}
                      </p>
                      {userData.email && (
                        <p className="text-xs text-gray-500">{userData.email}</p>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Click outside to close dropdown */}
        {showProfileDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileDropdown(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lists Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-olive-800 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Your Lists</h2>
              <span className="bg-olive-600 text-xs px-2 py-1 rounded-full">
                {state.lists.length}
              </span>
            </div>
            <div className="h-96 overflow-y-auto p-2">
              {state.lists.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FaList className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p>No lists yet. Create one!</p>
                </div>
              ) : (
                state.lists.map(list => {
                  const listPendingTasks = list.tasks.filter(task => !task.completed).length;
                  const isActive = state.currentListId === list.id;
                  
                  return (
                    <div 
                      key={list.id}
                      className={`list-item mb-2 rounded-lg transition-colors cursor-pointer ${
                        isActive ? 'bg-olive-100 border-l-4 border-olive-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => updateState({ currentListId: list.id })}
                    >
                      <div className="flex justify-between items-center p-3">
                        <div className="flex items-center">
                          <img 
                            src={`https://img.icons8.com/ios-filled/24/${
                              listPendingTasks > 0 ? '6e7f41' : 'a3a3a3'
                            }/list.png`} 
                            alt="List" 
                            className="w-5 h-5 mr-3"
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">{list.name}</h3>
                            <p className="text-xs text-gray-500">
                              {listPendingTasks} pending task{listPendingTasks !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="list-actions opacity-0 flex space-x-1 transition-opacity">
                          <button 
                            className="edit-list p-1 text-gray-400 hover:text-olive-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              showListModal(list.id);
                            }}
                          >
                            <FaPen className="text-xs" />
                          </button>
                          <button 
                            className="delete-list p-1 text-gray-400 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              showDeleteConfirmation(
                                'Are you sure you want to delete this list and all its tasks?',
                                () => deleteList(list.id)
                              );
                            }}
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Tasks Main Area */}
          <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md overflow-hidden">
            {!currentList ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-6">
                <img 
                  src="https://img.icons8.com/fluency/96/000000/task-completed.png" 
                  alt="Empty" 
                  className="w-24 h-24 mb-4 opacity-50"
                />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No list selected
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a list from the sidebar or create a new one to get started.
                </p>
                <button 
                  onClick={() => showListModal()}
                  className="bg-olive-600 hover:bg-olive-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FaPlus className="mr-2" /> Create New List
                </button>
              </div>
            ) : (
              <>
                <div className="bg-olive-800 text-white px-4 py-3 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg">{currentList.name}</h2>
                    <p className="text-xs opacity-80">
                      {pendingTasks} of {currentList.tasks.length} task{currentList.tasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-olive-200 hover:text-white transition-colors"
                      onClick={() => showDeleteConfirmation(
                        'Are you sure you want to delete this list and all its tasks?',
                        () => deleteList(currentList.id)
                      )}
                    >
                      <FaTrash />
                    </button>
                    <button 
                      className="p-2 text-olive-200 hover:text-white transition-colors"
                      onClick={() => showListModal(currentList.id)}
                    >
                      <FaPen />
                    </button>
                  </div>
                </div>
                
                {/* CHANGED: Replaced form with Add Task button */}
                <div className="p-4 border-b">
                  <button
                    onClick={() => {
                      setCurrentTask(null);
                      setShowTaskModal(true);
                    }}
                    className="w-full bg-olive-600 hover:bg-olive-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaPlus className="mr-2" /> Add New Task
                  </button>
                </div>
                
                <div className="h-96 overflow-y-auto p-2">
                  {currentList.tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <img 
                        src="https://img.icons8.com/fluency/96/000000/task-completed.png" 
                        alt="Empty" 
                        className="w-16 h-16 mx-auto mb-2 opacity-30"
                      />
                      <p>No tasks in this list yet.</p>
                    </div>
                  ) : (
                    currentList.tasks.map((task, index) => (
                      <div 
                        key={task.id}
                        className="task-item animate-fade-in mb-2 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center">
                          <button 
                            className={`toggle-complete mr-3 w-6 h-6 rounded-full border-2 ${
                              task.completed 
                                ? 'border-olive-600 bg-olive-600 text-white' 
                                : 'border-gray-300'
                            }`}
                            onClick={() => toggleTaskComplete(task.id)}
                            title={task.completed ? 'Mark as pending' : 'Mark as complete'}
                          >
                            {task.completed && <FaCheck className="text-xs" />}
                          </button>
                          <div className={`flex-1 ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                          }`}>
                            {task.text}
                          </div>
                          <div className="task-actions opacity-0 flex space-x-2 transition-opacity">
                            {/* ADDED: Edit button */}
                            <button
                              className="p-1 text-gray-400 hover:text-olive-600"
                              onClick={() => {
                                setCurrentTask(task);
                                setShowTaskModal(true);
                              }}
                              title="Edit"
                            >
                              <FaPen className="text-xs" />
                            </button>
                            <button 
                              className={`move-up p-1 text-gray-400 hover:text-olive-600 ${
                                index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => moveTask(task.id, 'up')}
                              disabled={index === 0}
                              title="Move up"
                            >
                              <FaArrowUp className="text-xs" />
                            </button>
                            <button 
                              className={`move-down p-1 text-gray-400 hover:text-olive-600 ${
                                index === currentList.tasks.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => moveTask(task.id, 'down')}
                              disabled={index === currentList.tasks.length - 1}
                              title="Move down"
                            >
                              <FaArrowDown className="text-xs" />
                            </button>
                            <button 
                              className="delete-task p-1 text-gray-400 hover:text-red-600"
                              onClick={() => showDeleteConfirmation(
                                'Are you sure you want to delete this task?',
                                () => deleteTask(task.id)
                              )}
                              title="Delete"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NEW: Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        currentTask={currentTask}
      />

      {/* Existing Modals (unchanged) */}
      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="bg-olive-800 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold text-lg">Create New List</h3>
              <button 
                onClick={() => setShowNewListModal(false)}
                className="text-white hover:text-olive-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={createNewList}>
                <div className="mb-4">
                  <label htmlFor="listName" className="block text-gray-700 mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    id="listName"
                    value={modalData.listName}
                    onChange={(e) => setModalData({ ...modalData, listName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowNewListModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {showEditListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="bg-olive-800 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold text-lg">Edit List</h3>
              <button 
                onClick={() => setShowEditListModal(false)}
                className="text-white hover:text-olive-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={updateList}>
                <div className="mb-4">
                  <label htmlFor="editListName" className="block text-gray-700 mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    id="editListName"
                    value={modalData.listName}
                    onChange={(e) => setModalData({ ...modalData, listName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowEditListModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="bg-olive-800 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold text-lg">Confirm Action</h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-white hover:text-olive-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <p className="mb-6 text-gray-700">{modalData.confirmMessage}</p>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    modalData.confirmAction();
                    setShowConfirmModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}