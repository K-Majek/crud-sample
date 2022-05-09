import axios from "axios";
import React, { Component } from "react";
import UserContext from "./UserContext";

class AuthHOC extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            authorised: false
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            axios("/api/getAuth")
                .then(({data}) => {
                this.setState({...data});
                })
                .catch(error => {console.log("404 auth")});
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        <UserContext.Provider value={this.state}>
            {this.props.children}
        </UserContext.Provider>
    }
}

export default AuthHOC;