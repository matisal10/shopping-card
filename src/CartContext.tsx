import React, { createContext, useState, useContext, ReactNode } from "react";
import { Product } from "./types";


interface listProducts {
  id: string,
  quantity: number
}

interface CartContextProps {
  arrayProducts: listProducts[];
  total: number;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}


export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [arrayProducts, setArrayProducts] = useState<listProducts[]>([]);
  const [total, setTotal] = useState(0);

  const addProduct = (product: Product) => {
    setArrayProducts((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex >= 0) {
        // El producto ya existe en el carrito
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        updatedItems[existingItemIndex] = updatedItem;
        return updatedItems;
      } else {
        // Añadir un nuevo producto al carrito
        const newItem = { id: product.id, quantity: 1 };
        return [...prevItems, newItem];
      }
    });
    setTotal((prevTotal) => prevTotal + product.price);
  };

  const removeProduct = (product: Product) => {
    setArrayProducts((prevItems) => {
      let updatedTotal = total;
      const updatedItems = prevItems.map((item) => {
        if (item.id === product.id) {
          const newQuantity = item.quantity - 1;
          if (newQuantity >= 0) {
            updatedTotal -= product.price;
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      });
  
      const filteredItems = updatedItems.filter((item) => item.quantity > 0);
      setTotal(updatedTotal);
      return filteredItems;
    });
  };


  // const clearCart = () => {
  //   setListProducts([]);
  //   setTotal(0);
  // };

  return (
    <CartContext.Provider
      value={{ arrayProducts, total, addProduct, removeProduct }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextProps => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
};