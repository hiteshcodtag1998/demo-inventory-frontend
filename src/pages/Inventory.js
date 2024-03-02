import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toastMessage } from "../utils/handler";
import { MdEdit, MdDeleteForever, MdOutlineHideSource } from "react-icons/md";
import { Tooltip } from "@mui/material";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState();
  const [brands, setAllBrands] = useState([]);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
    fetchBrandData();
  }, [updatePage]);

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}product/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  // Fetching Data of Search Products
  const fetchSearchData = (searchItem) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}product/search?searchTerm=${searchItem}`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  // // Fetching all stores data
  const fetchSalesData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };


  // Delete item
  const deleteItem = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}product/delete/${selectedProduct?._id}`,
      { method: 'delete', headers: { role: myLoginUser?.roleID?.name }, })
      .then((response) => response.json())
      .then(() => {
        setSelectedProduct()
        setUpdatePage(!updatePage);
        handleClose()
      }).catch(() => {
        setSelectedProduct()
        handleClose()
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Fetching Data of All Brrand items
  const fetchBrandData = () => {
    fetch(`http://localhost:4000/api/brand/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllBrands(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>

          <div className=" flex flex-col md:flex-row md:justify-start md:items-center">
            <div className="flex flex-col p-10 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {products.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            {/* <div className="flex flex-col gap-3 p-10   w-full  md:w-3/12 sm:border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">
                Stores
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {stores.length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    $0
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Revenue
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">
                Top Selling
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    0
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    $0
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Cost</span>
                </div>
              </div>
            </div> */}
            {/* <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Low Stocks
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    0
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Ordered
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    0
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Not in Stock
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {showProductModal && (
          <AddProduct
            brands={brands}
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            brands={brands}
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
            fetchProductsData={fetchProductsData}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProductModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Code
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Brand Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Description
                </th>
                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Availibility
                </th> */}
                {
                  myLoginUser?.roleID?.name === ROLES.SUPER_ADMIN && <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Hide
                  </th>
                }
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {
                products?.length === 0 && <div
                  className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                >
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <span>No data found</span>
                  </div>
                </div>
              }
              {products.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.productCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element?.BrandID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock > 0 ? `In Stock (${element.stock})` : "Not in Stock"}
                    </td> */}
                    {
                      myLoginUser?.roleID?.name === ROLES.SUPER_ADMIN && <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {element?.isActive ? <span
                          className="text-green-700 cursor-pointer"
                          onClick={() => {
                            handleClickOpen();
                            setSelectedProduct(element)
                            setDialogData({
                              title: 'Are you sure want to hide?',
                              btnSecText: 'Hide'
                            })
                          }}
                        >
                          <MdOutlineHideSource />
                        </span> :
                          <span
                            className="text-red-700"
                          >Hidden</span>}
                      </td>
                    }

                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <div className="flex">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-700 cursor-pointer"
                            onClick={() => updateProductModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <span
                            className="text-red-600 px-2 cursor-pointer"
                            onClick={() => {
                              handleClickOpen();
                              setSelectedProduct(element)
                              setDialogData({
                                title: 'Are you sure want to delete?',
                                btnSecText: 'Delete'
                              })
                            }}
                          >
                            <MdDeleteForever width={50} height={50} />
                          </span>
                        </Tooltip>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationDialog
        open={open}
        title={dialogData?.title || ""}
        btnFirstName="Cancel"
        btnSecondName={dialogData?.btnSecText || ""}
        handleClose={handleClose}
        handleDelete={deleteItem} />
    </div>
  );
}

export default Inventory;
