import { useEffect, useState } from "react";
import { useGetAlltabledataMutation } from "../Slice/ApiSclice/AdminApi";
import ComponentCard from "../components/common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from 'react-tooltip'

function ManageTable() {
    const header = ["Reservation Status", "Table_No", "capacity", "Table Status", "Action"];
    const [getAll] = useGetAlltabledataMutation();
    const [tableData, setTabelData] = useState([]);
    const rowPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPage = Math.ceil(tableData.length / rowPerPage);

    // Function to format time for display
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getReservationStatus = (startTime) => {
        const now = new Date();
        const reservationTime = new Date(startTime);
        const timeDifference = reservationTime.getTime() - now.getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        
        if (minutesDifference < 0) {
            // Reservation time has passed (started) - RED
            return {
                color: 'bg-red-500',
                tooltip: `Reservation started at ${formatTime(startTime)} (${Math.abs(Math.round(minutesDifference))} min ago)`
            };
        } else if (minutesDifference <= 30) {
            // Reservation is within 30 minutes - YELLOW
            return {
                color: 'bg-yellow-500',
                tooltip: `Reservation at ${formatTime(startTime)} (${Math.round(minutesDifference)} min remaining)`
            };
        } else {
            // Reservation is more than 30 minutes away - BLUE
            return {
                color: 'bg-blue-500',
                tooltip: `Reservation at ${formatTime(startTime)} (${Math.round(minutesDifference)} min away)`
            };
        }
    };

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const pageData = tableData.slice(
        (currentPage - 1) * rowPerPage,
        currentPage * rowPerPage
    );

    const handleBack = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const data = async () => {
            const res = await getAll({});
            console.log(res);
            setTabelData(res.data.data || []);
        };
        data();
    }, [getAll]);

    return (
        <div className="py-6">
           
            <ComponentCard title="Table Manage">
                 <div className="mb-3 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-4">
    <span className="font-medium">Status:</span>
    <span className="flex items-center gap-1">🟢 No Reservation</span>
    <span className="flex items-center gap-1">🔵 Upcoming (30+ min)</span>
    <span className="flex items-center gap-1">🟡 Starting Soon (≤30 min)</span>
    <span className="flex items-center gap-1">🔴 In Progress</span>
</div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {header.length &&
                                    header.map((header, index) => {
                                        return (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                            >
                                                {header}
                                            </th>
                                        );
                                    })}
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.length ? (
                                pageData.map((data, index) => {
                                    // Determine reservation status and color
                                    let statusInfo = { color: 'bg-green-500', tooltip: 'No reservation' };
                                    
                                    if (data.reservationData && data.reservationData.start_time) {
                                        statusInfo = getReservationStatus(data.reservationData.start_time);
                                    }

                                    return (
                                        <tr
                                            key={index}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                        >
                                            <td className="px-6 py-4 text-center">
                                                <div 
                                                    data-tooltip-id={`reservation-tooltip-${index}`}
                                                    data-tooltip-content={statusInfo.tooltip}
                                                    className={`w-4 h-4 rounded-full ${statusInfo.color} mx-auto cursor-pointer`}
                                                ></div>
                                                <Tooltip id={`reservation-tooltip-${index}`} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {data.table.table_No}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {data.table.capacity}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {data.table.status === 'available' ? 
                                                    <div className="border-2 border-green-600 rounded-2xl text-center w-23 bg-green-200 dark:text-white dark:bg-green-950 mx-auto p-1">
                                                        {data.table.status}
                                                    </div> 
                                                    : 
                                                    <div className="border-2 border-red-600 rounded-2xl text-center w-23 bg-red-950 text-white p-1 mx-auto">
                                                        {data.table.status}
                                                    </div>
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                                                    {data.table.status === 'available' ? 'Occupy' : 'Clear'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No tables found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    <div className="mt-4 flex justify-center space-x-2">
                        <button
                            onClick={handleBack}
                            disabled={currentPage === 1}
                            className={`py-1 px-2.5 bg-blue-600 rounded ${
                                currentPage === 1 ? "bg-gray-500" : ""
                            }`}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                        {Array.from({ length: totalPage }, (_, idx) => (
                            <button
                                key={idx + 1}
                                className={`px-3 py-1 rounded ${
                                    currentPage === idx + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                                onClick={() => handleClick(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPage}
                            className={`py-1 px-2.5 bg-blue-600 rounded ${
                                currentPage === totalPage ? "bg-gray-500" : ""
                            }`}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>
                </div>
            </ComponentCard>
        </div>
    )
}

export default ManageTable