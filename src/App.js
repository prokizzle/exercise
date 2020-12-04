import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const authUser = { user: { email: "prod@test.com", password: "prodtest" } };
const AUTH_URL = "https://api.pricetycoon.com/login";
const authenticate = (onSuccess) =>
  axios({ method: "post", url: AUTH_URL, data: authUser }).then(
    onSuccess,
    console.error
  );
const PRODUCT_URL =
  "https://api.pricetycoon.com/api/v2/products?excludePrime=false&difference=15&maxAge=150&page=0&limit=200&retailers[]=1&retailers[]=3";

const filteredProducts = (products) =>
  products
    .filter(({ amzn_price }) => amzn_price <= 20 && amzn_price >= 5)
    .sort((a, b) => a.amzn_price - b.amzn_price);

function App() {
  const [jwt, setJwt] = useState("");
  const [products, setProducts] = useState([]);
  console.log({ products, jwt });
  const fetchProducts = () => {
    !!jwt &&
      axios
        .get(PRODUCT_URL, { headers: { Authorization: `Bearer ${jwt}` } })
        .then(({ data }) => setProducts(data));
  };

  useEffect(() => {
    authenticate(({ data: { token } }) => setJwt(token));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [jwt]);

  const lowCostProducts = filteredProducts(products);

  return (
    <div className="App">
      {!!products && (
        <div>
          <table>
            {lowCostProducts.map(({ amzn_price: price, title, rating }) => (
              <tr>
                <td>{title}</td>
                <td>{price}</td>
                <td>{rating}</td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
export default App;
