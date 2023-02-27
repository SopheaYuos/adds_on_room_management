import React from "react";

class State extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            count: 0
        }
    }
    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={() => this.setState({ count: this.state.count + 2 })}>
                    Click me
                </button>
            </div>
        );
    }
}
export default State;