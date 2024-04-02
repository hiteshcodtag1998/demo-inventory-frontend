import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";

export default function AddPurchaseDetails({
  addSaleModalSetting,
  products,
  handlePageUpdate,
  authContext,
  brands,
  warehouses
}) {
  const [purchase, setPurchase] = useState([{
    userID: authContext.user,
    productID: "",
    quantityPurchased: "",
    purchaseDate: "",
    totalPurchaseAmount: "",
    warehouseID: "",
    supplierName: ""
  }]);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  // Handling Input Change for input fields
  const handleInputChange = (index, key, value) => {
    const updatedProducts = [...purchase];
    if (key === 'productID') {
      const brandInfo = products?.find(p => p._id === value)?.BrandID;
      updatedProducts[index] = { ...updatedProducts[index], ['brandID']: brandInfo?._id };
    }
    updatedProducts[index] = { ...updatedProducts[index], [key]: value };
    setPurchase(updatedProducts);
  };

  // POST Data
  const addPurchase = () => {
    if (purchase?.length === 0) {
      toastMessage("Please add purchase", TOAST_TYPE.TYPE_ERROR)
      return;
    }

    const purchasePayload = purchase?.map((item, index) => {
      // Add each item to the submittedItems array
      if (index !== 0) {
        item.purchaseDate = purchase[0].purchaseDate
        item.warehouseID = purchase[0].warehouseID
        item.supplierName = purchase[0].supplierName
        item.referenceNo = purchase[0].referenceNo
      }
      return item
    });

    // Check if any product field is null or empty
    const hasEmptyField = purchasePayload.some(
      (p) =>
        !p?.productID ||
        !p?.quantityPurchased ||
        !p?.purchaseDate
    )

    if (hasEmptyField) {
      toastMessage("Please fill in all fields for each purchase", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}purchase/add`, {
      method: "POST",
      headers: {
        role: myLoginUser?.roleID?.name,
        requestBy: myLoginUser?._id,
        "Content-type": "application/json",
      },
      body: JSON.stringify(purchasePayload),
    })
      .then(() => {
        toastMessage("Purchase ADDED", TOAST_TYPE.TYPE_SUCCESS)
        handlePageUpdate();
        addSaleModalSetting();
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  const handleOpenBrand = () => {
    setBrandModal(true)
  };

  const handleAddForm = () => {
    setPurchase([...purchase, {
      userID: authContext.user,
      productID: "",
      quantityPurchased: "",
      purchaseDate: "",
      totalPurchaseAmount: "",
    }]);
  };

  const removeForm = (index) => {
    const updatedProducts = [...purchase];
    updatedProducts.splice(index, 1);
    setPurchase(updatedProducts);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Format month and day to have leading zeros if necessary
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                        onClick={handleAddForm}
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                      >
                        Purchase Details
                      </Dialog.Title>
                      {purchase.map((p, index) => (
                        <form key={index} action="#">
                          <div className="flex justify-between items-center mt-5">
                            <span>Purchase: {index + 1}</span>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <button
                                type="button"
                                className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                onClick={() => removeForm(index)}
                              >
                                <svg
                                  className="mr-1 -ml-1 w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="productID"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Product Name
                              </label>
                              <select
                                id="productID"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name="productID"
                                onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                              >
                                <option selected="">Select Products</option>
                                {products.map((element, index) => (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                ))}
                              </select>

                            </div>

                            <div>
                              <label
                                htmlFor="quantityPurchased"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Quantity Purchased
                              </label>
                              <input
                                type="number"
                                name="quantityPurchased"
                                id="quantityPurchased"
                                value={purchase.quantityPurchased}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="0 - 999"
                              />
                            </div>
                          </div>
                          <div className={`grid gap-4 mb-4 ${index !== 0 ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
                            <div className="w-full">
                              <label
                                htmlFor="brandID"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Brand Name
                              </label>
                              <select
                                id="brandID"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name="brandID"
                                value={purchase[index]?.brandID || ''}
                                disabled={true}
                                onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                              >
                                <option selected="">Select Brand</option>
                                {brands.map((element, index) => (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {index === 0 &&
                              <><div>
                                <label
                                  htmlFor="supplierName"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Supplier Name
                                </label>
                                <input
                                  type="text"
                                  name="supplierName"
                                  id="supplierName"
                                  value={purchase.supplierName}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.name, e.target.value)
                                  }
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Enter Supplier Name"
                                />
                              </div>

                                <div>
                                  <label
                                    htmlFor="warehouseID"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Warehouse Name
                                  </label>
                                  <select
                                    id="warehouseID"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    name="warehouseID"
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                  >
                                    <option selected="">Select Warehouse</option>
                                    {warehouses.map((element, index) => {
                                      return (
                                        <option key={element._id} value={element._id}>
                                          {element.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div></>
                            }
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            {/* <div>
                              <label
                                htmlFor="storeName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Warehouse Name
                              </label>
                              <input
                                type="text"
                                name="storeName"
                                id="storeName"
                                value={purchase.storeName}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter Warehouse Name"
                              />
                            </div> */}
                            {/* <div>
                            <label
                              htmlFor="totalPurchaseAmount"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Total Purchase Amount
                            </label>
                            <input
                              type="number"
                              name="totalPurchaseAmount"
                              id="price"
                              value={purchase.totalPurchaseAmount}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="$299"
                            />
                          </div> */}

                            {/* <div className="mt-7">
                              <Button onClick={handleOpenBrand} variant="contained" color="secondary">
                                Add Brand
                              </Button>
                            </div> */}
                            {index === 0 &&
                              <>
                                <div className="h-fit w-full">
                                  {/* <Datepicker
                              onChange={handleChange}
                              show={show}
                              setShow={handleClose}
                            /> */}
                                  <label
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    htmlFor="purchaseDate"
                                  >
                                    Purchase Date
                                  </label>
                                  <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    type="date"
                                    max={getCurrentDate()}
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    value={purchase.purchaseDate}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="referenceNo"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Reference Number
                                  </label>
                                  <input
                                    type="text"
                                    name="referenceNo"
                                    id="referenceNo"
                                    value={purchase.referenceNo}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Reference Number"
                                  />
                                </div>
                              </>
                            }
                          </div>
                          <div className="flex items-center space-x-4">
                            {/* <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            Update product
                          </button> */}
                            {/* <button
                            type="button"
                            className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          >
                            <svg
                              className="mr-1 -ml-1 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Delete
                          </button> */}

                          </div>
                        </form>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addPurchase}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addSaleModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
                {showBrandModal && (
                  <AddBrand
                    addBrandModalSetting={() => { setBrandModal(false) }}
                    handlePageUpdate={handlePageUpdate}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
