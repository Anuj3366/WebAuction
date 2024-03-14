"use client";
import Center from "@/components/Center";
import styled from "styled-components";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import { useState, useEffect } from "react";
import { toast } from 'sonner';

const Image = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover; 
`;

const Bg = styled.div`
  background-color: #222;
  color:#fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size:1.5rem;
  @media screen and (min-width: 768px) {
    font-size:3rem;
  }
`;
const Desc = styled.p`
  color:#aaa;
  font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img{
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img{
      max-width: 100%;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap:10px;
  margin-top:25px;
`;

export default function Featured(id) {
  const [product, setFeaturedProduct] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/get/65f2855694db0e6b6f6aebe7", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        setFeaturedProduct(data);
      });
  }, []);
  function addFeaturedToCart() {
    const token = Cookies.get('jwt')
    if (!token) window.location.href = "/Login";
    else {
      fetch("http://localhost:3000/addToCart", {
        method: 'POST',
        credentials: 'true',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.redirectToLogin) {
            localStorage.removeItem('token');
            window.location.href = "/Login";
          }
          else toast.success("Added to cart");
        });
    }
  }


  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product?.title}</Title>
              <Desc>{product?.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink href={'/product/' + product?._id} $outline $white>Read more</ButtonLink>
                <Button $white onClick={addFeaturedToCart}>
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            {product?.images && <Image src={product.images[0]} alt="" />}
          </Column>
        </ColumnsWrapper>
      </Center>

    </Bg>
  );
}
