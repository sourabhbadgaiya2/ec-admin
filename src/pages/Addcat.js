import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createCategory,
  getAProductCategory,
  resetState,
  updateAProductCategory,
} from "../features/pcategory/pcategorySlice";

// Yup Validation Schema
let schema = yup.object().shape({
  title: yup.string().required("Category Name is Required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];

  const {
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    categoryName,
    updatedCategory,
  } = useSelector((state) => state.pCategory);


  // Fetch data for edit mode
  useEffect(() => {
    if (getPCatId) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getPCatId]);

  // Handle toast notifications
  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!");
      dispatch(resetState());
    }
    if (isSuccess && updatedCategory) {
      toast.success("Category Updated Successfully!");
      dispatch(resetState());
      navigate("/admin/list-category");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, createdCategory, updatedCategory, dispatch, navigate]);

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getPCatId) {
        dispatch(updateAProductCategory({ id: getPCatId, pCatData: values }));
      } else {
        dispatch(createCategory(values));
        formik.resetForm();
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">{getPCatId ? "Edit" : "Add"} Category</h3>
      <form onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          label="Enter Product Category"
          onChng={formik.handleChange("title")}
          onBlr={formik.handleBlur("title")}
          val={formik.values.title}
          id="category-title"
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>
        <button
          className="btn btn-success border-0 rounded-3 my-5"
          type="submit"
        >
          {getPCatId ? "Edit" : "Add"} Category
        </button>
      </form>
    </div>
  );
};

export default Addcat;
