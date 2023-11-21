import React, { useState, useEffect } from 'react';
import { MdDelete, MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Divider } from '@fluentui/react-divider';
import './cartPage.css'; // Add your custom styles here
import creds from '../../creds';
import axios from 'axios';

const url = creds.backendUrl;

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  const PurchaseItem = async (amount) => {
    let data = {
      amount: amount,
    };

    try {
      const response = await axios.post(url + 'create-checkout-session', { params: data });
      let session = response.data.url;
      window.location.href = session;
    } catch (err) {
      console.error('Error creating checkout session:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataReq = {
          UserId: JSON.parse(localStorage.getItem('dfs-user')).user.user_email,
        };

        const response = await axios.post(url + 'get-cart', { params: dataReq });
        let val = response.data;
        console.log(val)
        setCartItems(val);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      }
    };

    fetchData();
  }, []);

  const RemoveItem = async (itemID,version) => {

    let data = {
      ItemID: itemID,
      UserId: JSON.parse(localStorage.getItem("dfs-user")).user.user_email,
      versionId : version
    }
    console.log(data)
    const response = await fetch(url + "remove-cart-item", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.status == 200) {
      window.location.reload(false)
    } else if (response.status == 400) {
    }
  }

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={8}>
          <h2 className="is-size-3 has-text-weight-bold ml-3">Shopping Cart</h2>
          <Row className="justify-content-center mt-3">
            {cartItems.map((item) => (
              <Col key={item.id} md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title className="is-size-4 has-text-weight-bold">{item.dataset_name}</Card.Title>
                    <Card.Text className="is-size-6">Version: {item.versionId}</Card.Text>
                    <Card.Text>{item.dataset_description}</Card.Text>
                    <Card.Text className="is-size-5 has-background-primary-light mt-3 rounded">
                      ₹ {100}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="outline-danger" className="is-rounded" onClick={() => RemoveItem(item.dataset_id,item.versionId)}>
                      <MdDelete /> Remove Item
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={1}>
          <Divider vertical style={{ color: 'grey', height: '100%', marginTop: '10px' }} />
        </Col>
        <Col sm={2} className="has-text-centered">
            <p className="is-size-2 has-text-weight-bold" style={{ marginTop: '50%' }}>
              Total
            </p>
            <div className="box" style={{ borderWidth: '5px', borderStyle: 'double', width: '300px' }}>
              {cartItems.map((ele) => (
                <div key={ele.id}>
                  {ele.dataset_name} &rarr; ₹ {100}
                </div>
              ))}
            </div>
            <Divider style={{ width: '300px' }} />
            <br />
            <div className="box" style={{ borderWidth: '5px', borderStyle: 'double', width: '300px' }}>
              Subtotal &rarr; ₹ {cartItems.reduce((sum, item) => sum + 100, 0)}
            </div>
            <Button
              variant="success"
              className="is-rounded is-outlined mt-3"
              style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}
              onClick={() => PurchaseItem(cartItems.length * 100)}
            >
              <MdOutlineShoppingCartCheckout className="icon is-large" /> Proceed to Checkout
            </Button>
          </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
