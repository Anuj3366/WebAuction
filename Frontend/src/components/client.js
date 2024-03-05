"use client";
import { useState, useEffect } from "react";

const useFeaturedProducts = function () {
  // console.log("useFeaturedProducts started")
  const [featuredProduct, setFeaturedProduct] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/get/65e335669a608127500cfcfa", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        setFeaturedProduct(data);
      });
  }, []);

  return featuredProduct;
}

const useNewProducts = function () {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/getAllProduct", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        setNewProducts(data);
      });
  }, []);

  return newProducts;
}

module.exports = { useFeaturedProducts, useNewProducts };
