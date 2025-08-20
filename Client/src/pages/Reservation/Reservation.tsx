import { useEffect, useState } from "react";
import { useGetReservationMutation } from "../../Slice/ApiSclice/AdminApi";
import ComponentCard from "../../components/common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

function Reservation() {
  const header = ["username", "Table_No", "capacity", "Date", "Time", "detail"];
  const [getAll] = useGetReservationMutation();
  const [tableData, setTabelData] = useState([]);
  const rowPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const statusFilters = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
  ];
  
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('upcoming');

  const filterByStatus = (data, status) => {
    const now = new Date();
    
    switch(status) {
      case 'all':
        return data;
      
      case 'upcoming':
        return data.filter(item => new Date(item.start_time) > now);
      
      case 'completed':
        return data.filter(item => new Date(item.start_time) <= now);
      
      default:
        return data;
    }
  };

  // Apply filter first, then calculate pagination
  const filteredData = filterByStatus(tableData, selectedStatus);
  const totalPage = Math.ceil(filteredData.length / rowPerPage);
  
  const pageData = filteredData.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  const handleClick = (page) => {
    setCurrentPage(page);
  };

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
    if (Array.isArray(res.data)) {
      setTabelData(res.data);
    } else if (res.data && Array.isArray(res.data.data)) {
      // Sometimes data is nested in a 'data' field
      setTabelData(res.data.data);
    } else {
      // fallback to empty array if data structure is unexpected
      setTabelData([]);
    }
  };
  data();
}, [getAll]);



  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  // No Data Component
  const NoDataMessage = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
          <svg
            className="h-10 w-10 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Reservations Found
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {selectedStatus === 'all' 
            ? "There are no reservations available at the moment." 
            : `No ${selectedStatus} reservations found. Try selecting a different filter.`}
        </p>
        
        {/* Action Button (Optional) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setSelectedStatus('all')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
          >
            View All Reservations
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <ComponentCard title="Reservation Table">
        <div className="relative overflow-x-auto">
          <div className="mb-4 flex justify-end">
            <label className="block m text-sm font-medium pt-2 mr-3">
              Filter by Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              {statusFilters.map(filter => (
                <option className="dark:bg-gray-700" key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show table only if there's data */}
          {filteredData.length > 0 ? (
            <>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {header.map((header, index) => (
                      <th key={index} scope="col" className="px-6 py-3 text-center">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .map((data, index) => (
                      <tr
                        key={data._id || index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      >
                        <td className="px-6 py-4 text-center">
                          {data.user_id?.username || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.table_id?.table_No || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.table_id?.capacity || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(data.start_time).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(data.start_time).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/reservation/${data._id}`)} 
                            className="p-3 bg-blue-500 hover:bg-blue-600 rounded text-white cursor-pointer transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={handleBack}
                  disabled={currentPage === 1}
                  className={`py-1 px-2.5 rounded transition-colors ${
                    currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                {Array.from({ length: totalPage }, (_, idx) => (
                  <button
                    key={idx + 1}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                    onClick={() => handleClick(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPage}
                  className={`py-1 px-2.5 rounded transition-colors ${
                    currentPage === totalPage ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            </>
          ) : (
            /* No Data Message */
            <NoDataMessage />
          )}
        </div>
      </ComponentCard>
    </div>
  );
}

export default Reservation;