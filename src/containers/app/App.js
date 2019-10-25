import React from "react";
import axios from "axios";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      searchResults: null,
      beerTypesSelected: [],
      basket: {},
      isViewingBasket: false
    };

    this.basketKey = 1;

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onGetBrewByName = this.onGetBrewByName.bind(this);
    this.onResetSearch = this.onResetSearch.bind(this);
  }

  onHandleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  // TO DO add more ways of refining search e.g. by beer type ... hops, yeast, malt
  // perhaps with drop downs etc
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
    const { beerTypesSelected } = this.state;
    let basket = this.state.basket;

    if (
      !beerTypesSelected.includes(result.name) &&
      beerTypesSelected.length === 3
    ) {
      // TODO: Create  friendlier modal dialog or banner to indicate limit of 10 types of beer reached
      return alert("Sorry limit of beer types reached");
    }

    if (!beerTypesSelected.includes(result.name)) {
      beerTypesSelected.push(result.name);
    }

    if (Object.keys(basket).length < 60) {
      basket[this.basketKey] = result;
      this.basketKey++;
      this.setState({ basket });
    } else {
      // TODO: Create  friendlier modal dialog or banner to indicate limit of 60 reached
      alert("Sorry limit number of beers reached");
    }
  };

  onRemovefromBasket = brewId => {
    let basket = this.state.basket;
    delete basket[brewId];
    this.setState({ basket });
  };

  onViewBasket = () => {
    this.setState({ isViewingBasket: !this.state.isViewingBasket });
  };

  render = () => {
    const { searchName, searchResults, basket, isViewingBasket } = this.state;
    return (
      <section>
        <h2>Basket ({Object.keys(basket).length})</h2>
        <button onClick={this.onViewBasket}>View Basket</button>
        {isViewingBasket &&
          Object.keys(basket).map(brewId => (
            <section key={brewId}>
              <div className="c-app__item">
                <img src={basket[brewId].image_url} className="c-app__img" />
                <span className="c-app__title">
                  {basket[brewId].name} ({basket[brewId].tagline})
                  <button onClick={this.onRemovefromBasket.bind(this, brewId)}>
                    Remove
                  </button>
                </span>
              </div>
            </section>
          ))}
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
