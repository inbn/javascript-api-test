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
    this.onResetSearch();
  };

  render = () => {
    const { searchName, searchResults, basket, isViewingBasket } = this.state;
    return (
      <section>
      <h1>Beers, Beers & More Beers</h1>
      <p>It's that time of year to select your beer!</p>
      <p>Anyone is free to select any kind of beer they would like.</p>
      <p>However, there is a limit of the number of beers, 60 and a limit on the range of beers, 10</p>
        <h2 className="c-app__basket-header">Basket ({Object.keys(basket).length}/60)</h2>
        {Object.keys(basket).length > 0 && (
          <button onClick={this.onViewBasket}>
            {isViewingBasket ? "Hide Basket" : "View Basket"}
          </button>
        )}
        /*
        TO DO organise basket so that the same type of beer is only listed once, with a count next to it
        e.g. Pale Ale x 2
        */
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
