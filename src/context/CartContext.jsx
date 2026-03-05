import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        table: ''
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(x => x._id === item._id);
            if (existing) {
                return prev.map(x => 
                    x._id === item._id 
                    ? { ...x, qty: x.qty + 1 } 
                    : x
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(x => x._id !== id));
    };

    const updateQuantity = (id, qty) => {
        if (qty < 1) {
            return removeFromCart(id);
        }
        setCart(prev => prev.map(x => 
            x._id === id ? { ...x, qty } : x
        ));
    };

    const clearCart = () => {
        setCart([]);
        setCustomerInfo({ name: '', phone: '', table: '' });
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;
    const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            subtotal,
            tax,
            total,
            itemCount,
            customerInfo,
            setCustomerInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};