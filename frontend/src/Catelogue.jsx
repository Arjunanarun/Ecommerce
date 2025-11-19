import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import ProductCard from '../Components/ProductCard';
import './Catelogue.css';
import MobileNavbar from '../Components/Nav';

const Catelogue = () => {

    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/products/");
            setProducts(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log(error.message);

        }
    }
    useEffect(() => {
        getAllProducts();
    }, [])


    return (
        <>
        <MobileNavbar />

        <div className='collection-container'>
            {
                products.map((item, index)=>(
                    <ProductCard key={index} id={item._id} image={item.images?.[0]?.url} name={item.name} price={item.price} desc={item.description} />
                ))
            }
        </div>
        </>
    )
}

export default Catelogue
