/**
 * @ Router, alert 각종설정
 */
import Home from './Home';
import App from './Wardle';
import Join from './components/join/Join';
import Header from './components/layout/Header';
import { AlertProvider } from './context/AlertContext';
import './index.css';
import WagmiProvider from './wagmi/Provider';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <WagmiProvider>
      <AlertProvider>
        <div className='w-screen flex justify-center h-screen bg-black'>
          <div
            className='flex flex-col 
        justify-center bg-slate-400 w-80 h-full relative'
          >
            <Header />
            <Routes>
              <Route path='/playgrounds' element={<App />} />
              <Route path='/' element={<Home />} />
              <Route path='/Join' element={<Join />} />
            </Routes>
          </div>
        </div>
      </AlertProvider>
    </WagmiProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
