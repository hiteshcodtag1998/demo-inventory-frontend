import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import AddWriteOffDetails from "../components/AddWriteOff";
import { FaDownload } from "react-icons/fa6";
import axios from "axios";

function WriteOffDetails() {
    const [showPurchaseModal, setPurchaseModal] = useState(false);
    const [purchase, setAllPurchaseData] = useState([]);
    const [brands, setAllBrands] = useState([]);
    const [products, setAllProducts] = useState([]);
    const [updatePage, setUpdatePage] = useState(true);
    const myLoginUser = JSON.parse(localStorage.getItem("user"));

    const authContext = useContext(AuthContext);

    useEffect(() => {
        fetchPurchaseData();
        fetchProductsData();
        fetchBrandData();
    }, [updatePage]);

    // Fetching Data of All Purchase items
    const fetchPurchaseData = () => {
        fetch(`http://localhost:4000/api/writeoff/get`, {
            headers: { role: myLoginUser?.roleID?.name }
        })
            .then((response) => response.json())
            .then((data) => {
                setAllPurchaseData(data);
            })
            .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
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

    // Fetching Data of All Products
    const fetchProductsData = () => {
        fetch(`http://localhost:4000/api/product/get`, {
            headers: { role: myLoginUser?.roleID?.name }
        })
            .then((response) => response.json())
            .then((data) => {
                setAllProducts(data);
            })
            .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
    };

    // Modal for Sale Add
    const addSaleModalSetting = () => {
        setPurchaseModal(!showPurchaseModal);
    };


    // Handle Page Update
    const handlePageUpdate = () => {
        setUpdatePage(!updatePage);
    };

    const handleDownload = async (data) => {
        try {
            const response = await axios.post('http://localhost:4000/api/writeoff/writeOff-pdf-download', data, {
                responseType: 'arraybuffer',
            });
            console.log('response', response)
            // Assuming the server returns the PDF content as a blob
            // setPdfData(new Blob([response.data], { type: 'application/pdf' }));

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.open(url, '_blank');
            // window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log('Error', error)
        }
    }

    return (
        <div className="col-span-12 lg:col-span-10  flex justify-center">
            <div className=" flex flex-col gap-5 w-11/12">
                {showPurchaseModal && (
                    <AddWriteOffDetails
                        addSaleModalSetting={addSaleModalSetting}
                        products={products}
                        brands={brands}
                        handlePageUpdate={handlePageUpdate}
                        authContext={authContext}
                    />
                )}
                {/* Table  */}
                <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
                    <div className="flex justify-between pt-5 pb-3 px-3">
                        <div className="flex gap-4 justify-center items-center ">
                            <span className="font-bold">WriteOff Details</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                                onClick={addSaleModalSetting}
                            >
                                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                                Add WriteOff
                            </button>
                        </div>
                    </div>
                    <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                        <thead>
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Product Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Stock WriteOff
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Supplier Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Store Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    Brand Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                    WriteOff Date
                                </th>
                                <th className="whitespace-nowrap text-left font-medium text-gray-900">
                                    Action
                                </th>
                                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Purchase Amount
                </th> */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {
                                purchase?.length === 0 && <div
                                    className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                                >
                                    <div className="flex flex-col gap-3 justify-between items-start">
                                        <span>No data found</span>
                                    </div>
                                </div>
                            }
                            {purchase.map((element, index) => {
                                return (
                                    <tr key={element._id}>
                                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                            {element.ProductID?.name || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {element.StockSold}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                            {element?.SupplierName || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                            {element?.StoreName || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                            {element?.BrandID?.name || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {new Date(element.SaleDate).toLocaleDateString() ==
                                                new Date().toLocaleDateString()
                                                ? "Today"
                                                : element.SaleDate}
                                        </td>
                                        <td>
                                            <span
                                                className="text-green-700 px-2 "

                                            >
                                                <FaDownload className="cursor-pointer" onClick={() => handleDownload(element)} />
                                            </span>
                                        </td>
                                        {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.TotalPurchaseAmount}
                    </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WriteOffDetails;
