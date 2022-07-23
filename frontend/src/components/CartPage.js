import React, { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap"
import { Store } from "../Store"
import { Link, useNavigate } from "react-router-dom"
import { FaTrashAlt } from "react-icons/fa"

const CartPage = () => {
  const { state, dispatch } = useContext(Store)
  let navigate = useNavigate()

  const {
    cart: { cartItems },
  } = state

  const updateCart = (item, quantity) => {
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    })
  }

  const hadleRemoveItem = (item) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    })
  }

  const handleCheckOut = () => {
    navigate("/signin?redirect=/shipping")
  }

  return (
    <Container>
      <Helmet>
        <title>Cart Page</title>
      </Helmet>
      <Row className="mt-5">
        <Col lg={8}>
          {cartItems.length < 0 ? (
            <Alert className="text-center mt-5" variant="danger">
              Cart is empty
            </Alert>
          ) : (
            <ListGroup>
              {cartItems.map((item, i) => (
                <ListGroup.Item key={i}>
                  <Row>
                    <Col lg={4}>
                      <img width="50" src={item.image} />
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col lg={3}>
                      <Button
                        onClick={() => updateCart(item, item.quantity + 1)}
                        disabled={item.instock == item.quantity}
                        variant="success"
                      >
                        +
                      </Button>
                      <span> {item.quantity} </span>
                      <Button
                        onClick={() => updateCart(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        variant="success"
                      >
                        -
                      </Button>
                    </Col>
                    <Col lg={3}>
                      <Button
                        onClick={() => hadleRemoveItem(item)}
                        variant="danger"
                      >
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col lg={4}>
          <h1>
            Total (
            {cartItems.reduce(
              (accumulator, current) => accumulator + current.quantity,
              0
            )}
            ) products
          </h1>
          <h3>
            Price: $
            {cartItems.reduce(
              (accumulator, current) =>
                accumulator + current.price * current.quantity,
              0
            )}
          </h3>
          <Button onClick={handleCheckOut} variant="primary" className="w-100">
            Payment
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default CartPage
