import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, resetState } from "../features/product/productSlice";

const { Option } = Select;

const schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup.array().min(1, "Pick at least one color"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [dispatch]);

  const brandStates = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorStates = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, createdProduct } = newProduct;

  // console.log(brandState, "BrandState")
  // console.log(catState, "catState")
  // console.log(colorState, "colorState")
  // console.log(imgState, "imgState")
  // console.log(newProduct, "newProduct")

  let brandState = brandStates?.brand || [];

  console.log(brandState, "known brand");

  // const catState = catStates.
  const colorState = colorStates.color || [];
  // const imgState = imgStates. || []

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
      // navigate("/admin/product-list");
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, createdProduct, dispatch, navigate]);

  const categoryList = catState?.category || [];

  const colorOptions = colorState.map((i) => ({
    label: i.title,
    value: i._id,
  }));

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      color: [],
      quantity: "",
      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values, "dll");
      dispatch(createProducts(values));
      formik.resetForm();
      // setColor([]);
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    },
  });

  useEffect(() => {
    formik.setFieldValue("color", color);
  }, [color]);

  useEffect(() => {
    const imgs = imgState.map((img) => ({
      public_id: img.public_id,
      url: img.url,
    }));
    setImages(imgs);
    formik.setFieldValue("images", imgs);
  }, [imgState]);

  return (
    <div>
      <h3 className='mb-4 title'>Add Product</h3>
      <form onSubmit={formik.handleSubmit} className='d-flex gap-3 flex-column'>
        <CustomInput
          type='text'
          label='Enter Product Title'
          name='title'
          onChng={formik.handleChange("title")}
          onBlr={formik.handleBlur("title")}
          val={formik.values.title}
        />
        <div className='error'>
          {formik.touched.title && formik.errors.title}
        </div>

        <ReactQuill
          theme='snow'
          name='description'
          onChange={(val) => formik.setFieldValue("description", val)}
          value={formik.values.description}
        />
        <div className='error'>
          {formik.touched.description && formik.errors.description}
        </div>

        <CustomInput
          type='number'
          label='Enter Product Price'
          name='price'
          onChng={formik.handleChange("price")}
          onBlr={formik.handleBlur("price")}
          val={formik.values.price}
        />
        <div className='error'>
          {formik.touched.price && formik.errors.price}
        </div>

        <select
          name='brand'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.brand}
          className='form-control py-3 mb-3'
        >
          <option value=''>Select Brand</option>
          {brandState?.map((i, j) => (
            <option key={j} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>
        <div className='error'>
          {formik.touched.brand && formik.errors.brand}
        </div>

        <select
          name='category'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className='form-control py-3 mb-3'
        >
          <option value=''>Select Category</option>
          {categoryList.map((i, j) => (
            <option key={j} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>
        <div className='error'>
          {formik.touched.category && formik.errors.category}
        </div>

        <select
          name='tags'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tags}
          className='form-control py-3 mb-3'
        >
          <option value=''>Select Tag</option>
          <option value='featured'>Featured</option>
          <option value='popular'>Popular</option>
          <option value='special'>Special</option>
        </select>
        <div className='error'>{formik.touched.tags && formik.errors.tags}</div>

        <Select
          mode='multiple'
          allowClear
          className='w-100'
          placeholder='Select colors'
          value={color}
          onChange={setColor}
          options={colorOptions}
        />
        <div className='error'>
          {formik.touched.color && formik.errors.color}
        </div>

        <CustomInput
          type='number'
          label='Enter Product Quantity'
          name='quantity'
          onChng={formik.handleChange("quantity")}
          onBlr={formik.handleBlur("quantity")}
          val={formik.values.quantity}
        />
        <div className='error'>
          {formik.touched.quantity && formik.errors.quantity}
        </div>

        <div className='bg-white border-1 p-5 text-center'>
          <Dropzone
            onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag & drop files here, or click to select</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div className='showimages d-flex flex-wrap gap-3'>
          {imgState.map((i, j) => (
            <div className='position-relative' key={j}>
              <button
                type='button'
                onClick={() => dispatch(delImg(i.public_id))}
                className='btn-close position-absolute'
                style={{ top: "10px", right: "10px" }}
              ></button>
              <img src={i.url} alt='' width={200} height={200} />
            </div>
          ))}
        </div>

        <button
          className='btn btn-success border-0 rounded-3 my-5'
          type='submit'
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Addproduct;
