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
      isViewingBasket: false,
      page: 1,
      limit: 11,
      allowNext: false
    };

    this.basketKey = 1;

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onGetBrews = this.onGetBrews.bind(this);
    this.onResetSearch = this.onResetSearch.bind(this);
  }

  componentDidMount = () => {
    this.onGetBrews();
  };

  onHandleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value, page: 1 });
    this.onGetBrews();
  };

  onGetBrews = e => {
    if (e) e.preventDefault();

    const { page, limit, searchName } = this.state;

    let url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${limit}`;

    if (searchName !== "") {
      url += `&beer_name=${searchName}`;
    }

    axios.get(url).then(response => {
      let allowNext = false;
      if (response && response.data) {
        if (response.data.length === limit) {
          response.data.pop();
          allowNext = true;
        }
        this.setState({ searchResults: response.data, allowNext });
      }
    });
    // TO DO error handling
  };

  onResetSearch = () => {
    this.setState({ searchResults: null, searchName: "" });
    this.onGetBrews();
  };

  onAddToBasket = result => {
    const { beerTypesSelected } = this.state;
    let basket = this.state.basket;

    if (
      !beerTypesSelected.includes(result.name) &&
      beerTypesSelected.length === 3
    ) {
      // TODO: Create friendlier modal dialog or banner to indicate limit of 10 types of beer reached
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

  onNext = () => {
    this.setState({ page: this.state.page + 1 });
    this.onGetBrews();
  };

  onPrevious = () => {
    this.setState({ page: this.state.page - 1 });
    this.onGetBrews();
  };

  render = () => {
    const {
      searchName,
      searchResults,
      basket,
      isViewingBasket,
      page,
      allowNext
    } = this.state;

    /*
    TO DO organise basket so that the same type of beer is only listed once, with a count next to it
    e.g. Pale Ale x 2

    TO DO improve layout and colours and fonts
    */

    return (
      <section>
        <h1>Beers, Beers & More Beers</h1>
        <p>It's that time of year to select your beer!</p>
        <p>Anyone is free to select any kind of beer they would like.</p>
        <p>
          However, there is a limit of the number of beers, 60 and a limit on
          the range of beers, 10
        </p>
        <div className="c-app__basket">
          <h2 className="c-app__basket-header">
            Basket ({Object.keys(basket).length}/60)
          </h2>
          {Object.keys(basket).length > 0 && (
            <button onClick={this.onViewBasket} className="c-app__btn">
              {isViewingBasket ? "Hide Basket" : "View Basket"}
            </button>
          )}
          {isViewingBasket &&
            Object.keys(basket).map(brewId => (
              <section key={brewId}>
                <div className="c-app__item">
                  <img src={basket[brewId].image_url} className="c-app__img" />
                  <span className="c-app__title">
                    {basket[brewId].name} ({basket[brewId].tagline})
                    <button
                      className="c-app__btn"
                      onClick={this.onRemovefromBasket.bind(this, brewId)}
                    >
                      Remove
                    </button>
                  </span>
                </div>
              </section>
            ))}
        </div>
        <div className="c-app__search">
          <h2>Search</h2>
          <form onSubmit={this.onResetSearch}>
            <input
              name="searchName"
              type="text"
              placeholder="Name"
              value={searchName}
              onChange={this.onHandleChange}
            />
            <input type="submit" value="Reset Search" />
          </form>
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
                        <button
                          className="c-app__btn"
                          onClick={this.onAddToBasket.bind(this, result)}
                        >
                          Add
                        </button>
                      </span>
                    </div>
                  </section>
                ))
              )}
              {
                <button disabled={page === 1} onClick={this.onPrevious}>
                  Prev
                </button>
              }
              <span>{page}</span>
              {
                <button disabled={!allowNext} onClick={this.onNext}>
                  Next
                </button>
              }
            </section>
          )}
        </div>
      </section>
    );
  };
}

export default App;
