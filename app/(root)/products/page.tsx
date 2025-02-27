"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import { FaShoppingCart } from "react-icons/fa";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSession } from "next-auth/react";

const CartModal = dynamic(() => import("./CartModal"), { ssr: false });

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const ProductsList: React.FC<{ searchQuery: string; category: string; page: number; onAddToCart: (productId: string) => void }> = React.memo(
    function ProductsListComponent({ searchQuery, category, page, onAddToCart }) {
        const router = useRouter();
        const [products, setProducts] = useState<Product[]>([]);
        const [pagination, setPagination] = useState<Pagination | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const url = new URL("/api/products", window.location.origin);
                    if (category) url.searchParams.set("category", category);
                    if (searchQuery) url.searchParams.set("search", searchQuery);
                    url.searchParams.set("page", page.toString());
                    url.searchParams.set("limit", "6");

                    const response = await fetch(url.toString());
                    const data = await response.json();

                    if (data.success) {
                        setProducts(data.products);
                        setPagination(data.pagination);
                    } else {
                        setError(data.message || "Failed to fetch products");
                    }

                    router.push(
                        `/products?page=${page}${category ? `&category=${category}` : ""}${
                            searchQuery ? `&search=${searchQuery}` : ""
                        }`,
                        { scroll: false }
                    );
                } catch (err) {
                    setError("An error occurred while fetching products");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();
        }, [searchQuery, category, page, router]);

        const handlePageChange = useCallback(
            (newPage: number) => {
                router.push(
                    `/products?page=${newPage}${category ? `&category=${category}` : ""}${
                        searchQuery ? `&search=${searchQuery}` : ""
                    }`,
                    { scroll: false }
                );
            },
            [router, category, searchQuery]
        );

        const PaginationControls = useMemo(
            () =>
                pagination && pagination.totalPages > 1 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="mt-12 flex justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full disabled:bg-gray-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                        >
                            Previous
                        </motion.button>
                        <span className="px-6 py-3 text-gray-200 text-lg font-semibold">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pagination.totalPages}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full disabled:bg-gray-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                ) : null,
            [pagination, page, handlePageChange]
        );

        if (loading) return <Loading />;
        if (error)
            return (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-red-500 text-xl font-semibold"
                >
                    {error}
                </motion.p>
            );

        return (
            <>
                {products.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-gray-400 text-xl font-semibold"
                    >
                        No products found
                    </motion.p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-900/50 p-6 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-500 overflow-hidden relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative w-full"
                                >
                                    <NextImage
                                        src={product.image}
                                        alt={product.name}
                                        width={300}
                                        height={300}
                                        className="w-full h-64 object-cover object-center rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                </motion.div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide mt-4">
                                    {product.name}
                                </h2>
                                <p className="text-orange-500 text-lg md:text-xl font-bold mt-2">
                                    ${product.price.toFixed(2)}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onAddToCart(product._id)}
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)] flex items-center justify-center gap-2 w-full"
                                >
                                    <FaShoppingCart size={18} />
                                    Add to Cart
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
                {PaginationControls}
            </>
        );
    }
);

const ProductsPage = () => {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchInput, setSearchInput] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // Initialize as empty array
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        setIsMounted(true);
        setSearchInput(searchParams.get("search") || "");
        setDebouncedSearchQuery(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get("category") || "");
    }, [searchParams]);

    useEffect(() => {
        if (!isMounted || status === "loading" || !session?.user?.id) return;

        const fetchCart = async () => {
            setCartLoading(true);
            try {
                const response = await axios.get("/api/cart");
                if (response.data.success) {
                    setCartItems(
                        response.data.cart?.items?.map((item: any) => ({
                            _id: item.product._id,
                            name: item.product.name,
                            image: item.product.image,
                            price: item.product.price,
                            description: item.product.description,
                            category: item.product.category,
                            quantity: item.quantity,
                        })) || []
                    );
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCartItems([]); // Fallback to empty array on error
            } finally {
                setCartLoading(false);
            }
        };
        fetchCart();
    }, [session, status, isMounted]);

    const debouncedSetSearchQuery = useCallback(
        debounce((value: string) => {
            setDebouncedSearchQuery(value);
        }, 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSetSearchQuery(value);
    };

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    }, []);

    const handleAddToCart = async (productId: string) => {
        if (!session?.user?.id) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            const response = await axios.post("/api/cart/add", { productId, quantity: 1 });
            if (response.data.success) {
                setCartItems(
                    response.data.cart.items.map((item: any) => ({
                        _id: item.product._id,
                        name: item.product.name,
                        image: item.product.image,
                        price: item.product.price,
                        description: item.product.description,
                        category: item.product.category,
                        quantity: item.quantity,
                    }))
                );
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        try {
            const response = await axios.put("/api/cart/update", { productId, quantity });
            if (response.data.success) {
                setCartItems(
                    response.data.cart.items.map((item: any) => ({
                        _id: item.product._id,
                        name: item.product.name,
                        image: item.product.image,
                        price: item.product.price,
                        description: item.product.description,
                        category: item.product.category,
                        quantity: item.quantity,
                    }))
                );
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            alert("Failed to update cart");
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            const response = await axios.post("/api/productscheckout", {
                items: cartItems.map((item) => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            });

            const { url } = response.data;
            if (url) {
                window.location.href = url;
            } else {
                alert("Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout");
        }
    };

    const Filters = useMemo(
        () => (
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mb-10 flex flex-col sm:flex-row justify-center gap-6"
            >
                <motion.input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    whileHover={{ scale: 1.02, borderColor: "#f97316" }}
                    className="p-3 rounded-xl border-2 border-gray-700 bg-gray-800 text-white w-full sm:w-72 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-[0_0_5px_rgba(255,0,0,0.2)]"
                />
                <motion.select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    whileHover={{ scale: 1.02, borderColor: "#f97316" }}
                    className="p-3 rounded-xl border-2 border-gray-700 bg-gray-800 text-white w-full sm:w-72 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-[0_0_5px_rgba(255,0,0,0.2)]"
                >
                    <option value="">All Categories</option>
                    <option value="bulk">Bulk</option>
                    <option value="cut">Cut</option>
                    <option value="items">Items</option>
                    <option value="supplements">Supplements</option>
                    <option value="accessories">Accessories</option>
                </motion.select>
                {isMounted && (
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCartOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)] flex items-center gap-2"
                    >
                        <FaShoppingCart size={18} />
                        Cart ({cartLoading ? "..." : cartItems.length === 0 ? 0 : cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                    </motion.button>
                )}
            </motion.div>
        ),
        [searchInput, handleSearchChange, selectedCategory, handleCategoryChange, cartItems, cartLoading, isMounted]
    );

    if (!isMounted || status === "loading") return <Loading />;

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-extrabold text-center text-white uppercase tracking-tight mb-12 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                    Unleash Your <span className="text-orange-500">Gear</span>
                </motion.h1>
                <Suspense fallback={<Loading />}>
                    {Filters}
                    <ProductsList
                        searchQuery={debouncedSearchQuery}
                        category={selectedCategory}
                        page={page}
                        onAddToCart={handleAddToCart}
                    />
                    {isCartOpen && !cartLoading && (
                        <CartModal
                            cartItems={cartItems || []} 
                            onClose={() => setIsCartOpen(false)}
                            onUpdateQuantity={handleUpdateQuantity}
                            onCheckout={handleCheckout}
                        />
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default ProductsPage;