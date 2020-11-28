import logo from './logo.svg';
import './App.css';
import PaginationComp from './pagination';
import Home from './Home';
import {Router, Route} from 'react-router-dom'
import history from "./history";

function App() {

  return (
    <div className="App">

      <Router history={history}>
        <Route path='/' exact strict render={() => {
          return <Home />;
        }}>
        </Route>
        <Route path='/beers' exact strict render={() => {
          return <PaginationComp />
        }}>
        </Route>

      </Router>

      
    </div>
  );
}

export default App;
