import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Shopping-cart state shared across the whole app.
// Persisted to localStorage so a guest keeps their cart between sessions.
// The live counter badge in the header reads `count` from here.
const CartContext = createContext(null);

const STORAGE_KEY = 'techshop.cart.v1';
const TAX_RATE = 0.08;
const FREE_SHIPPING_OVER = 99;
const SHIPPING_FEE = 12;

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStorage);

  // persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((list) => {
      const existing = list.find((i) => i.id === product.id);
      if (existing) {
        return list.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, 10) } : i,
        );
      }
      return [
        ...list,
        { id: product.id, title: product.title, price: product.price, image: product.image, qty: Math.min(qty, 10) },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const derived = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    return { count, subtotal, shipping, tax, total };
  }, [items]);

  const value = { items, addItem, removeItem, setQty, clear, ...derived };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
