 import { useEffect, useState } from "react";
import { useCreaetCustomerMutation, useGetAlltabledataMutation, useUpdatTableStatusMutation } from "../Slice/ApiSclice/AdminApi";
import ComponentCard from "../components/common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from 'react-tooltip'
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";

function ManageTable() {
    const navigate =useNavigate()
    const header = ["Reservation Status", "Table_No", "capacity", "Table Status", "Code", "Action","Detail"];
    const [getAll] = useGetAlltabledataMutation();
    const [tableData, setTabelData] = useState([]);
    const rowPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPage = Math.ceil(tableData.length / rowPerPage);
    const [update,{isLoading}]=useUpdatTableStatusMutation()
    const [creaete]=useCreaetCustomerMutation()
    const [click,setclick]= useState(false)
    // Function to format time for display
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };
    const updatestatus = async (_id, status) => {
        try {
            if (status === "available") {
            // Generate a new code, e.g., random 6 digit number
            const generatedCode = Math.floor(100000 + Math.random() * 900000);
            
            const res = await update({ _id, status: "not available", code: generatedCode });
            const restable = await creaete({table_id:_id})
            console.log(restable)
            if (res.data?.message ) {
                toast.success(res.data.message);
            } else {
                toast.success("Table occupied with code generated");
            }
            
            setclick(prev => !prev);
            } else {
            // Clear the code on freeing the table
            const res = await update({ _id, status: "available", code: null });
            
            if (res.data?.message) {
                toast.success(res.data.message);
            } else {
                toast.success("Table cleared and code reset");
            }
            
            setclick(prev => !prev);
            }
        } catch (error) {
            toast.error("Failed to update table status");
            console.error(error);
        }
        };
   const getReservationStatus = (startTime, endTime, tableStatus) => {
  const now = new Date();
  const reservationStartTime = new Date(startTime);
  const reservationEndTime = new Date(endTime);

  // Helper function to check if reservation is today
  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // If reservation is not today, show green (no reservation today)
  if (!isSameDay(reservationStartTime, now)) {
    return {
      color: 'bg-green-500',
      tooltip: 'No reservation today'
    };
  }

  // Existing logic for reservations today
  const startTimeDifference = reservationStartTime.getTime() - now.getTime();
  const endTimeDifference = reservationEndTime.getTime() - now.getTime();
  const minutesDifferenceStart = startTimeDifference / (1000 * 60);
  const minutesDifferenceEnd = endTimeDifference / (1000 * 60);

  if (minutesDifferenceEnd < 0) {
    return {
      color: 'bg-green-500',
      tooltip: 'No reservation (already ended today)'
    };
  }

  if (minutesDifferenceStart < 0) {
    const minutesAfterStart = Math.abs(minutesDifferenceStart);
    if (tableStatus === 'available' && minutesAfterStart > 30) {
      return {
        color: 'bg-green-500',
        tooltip: 'No reservation (available and started > 30min ago)'
      };
    } else {
      return {
        color: 'bg-red-500',
        tooltip: `Reservation started ${Math.round(minutesAfterStart)} min ago (In progress)`
      };
    }
  } else if (minutesDifferenceStart <= 30) {
    return {
      color: 'bg-yellow-500',
      tooltip: `Reservation starts at ${formatTime(startTime)} (${Math.round(minutesDifferenceStart)} min remaining)`
    };
  } else {
    return {
      color: 'bg-blue-500',
      tooltip: `Reservation starts at ${formatTime(startTime)} (${Math.round(minutesDifferenceStart)} min away)`
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
        
            setTabelData(res.data.data || []);
        };
        data();
    }, [getAll,click]);

    return (
        <>
        
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
                                        // Pass start time, end time, and table status as parameters
                                        statusInfo = getReservationStatus(
                                            data.reservationData.start_time, 
                                            data.reservationData.end_time, 
                                            data.table.status
                                        );
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
                                                {data.table.code}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button disabled={isLoading} onClick={()=>updatestatus(data.table._id,data.table.status)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                                                    {data.table.status === 'available' ? 'Occupy' : 'Clear'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button disabled={data.table.status === 'available'? true:false} onClick={()=>navigate(`/manage-table/${data.table._id}`)} className={`  text-black px-3 py-1 rounded text-xs ${data.table.status === 'available'?"bg-gray-400":"bg-white hover:bg-gray-300"}`}>
                                                    View
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
        </>
    )
}

export default ManageTable