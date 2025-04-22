import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { getProducts, updateProduct } from "../features/product/productSlice";
import { Select } from "antd";

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

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  const brandStates = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorStates = useSelector((state) => state.color.colors);
  const productList = useSelector((state) => state.product.products.data || []);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const product = productList.find((p) => p._id === id);
    if (product) {
      setInitialValues({
        title: product.title,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        tags: product.tags,
        color: product.color || [],
        quantity: product.quantity,
      });
      setColor(product.color || []);
    }
  }, [productList, id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      color: [],
      quantity: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(updateProduct({ id, productData: values }))
        .unwrap()
        .then(() => {
          toast.success("Product updated successfully!");
          // navigate("/admin/product-list");
        })
        .catch(() => {
          toast.error("Failed to update product.");
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue("color", color);
  }, [color]);

  const colorOptions = (colorStates.color || []).map((i) => ({
    label: i.title,
    value: i._id,
  }));

  const categoryList = catState?.category || [];
  const brandList = brandStates?.brand || [];

  if (!initialValues) return <div>Loading...</div>;

  return (
    <div>
      <h3 className='mb-4 title'>Edit Product</h3>
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
          value={formik.values.description}
          onChange={(val) => formik.setFieldValue("description", val)}
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
          className='form-control py-3 mb-3'
          value={formik.values.brand}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value=''>Select Brand</option>
          {brandList.map((b, i) => (
            <option key={i} value={b.title}>
              {b.title}
            </option>
          ))}
        </select>
        <div className='error'>
          {formik.touched.brand && formik.errors.brand}
        </div>

        <select
          name='category'
          className='form-control py-3 mb-3'
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value=''>Select Category</option>
          {categoryList.map((c, i) => (
            <option key={i} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
        <div className='error'>
          {formik.touched.category && formik.errors.category}
        </div>

        <select
          name='tags'
          className='form-control py-3 mb-3'
          value={formik.values.tags}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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

        <button
          className='btn btn-primary border-0 rounded-3 my-5'
          type='submit'
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
