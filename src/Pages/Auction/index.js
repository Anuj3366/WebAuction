import Header from "../../components/Appbar/Header";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";

export default function ProductsPage() {
  const products = "";
  fetch("http://localhost:1234/getAllAuction", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(data => {
    products = data;
  });
  return (
    <>
      <Header />
      <Center>
        <Title>All Auctions</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}