const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error('Request either 404 or 500');
};

const json = (response) => response.json();

// Task component renders an individual task fetched from API
class Task extends React.Component {
  render() {
    const { task, onDelete, onComplete } = this.props;
    const { id, content, completed } = task;
    return (
      <div className='row mb-1'>
        <p className='col'>{content}</p>
        <button onClick={() => onDelete(id)}>Delete</button>
        <input
          className='d-inline-block mt-2'
          type='checkbox'
          onChange={() => onComplete(id, completed)}
          checked={completed}
        />
      </div>
    );
  }
}

// To Do List component stores basic layout of web page and input event listeners
class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_task: '',
      tasks: [],
      filter: 'all',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  // fetch the tasks from the API
  fetchTasks() {
    fetch('https://fewd-todolist-api.onrender.com/tasks?api_key=317')
      .then(checkStatus)
      .then(json)
      .then((response) => {
        console.log(response);
        this.setState({ tasks: response.tasks });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  deleteTask(id) {
    // early return if no id supplied
    if (!id) {
      return;
    }

    // make request to delete task
    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=317`, {
      method: 'DELETE',
      mode: 'cors',
    })
      .then(checkStatus) //check request status
      .then(json) // process response data
      .then((data) => {
        // if request successful
        this.fetchTasks();
        console.log(id);
      })
      .catch((error) => {
        // if error thrown
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  toggleComplete(id, completed) {
    // early return if no id
    if (!id) {
      return;
    }
    // set state of task
    const newState = completed ? 'active' : 'complete';

    // request to mark task as completed or active
    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}/mark_${newState}?api_key=317`, {
      method: 'PUT',
      mode: 'cors',
    })
      .then(checkStatus) //check request status
      .then(json) // process response data
      .then((data) => {
        // if request successful
        this.fetchTasks();
        console.log(id);
      })
      .catch((error) => {
        // if error thrown
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  toggleFilter(event) {
    console.log(event.target.name);
    this.setState({ filter: event.target.name });
  }

  // runs after component has loaded
  componentDidMount() {
    // fetch tasks from API
    this.fetchTasks();
  }

  handleChange(event) {
    this.setState({ new_task: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // get new task from component state
    let { new_task } = this.state;
    new_task = new_task.trim();
    // early return if input element is empty
    if (!new_task) {
      return;
    }
    // post new task into API
    fetch('https://fewd-todolist-api.onrender.com/tasks?api_key=317', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: {
          content: new_task,
        },
      }),
    })
      .then(checkStatus) //check request status
      .then(json) // process response data
      .then((data) => {
        // if request successful
        this.setState({ new_task: '' });
        this.fetchTasks();
      })
      .catch((error) => {
        // if error thrown
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  render() {
    const { new_task, tasks, filter } = this.state;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h2 className='mb-3'>To Do List</h2>
            {tasks.length > 0 ? (
              tasks
                .filter((task) => {
                  // filter results if any filter inputs are activated
                  if (filter === 'all') {
                    return true;
                  } else if (filter === 'active') {
                    return !task.completed;
                  } else {
                    return task.completed;
                  }
                })
                .map((task) => {
                  // render each task on DOM
                  return <Task key={task.id} task={task} onDelete={this.deleteTask} onComplete={this.toggleComplete} />;
                })
            ) : (
              <p>No tasks here</p>
            )}
            {/* task filter elements */}
            <div className='mt-3'>
              <label className='ml-3'>
                <input type='checkbox' name='all' checked={filter === 'all'} onChange={this.toggleFilter} /> All
              </label>
              <label className='ml-3'>
                <input type='checkbox' name='active' checked={filter === 'active'} onChange={this.toggleFilter} />{' '}
                Active
              </label>
              <label className='ml-3'>
                <input type='checkbox' name='completed' checked={filter === 'completed'} onChange={this.toggleFilter} />{' '}
                Completed
              </label>
            </div>
            {/* form to add to task */}
            <form onSubmit={this.handleSubmit} className='form-inline my-4'>
              <input
                type='text'
                className='form-control mr-sm-2 mb-2'
                placeholder='New Task'
                value={new_task}
                onChange={this.handleChange}
              />
              <button type='submit' className='btn btn-primary mb-2'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<ToDoList />);
