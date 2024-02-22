import React, { useState, useEffect } from "react";
import AddStore from "../components/AddStore";
import AddWarehouse from "../components/AddWarehouse";

function Warehouse() {
    const [showModal, setShowModal] = useState(false);
    const [warehouse, setAllWarehouse] = useState([]);
    const [added, setAdded] = useState();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [added === true]);

    useEffect(() => {
        if (!showModal)
            setAdded(false)
    }, [showModal]);

    // Fetching all warehouse data
    const fetchData = () => {
        fetch(`http://localhost:4000/api/warehouse/get`)
            .then((response) => response.json())
            .then((data) => {
                setAllWarehouse(data);
            });
    };

    const modalSetting = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center ">
            <div className=" flex flex-col gap-5 w-11/12 border-2">
                <div className="flex justify-between">
                    <span className="font-bold">Manage Warehouse</span>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                        onClick={modalSetting}
                    >
                        Add Warehouse
                    </button>
                </div>
                {showModal && <AddWarehouse setAdded={setAdded} />}
                {
                    warehouse?.length === 0 && <div
                        className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                    >
                        <div className="flex flex-col gap-3 justify-between items-start">
                            <span>No data found</span>
                        </div>
                    </div>
                }
                {warehouse.map((element, index) => {
                    return (
                        <div
                            className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                            key={element._id}
                        >
                            <div>
                                {
                                    element?.image && <img
                                        alt="store"
                                        className="h-60 w-full object-cover"
                                        src={element.image}
                                    />
                                }

                            </div>
                            <div className="flex flex-col gap-3 justify-between items-start">
                                <span className="font-bold">{element.name}</span>
                                <div className="flex">
                                    <img
                                        alt="location-icon"
                                        className="h-6 w-6"
                                        src={require("../assets/location-icon.png")}
                                    />
                                    <span>{element.address + ", " + element.city}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Warehouse;