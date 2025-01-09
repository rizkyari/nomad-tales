import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Dashboard = () => {
    const authState = useSelector((state: RootState) => state.auth);

  // Define a function to log the auth state
  const check = () => {
    console.log(authState); // Log the auth state
  };
    return (
        <>
            <div>ini adalah dashboard</div>
            <button onClick={()=> check()}>test</button>
        </>
    )
}

export default Dashboard;