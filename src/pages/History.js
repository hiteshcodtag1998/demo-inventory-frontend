import React, { useState, useEffect } from "react";

function History() {
    const [history, setAllHistory] = useState([]);
    const myLoginUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchData();
    }, []);

    // Fetching all history data
    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}history/get`,
            {
                headers: { role: myLoginUser?.roleID?.name, requestBy: myLoginUser?._id, }
            })
            .then((response) => response.json())
            .then((data) => {
                setAllHistory(data);
            });
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center ">
            <div className=" flex flex-col gap-5 w-11/12">
                <span className="font-bold">History</span>
                {history.map((element, index) => {
                    return (
                        <div
                            className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                            key={element._id}
                        >
                            <div className="flex flex-col gap-3 justify-between items-start">
                                {element?.description ? <span>Description: {element.description}</span> : ""}
                                {element?.notes ? <span>Notes: ${element.notes}</span> : ""}
                                {element?.productCode ? <span>ProductCode: {element.productCode}</span> : ""}
                                <span>{element?.createdAt ? new Date(element?.createdAt).toLocaleString() : ""}</span>
                                {element?.updatedById ? <span>CreatedBy: {element.updatedById?.email}</span> : ""}
                            </div>
                        </div>
                    );
                })}
                {
                    history?.length === 0 && <div
                        className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                    >
                        <div className="flex flex-col gap-3 justify-between items-start">
                            <span>No data found</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default History;
