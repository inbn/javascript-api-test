import React from "react";
import axios from "axios";
import classNames from "classnames";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBeerName: "",
      searchYeastName: "",
      searchHopsName: "",
      searchMaltName: "",
      searchFoodName: "",
      searchAbvGt: "0",
      searchAbvLt: "30",
      searchIbuGt: "0",
      searchIbuLt: "250",
      searchEbcGt: "0",
      searchEbcLt: "300",
      searchResults: null,
      basket: {},
      basketCount: 0,
      isViewingBasket: false,
      page: 1,
      limit: 11,
      allowNext: false
    };

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

    const {
      page,
      limit,
      searchBeerName,
      searchYeastName,
      searchHopsName,
      searchMaltName,
      searchFoodName,
      searchAbvGt,
      searchAbvLt,
      searchIbuGt,
      searchIbuLt,
      searchEbcGt,
      searchEbcLt
    } = this.state;

    let url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${limit}&abv_gt=${searchAbvGt}&abv_lt=${searchAbvLt}&ibu_gt=${searchIbuGt}&ibu_lt=${searchIbuLt}&ebc_gt=${searchEbcGt}&ebc_lt=${searchEbcLt}`;

    if (searchBeerName !== "") url += `&beer_name=${searchBeerName}`;
    if (searchYeastName !== "") url += `&yeast=${searchYeastName}`;
    if (searchHopsName !== "") url += `&hops=${searchHopsName}`;
    if (searchMaltName !== "") url += `&malt=${searchMaltName}`;
    if (searchFoodName !== "") url += `&food=${searchFoodName}`;

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
    this.setState({
      searchResults: null,
      searchBeerName: "",
      searchYeastName: "",
      searchHopsName: "",
      searchMaltName: "",
      searchFoodName: "",
      searchAbvGt: "0",
      searchAbvLt: "30",
      searchIbuGt: "0",
      searchIbuLt: "250",
      searchEbcGt: "0",
      searchEbcLt: "300"
    });
    this.onGetBrews();
  };

  onAddToBasket = result => {
    let basket = this.state.basket;
    let basketCount = this.state.basketCount;

    if (!basket[result.name] && Object.keys(basket).length === 10) {
      // TODO: Create friendlier modal dialog or banner to indicate limit of 10 types of beer reached
      return alert("Sorry limit of beer types reached");
    }

    if (Object.keys(basket).length < 60) {
      if (basket[result.name]) {
        basket[result.name].count++;
        basketCount++;
      } else {
        result.count = 1;
        basket[result.name] = result;
        basketCount++;
      }

      this.setState({ basket, basketCount });
    } else {
      // TODO: Create  friendlier modal dialog or banner to indicate limit of 60 reached
      alert("Sorry limit number of beers reached");
    }
  };

  onRemovefromBasket = name => {
    let basket = this.state.basket;
    let basketCount = this.state.basketCount;
    basket[name].count--;
    if (basket[name].count < 1) delete basket[name];
    basketCount--;
    this.setState({ basket, basketCount });
  };

  onViewBasket = () => {
    this.setState({ isViewingBasket: true });
  };

  onViewCatalogue = () => {
    this.setState({ isViewingBasket: false });
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
      searchBeerName,
      searchYeastName,
      searchHopsName,
      searchMaltName,
      searchFoodName,
      searchAbvGt,
      searchAbvLt,
      searchIbuGt,
      searchIbuLt,
      searchEbcGt,
      searchEbcLt,
      searchResults,
      basket,
      basketCount,
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

        <div>
          <span
            className={classNames({
              "c-app__tab": true,
              "c-app__tab--active": !isViewingBasket
            })}
            onClick={this.onViewCatalogue}
          >
            Punk Catalogue
          </span>
          <span
            className={classNames({
              "c-app__tab": true,
              "c-app__tab--active": isViewingBasket
            })}
            onClick={this.onViewBasket}
          >
            Basket ({basketCount})
          </span>
        </div>
        {!isViewingBasket && (
          <div className="c-app__search">
            <h2>Search</h2>
            <form onSubmit={this.onResetSearch}>
              <div>
                <input
                  name="searchBeerName"
                  type="text"
                  placeholder="Search by beer name"
                  value={searchBeerName}
                  onChange={this.onHandleChange}
                />
              </div>
              <div>
                <input
                  name="searchYeastName"
                  type="text"
                  placeholder="Refine by yeast name"
                  value={searchYeastName}
                  onChange={this.onHandleChange}
                />
              </div>
              <div>
                <input
                  name="searchHopsName"
                  type="text"
                  placeholder="Refine by hops name"
                  value={searchHopsName}
                  onChange={this.onHandleChange}
                />
              </div>
              <div>
                <input
                  name="searchMaltName"
                  type="text"
                  placeholder="Refine by malt name"
                  value={searchMaltName}
                  onChange={this.onHandleChange}
                />
              </div>
              <div>
                <input
                  name="searchFoodName"
                  type="text"
                  placeholder="Refine by matching food"
                  value={searchFoodName}
                  onChange={this.onHandleChange}
                />
              </div>
              <div>
                <div>
                  ABV Greater than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={searchAbvGt}
                    name="searchAbvGt"
                    onChange={this.onHandleChange}
                  />
                  {searchAbvGt}
                </div>
                <div>
                  ABV Less than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={searchAbvLt}
                    name="searchAbvLt"
                    onChange={this.onHandleChange}
                  />
                  {searchAbvLt}
                </div>
                <div>
                  IBU Greater than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="250"
                    value={searchIbuGt}
                    name="searchIbuGt"
                    onChange={this.onHandleChange}
                  />
                  {searchIbuGt}
                </div>
                <div>
                  IBU Less than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="250"
                    value={searchIbuLt}
                    name="searchIbuLt"
                    onChange={this.onHandleChange}
                  />
                  {searchIbuLt}
                </div>
                <div>
                  EBC Greater than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="300"
                    value={searchEbcGt}
                    name="searchEbcGt"
                    onChange={this.onHandleChange}
                  />
                  {searchEbcGt}
                </div>
                <div>
                  EBC Less than:{" "}
                  <input
                    type="range"
                    min="1"
                    max="300"
                    value={searchEbcLt}
                    name="searchEbcLt"
                    onChange={this.onHandleChange}
                  />
                  {searchEbcLt}
                </div>
              </div>
              <input type="submit" value="Reset Search" />
            </form>
            {searchResults !== null && (
              <section>
                <h3>Brews Found</h3>
                {searchResults.length === 0 ? (
                  <section>
                    <p>Sorry, no results found for {searchBeerName}.</p>
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
        )}

        {isViewingBasket && (
          <div className="c-app__basket">
            <h2 className="c-app__basket-header">
              Basket ({Object.keys(basket).length}/60)
            </h2>
            {isViewingBasket &&
              Object.keys(basket).map(brewId => (
                <section key={brewId}>
                  <div className="c-app__item">
                    <img
                      src={basket[brewId].image_url}
                      className="c-app__img"
                    />
                    <span className="c-app__title">
                      {basket[brewId].name} ({basket[brewId].tagline}) x{" "}
                      {basket[brewId].count}
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
        )}
      </section>
    );
  };
}

export default App;
