    import './App.css';
    import React,{ useState } from 'react';
    import { BrowserRouter} from 'react-router-dom';
    import RouterCustom from "./router";
    import "react-toastify/dist/ReactToastify.css";


    function App() {

        return (
            <div className="App">
                <BrowserRouter>
                    <RouterCustom/>
                </BrowserRouter>
            </div>


        );
    }

    export default App;