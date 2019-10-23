import React, { useState, useReducer } from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Beer from "../components/beer"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    {
      allBeersJson {
        edges {
          node {
            id
            name
            image_url
            tagline
          }
        }
      }
    }
  `)

  const [basketItems, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        const matchingItems = state.filter(({ id }) => id == action.id)
        if (matchingItems.length === 1) {
          // Increment count
          return [
            ...state.filter(({ id }) => id != action.id),
            {
              id: action.id,
              count: matchingItems[0].count + 1,
            },
          ]
        } else {
          // Add a new item
          return [
            ...state,
            {
              id: action.id,
              count: 1,
            },
          ]
        }

      case "remove":
        // keep every item except the one we want to remove
        return state.filter(({ id }) => id != action.id)
      default:
        return state
    }
  }, [])

  const [basketOpen, setBasketOpen] = useState(false)

  const basketBeers = basketItems.map(basketItem =>
    data.allBeersJson.edges.filter(beer => beer.node.id === basketItem.id)
  )

  return (
    <Layout
      basketItems={basketItems}
      basketOpen={basketOpen}
      setBasketOpen={setBasketOpen}
    >
      <SEO title="Home" />
      {basketOpen && (
        <>
          <h2 className="my-4 text-lg">Beers in basket</h2>
          <ul className="flex flex-wrap">
            {basketBeers.map(basketBeer => (
              <Beer
                key={basketBeer[0].node.id}
                beer={basketBeer[0].node}
                removeFromBasket={beerId => {
                  dispatch({
                    type: "remove",
                    id: beerId,
                  })
                }}
              />
            ))}
          </ul>
        </>
      )}
      <h2 className="my-4 text-lg">Available beers</h2>
      <ul className="flex flex-wrap">
        {data.allBeersJson.edges.map(beer => (
          <Beer
            key={beer.node.id}
            beer={beer.node}
            addToBasket={beerId => {
              dispatch({
                type: "add",
                id: beerId,
              })
            }}
          />
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
