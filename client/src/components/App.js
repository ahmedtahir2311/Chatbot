import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import Course from './course/Course';
import Chatbot from './chatbot/Chatbot';


const App = () => (
    <div>
        <BrowserRouter>
            <div>
                <Header/>
                <Route exact path= "/" component= {Landing} />
                <Route exact path= "/about" component= {About} />
                <Route exact path= "/course" component= {Course} />
                
                <Chatbot/>
                <Footer/>
            </div>
        </BrowserRouter>
    </div>
    )

export default App;