import React from "react"

const Beer = ({
  beer: { id, name, image_url, tagline },
  addToBasket,
  removeFromBasket,
}) => {
  return (
    <li className="w-full sm:w-1/2 md:w-1/3 p-4 flex flex-col">
      <div>
        <img src={image_url} alt="" className="h-20 w-auto" />
      </div>

      <h3 className="text-xl font-bold">{name}</h3>
      <p>{tagline}</p>
      {addToBasket && (
        <button
          type="button"
          onClick={() => addToBasket(id)}
          className="bg-gray-300 hover:bg-grey-400 p-2 mt-auto"
        >
          Add to basket
        </button>
      )}
      {removeFromBasket && (
        <button
          type="button"
          onClick={() => removeFromBasket(id)}
          className="bg-gray-300 hover:bg-grey-400 p-2 mt-auto"
        >
          Remove from basket
        </button>
      )}
    </li>
  )
}

export default Beer
