import { useEffect, useState } from "react";

import api from "./api";
import { Product } from "./types";

import { Button, ButtonGroup, Center } from '@chakra-ui/react'
import { MinusIcon, AddIcon } from '@chakra-ui/icons'

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [listProducts, setListProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    api.list().then(setProducts);
  }, []);

  const totalPrice = listProducts.reduce((total, item) => total + item.price, 0);

  const addProduct = (p: Product) => {
    setListProducts([...listProducts, p])
  }

  const removeProduct = (p: Product) => {
    setListProducts((prevItems) => prevItems.filter((item) => item.id !== p.id));
    setTotal(total - p.price)
  };


  return (
    <main>
      <header>Estampitiency</header>
      <section>
        {products.map((product) => (
          <article key={product.id}>
            <img src={product.image} />
            <div>
              <p>{product.title}</p>
              <p>{product.description}</p>
            </div>
            {
              listProducts.some((item) => item.id === product.id) ?
                <Center flexDirection="row" gap={20} className="ButtonGroup"   >
                  <Button colorScheme="blue" size='xs' style={{ width: "100px", height:"40px" }} onClick={() => removeProduct(product)}><MinusIcon /></Button>
                  <Button colorScheme="blue" size='xs' style={{ width: "100px", height:"40px" }} onClick={() => addProduct(product)}><AddIcon /></Button>
                </Center>
                :
                <Button colorScheme="blue" onClick={() => addProduct(product)}>Agregar</Button>
            }
          </article>
        ))}
      </section>
      <aside>
        <Button colorScheme='blue'>{listProducts.length} productos (total: ${totalPrice})</Button>
      </aside>
      <footer>
        {/* Encontrá la consigna de este ejercicio y otros más{" "}
        <a href="https://github.com/goncy/interview-challenges/tree/main/simple-cart">acá</a> */}
      </footer>
    </main>
  );
}

export default App;