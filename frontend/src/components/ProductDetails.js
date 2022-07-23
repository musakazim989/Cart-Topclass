import React, { useReducer, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import {
  Container,
  Card,
  Button,
  Col,
  Row,
  ListGroup,
  Badge,
} from "react-bootstrap"
import axios from "axios"
import Rating from "./Rating"
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css"
import InnerImageZoom from "react-inner-image-zoom"
import { Helmet } from "react-helmet-async"
import { Store } from "../Store"
import { useNavigate } from "react-router-dom"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    case "FETCH_SUCCESS":
      return { ...state, loading: true, product: action.payload }
    case "FETCH_FAILS":
      return { ...state, loading: true, error: action.message }
    default:
      return state
  }
}

const ProductDetails = () => {
  let navigate = useNavigate()
  let params = useParams()

  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: false,
    product: {},
    error: "",
  })

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" })
    try {
      let product = await axios.get(
        `http://localhost:8000/products/${params.slug}`
      )
      dispatch({ type: "FETCH_SUCCESS", payload: product.data })
    } catch (err) {
      dispatch({ type: "FETCH_FAILS", payload: err.message })
    }
  }, [params.slug])

  const { state, dispatch: ctxdispatch } = useContext(Store)
  const { cart } = state

  const handleAddtoCart = async () => {
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
    navigate(`/cartpage`)
  }

  return (
    <Container>
      {/* <div>{params.slug}</div> */}
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      {product ? (
        <Row className="mt-5">
          <Col lg={6}>
            <InnerImageZoom
              src={product.image}
              zoomSrc={product.image}
              width="500"
            />
          </Col>

          <Col lg={3}>
            <Card style={{ width: "18rem" }}>
              <ListGroup variant="flush">
                <ListGroup.Item>{product.name}</ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numberofrating={product.numberofrating}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  Stock{" "}
                  {product.instock > 1 ? (
                    <Badge bg="warning"> {product.instock}</Badge>
                  ) : (
                    <Badge bg="danger"> {product.instock}</Badge>
                  )}
                  <h4>${product.price}</h4>
                </ListGroup.Item>

                <ListGroup.Item>{product.description}</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col lg={3}>
            <Card style={{ width: "18rem" }}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4>Price</h4>
                </ListGroup.Item>
                <ListGroup.Item>${product.price}</ListGroup.Item>
              </ListGroup>
              <Button variant="primary" onClick={handleAddtoCart}>
                Add to Cart
              </Button>
            </Card>
          </Col>
        </Row>
      ) : (
        "empty"
      )}
    </Container>
  )
}

export default ProductDetails
