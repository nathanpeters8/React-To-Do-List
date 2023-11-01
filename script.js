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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // runs after component has loaded
  componentDidMount() {
    // fetch tasks from API
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

  handleChange(event) {
    this.setState({ new_task: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { new_task, tasks } = this.state;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h2 className='mb-3'>To Do List</h2>
            {tasks.length > 0 ? (
              tasks.map((task) => {
                // render each task
                return <Task key={task.id} task={task}/>
              })
            ) : (
              <p>No tasks here</p>
            )}
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
