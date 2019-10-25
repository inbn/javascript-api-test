import React from "react";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomBrew: ""
    };
  }

  componentDidMount = () => {};

  onGetRandomBrew = e => {
    e.preventDefault();
    axios.get(`https://api.punkapi.com/v2/beers/random`).then(response => {
      console.log("get random brew response:", response);
      if (response && response.data && response.data[0]) {
        this.setState({ randomBrew: response.data[0].name });
      }
    });
  };

  render = () => {
    const { randomBrew } = this.state;
    return (
      <section>
        <form onSubmit={this.onGetRandomBrew}>
          <input type="submit" value="Get Random Brew" />
        </form>
        {randomBrew !== "" && <p>Random Brew: {randomBrew}</p>}
      </section>
    );
  };
}

export default App;
