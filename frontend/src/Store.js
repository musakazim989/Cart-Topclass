import { createContext, useReducer } from "react"

const Store = createContext()

let initialState = {
  cart: {
    // before local storage
    // cartItems: [],

    // after using local storge
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
}

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload

      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      )
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item._id === existingItem._id ? newItem : item
          )
        : //quantity update
          [...state.cart.cartItems, newItem]

      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
        // console.log(item._id)
      )
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      }
    }

    default:
      return state
  }
}

function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = { state, dispatch }

  return <Store.Provider value={value}>{props.children}</Store.Provider>
}

export { Store, StoreProvider }
