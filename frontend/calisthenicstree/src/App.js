import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Registration from './pages/Registration';

function App() {
  return (
    <div className="App">
      {/* Toggle between <Login /> or <Registration /> to see them */}
      <Registration />
    </div>
  );
}

export default App;