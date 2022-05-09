import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Routes, Route} from "react-router-dom";
import Index from "./components/sites/Index";


//main component
//should load user data, if such exists
//if there are no data, reroute to login


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    componentDidMount() {
        //get url, pass data
    }

    render() {
        return (
            <Router>
                <nav className="app__navbar">
                </nav>
                <Routes>
                    <Route path="/" exact element={<Index />}/>
                </Routes>
            </Router>
        );
    }
}