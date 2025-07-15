import { useEffect, useState } from "react";
import { useGetReservationMutation } from "../../Slice/ApiSclice/AdminApi";
import ComponentCard from "../../components/common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Reservation() {
  const header = ["username", "Table_No", "capacity", "Date", "Time"];
  const [getAll] = useGetReservationMutation();
  const [tableData, setTabelData] = useState([]);
  const rowPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(tableData.length / rowPerPage);
  const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];


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

  const handleClick = (page: number) => {
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
      setTabelData(res.data);
    };
    data();
  }, [getAll]);
  const filteredData = filterByStatus(pageData, selectedStatus);  
  return (
    <div className="py-6">
      <ComponentCard title="Reservation Table">
        <div className="relative overflow-x-auto">
          <div className="mb-4 flex justify-end">
          
  <label className=" block m text-sm font-medium pt-2 mr-3">
    Filter by Status:
  </label>
  <select
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {statusFilters.map(filter => (
      <option className="dark:bg-gray-700" key={filter.value} value={filter.value}>
        {filter.label}
      </option>
    ))}
  </select>
</div>
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
                filteredData
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .map((data, index) => {
              return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      >
                        <td scope="row" className="px-6 py-4 text-center">
                          <td className="px-6 py-4 text-center">
                            {data.user_id.username}
                          </td>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.table_id.table_No}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.table_id.capacity}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(data.start_time).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(data.start_time).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <></>
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={handleBack}
              disabled={currentPage == 1}
              className={`py-1 px-2.5 bg-blue-600 rounded ${
                currentPage == 1 ? "bg-gray-500" : ""
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
              disabled={currentPage == totalPage}
              className={`py-1 px-2.5 bg-blue-600 rounded ${
                currentPage == totalPage ? "bg-gray-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default Reservation;
