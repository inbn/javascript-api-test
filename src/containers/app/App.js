import React from "react";
import axios from "axios";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      searchResults: null,
      basket: []
    };

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onGetBrewByName = this.onGetBrewByName.bind(this);
    this.onResetSearch = this.onResetSearch.bind(this);
  }

  onHandleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  onGetBrewByName = e => {
    e.preventDefault();
    const { searchName } = this.state;
    axios
      .get(`https://api.punkapi.com/v2/beers?beer_name=${searchName}`)
      .then(response => {
        console.log("get brew by name response:", response);
        if (response && response.data) {
          this.setState({ searchResults: response.data });
        }
      });
  };

  onResetSearch = () => {
    this.setState({ searchResults: null, searchName: "" });
  };

  onAddToBasket = result => {
    let basket = this.state.basket;

    basket.push(result);
    this.setState({ basket });
  };

  render = () => {
    const { searchName, searchResults, basket } = this.state;
    return (
      <section>
        <h2>Basket ({basket.length})</h2>
        <form onSubmit={this.onGetBrewByName}>
          <input
            name="searchName"
            type="text"
            placeholder="Name"
            value={searchName}
            onChange={this.onHandleChange}
          />
          <input type="submit" value="Search by name" />
        </form>
        {searchResults !== null && (
          <button onClick={this.onResetSearch}>Reset Search</button>
        )}

        {searchResults !== null && (
          <section>
            <h3>Brews Found</h3>
            {searchResults.length === 0 ? (
              <section>
                <p>Sorry, no results found for {searchName}.</p>
              </section>
            ) : (
              searchResults.map(result => (
                <section key={result.id}>
                  <div className="c-app__item">
                    <img src={result.image_url} className="c-app__img" />
                    <span className="c-app__title">
                      {result.name} ({result.tagline})
                      <button onClick={this.onAddToBasket.bind(this, result)}>
                        Add
                      </button>
                    </span>
                  </div>
                </section>
              ))
            )}
          </section>
        )}
      </section>
    );
  };
}

export default App;
