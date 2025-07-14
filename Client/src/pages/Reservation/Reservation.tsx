import { useEffect, useState } from "react";
import { useGetReservationMutation } from "../../Slice/ApiSclice/AdminApi";
import ComponentCard from "../../components/common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";



function Reservation() {
    const header = ["photo", "Name", "Price", "Type", "Avaliable", "action"];
      const [getAll] = useGetReservationMutation();
      const [tableData, setTabelData] = useState([]);
      const rowPerPage = 10;
      const [currentPage, setCurrentPage] = useState(1);
      const totalPage = Math.ceil(tableData.length / rowPerPage);

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
        console.log(res)
        setTabelData(res.data);
      };
      data();
    }, [getAll]);
  return (
    <div className="py-6">
      <ComponentCard title="Reservation Table">
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
                              return (
                                <tr
                                  key={index}
                                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                >
                                  <td scope="row" className="px-6 py-4 text-center">
                                    <img className="w-20 h-20 overflow-hidden" src={data.image} alt="" />
                                  </td>
                                  <td className="px-6 py-4 text-center">{data.name}</td>
                                  <td className="px-6 py-4 text-center">{data.price}</td>
                                  <td className="px-6 py-4 text-center">{data.type}</td>
            
                                  
                                  
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
  )
}

export default Reservation