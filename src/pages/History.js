import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationDialog from "../components/ConfirmationDialog";
import moment from "moment-timezone";

function History() {
    const [history, setAllHistory] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState();
    const [dialogData, setDialogData] = useState();
    const myLoginUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchData();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

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

    const handleClose = () => {
        setOpen(false);
    };

    // Delete item
    const deleteItem = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}history/delete/${selectedHistory?._id}`,
            { method: 'delete', headers: { role: myLoginUser?.roleID?.name }, })
            .then((response) => response.json())
            .then(() => {
                setSelectedHistory()
                fetchData()
                handleClose()
            }).catch(() => {
                setSelectedHistory()
                handleClose()
            });
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center ">
            <div className=" flex flex-col gap-5 w-11/12">
                <span className="font-bold">History</span>
                {history.map((element, index) => {
                    return (
                        <div
                            className="bg-white w-50 h-fit flex flex-row justify-between gap-4 p-4 "
                            key={element._id}
                        >
                            <div className="flex flex-col gap-3 justify-between items-start">
                                {element?.description ? <span>Description: {element.description}</span> : ""}
                                {element?.notes ? <span>Notes: ${element.notes}</span> : ""}
                                {element?.productCode ? <span>ProductCode: {element.productCode}</span> : ""}
                                {/* <span>{element?.createdAt ? new Date(element?.createdAt).toLocaleString() : ""}</span> */}
                                {element?.updatedById ? <span>CreatedBy: {element.updatedById?.email}</span> : ""}
                                {element?.historyDate ? <span>HistoryDate: {
                                    // moment.tz(element.historyDate, moment.tz.guess()).format('DD-MM-YYYY HH:mm')
                                    moment(element?.historyDate).tz(moment.tz.guess()).format("DD-MM-YYYY HH:mm")
                                }</span> : ""}
                            </div>
                            {
                                myLoginUser?.roleID?.name === "SuperAdmin" &&
                                <div>
                                    {/* <Tooltip title="Delete" arrow> */}
                                    <span
                                        className="text-red-600 px-2 cursor-pointer"
                                        onClick={() => {
                                            handleClickOpen();
                                            setSelectedHistory(element)
                                            setDialogData({
                                                title: 'Are you sure want to delete?',
                                                btnSecText: 'Delete'
                                            })
                                        }}
                                    >
                                        <MdDeleteForever width={50} height={50} />
                                    </span>
                                    {/* </Tooltip> */}
                                </div>
                            }
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

export default History;
