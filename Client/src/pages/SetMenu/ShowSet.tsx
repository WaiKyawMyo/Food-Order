import {
  faAngleLeft,
  faAngleRight,
  faPen,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComponentCard from "../../components/common/ComponentCard";
import { useGetAllSetMutation } from "../../Slice/ApiSclice/AdminApi";
import { useEffect, useState } from "react";

export type Itable = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type Prop = {
  updateStart: (set: any) => void;
  delteBtn: (val: string) => void; // Fixed spelling
  refreshKey: number;
};

function ShowSet({ delteBtn, refreshKey, updateStart }: Prop) {
  const header = ["photo", "Name", "Price", "Contains", "action"];
  const [tableData, setTabelData] = useState<Itable[]>([]);
  const [getAll] = useGetAllSetMutation();

  const rowPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [menuId, setMenuId] = useState("");
  const [ConformPop, SetConfirmPop] = useState(false);
  const totalPage = Math.ceil(tableData.length / rowPerPage);
  const [Name, SetName] = useState("");

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
  const close = () => {
    SetConfirmPop(false);
  };

  const DeleteTable = () => {
    SetConfirmPop(false);
    delteBtn(menuId);
  };
  const confirm = (Id: string, name: string) => {
    SetName(name);
    SetConfirmPop(true);
    setMenuId(Id);
  };

  useEffect(() => {
    const data = async () => {
      const res = await getAll({});
      setTabelData(res.data);
    };
    data();
  }, [getAll, refreshKey]);
  return (
    <div className="py-6">
      <ComponentCard title="Set Table">
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
                        <img className="w-20" src={data.image} alt="" />
                      </td>
                      <td className="px-6 py-4 text-center">{data.name}</td>
                      <td className="px-6 py-4 text-center">{data.price}</td>
                      <td className="px-6 py-4 text-center">
                        {data.menus.length > 0 ? (
                          data.menus.map(
                            (item) =>
                              item.menu ? (
                                <span key={item.menu._id} className="mx-2">
                                  {item.menu.name} (x{item.unit_Quantity})
                                </span>
                              ) : null // skip if menu is missing
                          )
                        ) : (
                          <span className=" ">
                            Your selected items will appear here.
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-2 text-center">
                        <div className="flex gap-2 items-center justify-center ">
                          <FontAwesomeIcon
                            icon={faPen}
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() => updateStart(data)}
                          />
                          <div className="w-1 rounded-md h-6 bg-gray-600 dark:bg-gray-200"></div>
                          <FontAwesomeIcon
                            onClick={() => confirm(data._id, data.name)}
                            icon={faTrash}
                            className="cursor-pointer hover:text-red-500"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </table>

          {ConformPop && (
            <div className="fixed top-30 left-2/7 rounded-md lg:left-2/5 bg-gray-500  dark:bg-gray-900 p-5">
              <div className="flex items-center ">
                <FontAwesomeIcon
                  className="text-yellow-500 text-2xl"
                  icon={faTriangleExclamation}
                />
                <h1 className="ml-3 text-2xl font-bold">Delete Table</h1>
              </div>
              <p className="my-2 pb-2.5">
                {" "}
                Are you sure you want to delete {Name}
              </p>
              <div className="flex gap-x-3">
                <button
                  onClick={close}
                  className="w-1/2 bg-white text-black rounded p-1 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={DeleteTable}
                  className="w-1/2 bg-red-500 text-white rounded p-1 hover:bg-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

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

export default ShowSet;
