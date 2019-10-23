import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, basketItems, basketOpen, setBasketOpen }) => (
  <header className="bg-pink-600 text-white">
    <div
      className="flex justify-between items-center"
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 className="m-0 text-xl">
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <button
        aria-expanded="false"
        className="border border-white p-2"
        onClick={() => setBasketOpen(!basketOpen)}
      >
        Items in basket: {basketItems.length}
      </button>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
