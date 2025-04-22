import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteAProductCategory,
  getCategories,
  resetState,
} from "../features/pcategory/pcategorySlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const dispatch = useDispatch();

  const showModal = (id) => {
    setOpen(true);
    setpCatId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, [dispatch]);

  const pCatStat = useSelector((state) => state.pCategory.pCategories);
  const categoryList = pCatStat?.category || [];

  // console.log("Fetched Product Categories:", categoryList);

  const data1 = categoryList.map((category, index) => ({
    key: index + 1,
    name: category.title,
    action: (
      <>
        <Link
          to={`/admin/category/${category._id}`}
          className="fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(category._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteCategory = (id) => {
    dispatch(deleteAProductCategory(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteCategory(pCatId)}
        title="Are you sure you want to delete this Product Category?"
      />
    </div>
  );
};

export default Categorylist;
