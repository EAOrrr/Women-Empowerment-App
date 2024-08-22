import userService from '../services/user'

const HomePage = () => {
  const handleClick = () => {
    console.log('You clicked the button!')
    const getInfo = async () => {
      try {
        const user = await userService.getInfo()
        console.log(user)
      } catch (error) {
        console.error('Failed to get user info', error)
        console.error(error.response.status, error.response.data) 
      }
    }
    getInfo()
  }
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the home page.</p>
      <button onClick={handleClick}>
        Click me!
      </button>
    </div>
  );
}

export default HomePage;