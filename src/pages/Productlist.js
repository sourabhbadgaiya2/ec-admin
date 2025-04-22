import React, { useEffect } from "react";
import { Table, Popconfirm, message } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../features/product/productSlice";
import { Link } from "react-router-dom";

const columnsBase = (handleDelete) => [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const productStates = useSelector((state) => state.product.products);
  const productState = productStates.data || [];

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
      dispatch(getProducts());
    } catch (error) {
      message.error("Failed to delete product");
      console.error("Delete Error:", error);
    }
  };

  const data = productState.map((product, index) => ({
    key: index + 1,
    title: product.title,
    brand: product.brand,
    category: product.category,
    color: product.color,
    price: `${product.price}`,
    action: (
      <>
        {/* This link should go to your product edit form where you can dispatch updateProduct */}
        <Link
          to={`/admin/product/${product._id}`}
          className='fs-3 text-primary'
        >
          <BiEdit />
        </Link>
        <Popconfirm
          title='Are you sure you want to delete this product?'
          onConfirm={() => handleDelete(product._id)}
          okText='Yes'
          cancelText='No'
        >
          <span className='ms-3 fs-3 text-danger' style={{ cursor: "pointer" }}>
            <AiFillDelete />
          </span>
        </Popconfirm>
      </>
    ),
  }));

  return (
    <div>
      <h3 className='mb-4 title'>Products</h3>
      <div>
        <Table columns={columnsBase(handleDelete)} dataSource={data} />
      </div>
    </div>
  );
};

export default Productlist;
