import React, { useEffect, useReducer } from "react"
import { Container, Card, Button, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import Rating from "./Rating"
import { useContext } from "react"
import { Store } from "../Store"
import { FaTrashAlt } from "react-icons/fa"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload }
    case "FETCH_FAILS":
      return { ...state, loading: false, error: action.message }
    default:
      return state
  }
}

const ProductPage = () => {
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    product: [],
  })

  const { state, dispatch: ctxdispatch } = useContext(Store)
  const { cart } = state

  const {
    cart: { cartItems },
  } = state

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" })
    try {
      let product = await axios.get("http://localhost:8000/products")
      dispatch({ type: "FETCH_SUCCESS", payload: product.data })
    } catch (err) {
      dispatch({ type: "FETCH_FAILS", payload: err.message })
    }
  }, [])

  const handleAddtoCart = async (product) => {
    console.log(product)
    const existingItem = cart.cartItems.find((item) => item._id === product._id)

    const quantity = existingItem ? existingItem.quantity + 1 : 1

    const { data } = await axios.get(
      `http://localhost:8000/cartproduct/${product._id}`
    )

    if (data.instock < quantity) {
      window.alert(`${product.name} Product out of stock`)
      return
    }

    ctxdispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    })
  }

  const updateCart = (item, quantity) => {
    ctxdispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    })
  }

  const hadleRemoveItem = (item) => {
    ctxdispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    })
  }

  return (
    <>
      <Container>
        <title>Product Page</title>

        <Row>
          {loading ? (
            <div className="loading">
              <Spinner animation="border" />
            </div>
          ) : (
            product.map((item, i) => (
              <Col lg={3} className="mt-5" key={i}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </Card.Title>
                    <Rating
                      rating={item.rating}
                      numberofrating={item.numberofrating}
                    />

                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>

                  <Card.Body>
                    {cartItems.map((items) =>
                      item._id == items._id ? (
                        <>
                          <Button
                            onClick={() =>
                              updateCart(items, items.quantity + 1)
                            }
                            disabled={items.instock == items.quantity}
                            variant="success"
                          >
                            +
                          </Button>
                          <span> {items.quantity} </span>
                          <Button
                            onClick={() =>
                              updateCart(items, items.quantity + 1)
                            }
                            disabled={items.quantity === 1}
                            variant="success"
                          >
                            -
                          </Button>
                          <Button
                            className="ms-2"
                            onClick={() => hadleRemoveItem(item)}
                            variant="danger"
                          >
                            <FaTrashAlt />
                          </Button>
                        </>
                      ) : (
                        ""
                      )
                    )}
                    <br />
                    {item.instock == 0 ? (
                      <Button variant="danger">Out of Stock</Button>
                    ) : (
                      <Button
                        className="mt-3"
                        variant="primary"
                        onClick={() => handleAddtoCart(item)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  )
}

export default ProductPage
