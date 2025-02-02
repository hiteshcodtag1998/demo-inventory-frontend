import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import DatePicker from 'react-datepicker';
import moment from "moment";

export default function UpdateSale({
    brands,
    products,
    authContext,
    updateSaleData,
    updateModalSetting,
    fetchSalesData,
    warehouses
}) {
    const { _id, SaleDate, ProductID, BrandID, totalPurchaseAmount, SupplierName, referenceNo, StockSold, warehouseID } = updateSaleData;
    const myLoginUser = JSON.parse(localStorage.getItem("user"));
    const [sale, setSale] = useState({
        saleID: _id,
        userID: authContext.user,
        productID: ProductID?._id,
        stockSold: StockSold,
        saleDate: SaleDate,
        brandID: BrandID?._id,
        totalPurchaseAmount,
        supplierName: SupplierName,
        warehouseID: warehouseID?._id,
        referenceNo
    });
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);

    // Handling Input Change for input fields
    const handleInputChange = (key, value) => {
        setSale({ ...sale, [key]: value });
    };

    // POST Data
    const updateSale = () => {
        if (!sale.productID || !sale.stockSold || !sale.saleDate) {
            toastMessage("Please fill in all fields for each sale", TOAST_TYPE.TYPE_ERROR);
            return;
        }

        if (sale?.saleDate) {
            sale.saleDate = moment(new Date(sale.saleDate)).format('YYYY-MM-DD HH:mm')
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}sales/update`, {
            method: "POST",
            headers: {
                role: myLoginUser?.roleID?.name,
                requestBy: myLoginUser?._id,
                "Content-type": "application/json",
            },
            body: JSON.stringify(sale),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json(); // Assuming the error response is in JSON format
                    throw new Error(errorData.message || errorData.error || "Something went wrong on the server");
                }

                toastMessage("Sale UPDATED", TOAST_TYPE.TYPE_SUCCESS)
                fetchSalesData();
                updateModalSetting();
            })
            .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
    };

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

                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                                            >
                                                Sale Details
                                            </Dialog.Title>
                                            <form action="#">

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
                                                            value={sale.productID}
                                                            disabled={true}
                                                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
                                                            htmlFor="brandID"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Brand Name
                                                        </label>
                                                        <select
                                                            id="brandID"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            name="brandID"
                                                            value={sale?.brandID || ''}
                                                            disabled={true}
                                                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                                        >
                                                            <option selected="">Select Brand</option>
                                                            {brands.map((element, index) => (
                                                                <option key={element._id} value={element._id}>
                                                                    {element.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="stockSold"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Stock Sold
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="stockSold"
                                                            id="stockSold"
                                                            value={sale.stockSold}
                                                            disabled={![ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(myLoginUser?.roleID?.name)}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="0 - 999"
                                                        />
                                                    </div>
                                                    <div>
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
                                                            value={sale.supplierName}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
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
                                                            disabled={true}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            value={sale.warehouseID}
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
                                                    </div>

                                                    <div className="h-fit w-full">

                                                        <label
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            htmlFor="saleDate"
                                                        >
                                                            Sales Date
                                                        </label>
                                                        <DatePicker
                                                            dateFormat="dd-MM-yyyy HH:mm"
                                                            selected={sale?.saleDate ? new Date(sale.saleDate) : ""}
                                                            placeholderText="dd-mm-yyyy"
                                                            maxDate={new Date()}
                                                            showTimeSelect
                                                            disabled={![ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(myLoginUser?.roleID?.name)}
                                                            timeIntervals={1}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            onChange={(date) => {
                                                                handleInputChange('saleDate', date)
                                                            }}
                                                        />
                                                        {/* <input
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            type="date"
                                                            id="saleDate"
                                                            name="saleDate"
                                                            value={sale.saleDate}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                        /> */}
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
                                                            value={sale.referenceNo}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Enter Reference Number"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">


                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        onClick={updateSale}
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => updateModalSetting()}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
