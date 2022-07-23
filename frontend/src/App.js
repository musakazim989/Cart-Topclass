import {
  Navbar,
  Container,
  Nav,
  Badge,
  NavDropdown,
  Button,
  Offcanvas,
} from "react-bootstrap"
import { Routes, Route, Link } from "react-router-dom"
import Home from "./components/Home"
import ProductDetails from "./components/ProductDetails"
import ProductPage from "./components/ProductPage"
import Cart from "./components/Cart"
import {
  FaCartPlus,
  FaTimes,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa"
import { Store } from "./Store"
import { useContext, useState } from "react"
import CartPage from "./components/CartPage"
import Login from "./components/Login"

function App() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  console.log(cartItems)

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

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Top Class</Navbar.Brand>
          <Nav className="ms-auto menu">
            <Link className="item" to="/">
              Home
            </Link>
            <Link className="item" to="/products">
              Products
            </Link>
            <NavDropdown title={<FaCartPlus />} id="basic-nav-dropdown">
              {cartItems.map((item) => (
                <NavDropdown.Item>
                  <Link to={`/products/${item.slug}`}>
                    <img width="50" src={item.image} /> {item.name}
                  </Link>
                  <Button onClick={() => hadleRemoveItem(item)}>
                    <FaTimes />
                  </Button>
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <div className="text-center mt-2">
                <NavDropdown.Item>
                  <Link to={"/cartpage"}>Go to Cart</Link>
                </NavDropdown.Item>
              </div>
            </NavDropdown>

            {state.cart.cartItems.length > 0 && (
              <Badge pill bg="danger">
                {state.cart.cartItems.length}
              </Badge>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Button variant="warning" onClick={handleShow} className="me-2 sidecart">
        <FaCartPlus />
      </Button>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.map((item) => (
            <div>
              <Link to={`/products/${item.slug}`}>
                <img width="50" src={item.image} /> {item.name}
              </Link>
              <span className="offcanvas-counter">
                <Button
                  className="offcanvas-button"
                  onClick={() => updateCart(item, item.quantity + 1)}
                  disabled={item.instock == item.quantity}
                >
                  <FaPlusCircle />
                </Button>
                <span> {item.quantity} </span>
                <Button
                  className="offcanvas-button"
                  onClick={() => updateCart(item, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  <FaMinusCircle />
                </Button>
              </span>

              <Button
                className="offcanvas-button"
                onClick={() => hadleRemoveItem(item)}
              >
                <FaTimes />
              </Button>
              <hr />
            </div>
          ))}
          <Link to={"/cartpage"}>
            <Button className="w-100">Go to Cart</Button>
          </Link>
        </Offcanvas.Body>
      </Offcanvas>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/signin" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
