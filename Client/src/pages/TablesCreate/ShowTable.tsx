
import { useEffect, useState } from "react"
import ComponentCard from "../../components/common/ComponentCard"
import {  useGetAllTableMutation } from "../../Slice/ApiSclice/AdminApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight, faPen, faTrash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

type Itable = {
  _id: string,
  table_No: number,
  capacity: number,

  status: string,
  admin_id: string
}
type Prop = {
  updateStart:(val:number,val2:number,valId:string)=>void
  delteBtn:(val:string)=>void
}

function ShowTable({updateStart,delteBtn}:Prop) {
  const header = ["table_No", "capacity", "status",'action']
  const [getall] = useGetAllTableMutation()
  const [tableData, setTabelData] = useState<Itable[]>([])
  const rowPerPage =10
  const [currentPage,setCurrentPage]= useState(1)
  const [tableNo,setTableNo]=useState<number>(0)
  const [ConformPop,SetConfirmPop]=useState(false)
  const totalPage = Math.ceil(tableData.length/rowPerPage)
  const [tableID,setTabelId]=useState('')

  const handleClick = (page:number)=>{
    setCurrentPage(page)
  }
  const pageData = tableData.slice((currentPage-1)* rowPerPage,currentPage * rowPerPage)

  const handleBack=()=>{
    if(currentPage>1) {
      setCurrentPage(prev=> prev-1)
    }
  }
  const handleNext=()=>{
    if(currentPage<totalPage){
       setCurrentPage(prev => prev+1)
    }
  }
  const close=()=>{
    SetConfirmPop(false)
    
  }
  const DeleteTable=()=>{
    SetConfirmPop(false)
    delteBtn(tableID)
  }
  const confirm=(No:number,Id:string)=>{
     setTableNo(No)
     SetConfirmPop(true)
     setTabelId(Id)
  }
  useEffect(() => {
    const data = async () => {
      const res = await getall({})
      setTabelData(res.data)
    }
    data()
  }, [getall, tableData])
  
  return (
    <div className="py-6">
      <ComponentCard title="Table">


        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {header.length && header.map((header,index) => {
                  return <th key={index} scope="col" className="px-6 py-3 text-center">
                    {header}
                  </th>
                })
                }


              </tr>
            </thead>
            <tbody>
              {pageData.length ? pageData.map((data,index) => {
                return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <td scope="row" className="px-6 py-4 text-center">
                    {data.table_No}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {data.capacity}
                  </td>
                
                  <td className="px-6 py-2 ">

                    {data.status == 'available' ? <div className="border-2 border-green-600 rounded-2xl text-center w-23 bg-green-200 dark:text-white dark:bg-green-950 mx-auto p-1">
                      {data.status}
                    </div> : <div className="border-2 border-red-600 rounded-2xl text-center w-23 bg-red-950 text-white p-1 mx-auto">
                      {data.status}
                    </div>}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="flex gap-2 items-center justify-center ">
                      <FontAwesomeIcon icon={faPen} onClick={()=>updateStart(data.table_No,data.capacity,data._id)} className="cursor-pointer hover:text-blue-500"/>
                      <div className="w-1 rounded-md h-6 bg-gray-600 dark:bg-gray-200"></div>
                      <FontAwesomeIcon icon={faTrash} onClick={()=>confirm(data.table_No,data._id)} className="cursor-pointer hover:text-red-500"/>
                      
                    </div>
                  </td>
                </tr>
              }) : <></>
              }
            </tbody>
          </table>
          {ConformPop && <div className="fixed top-30 left-2/7 rounded-md lg:left-2/5 bg-gray-500  dark:bg-gray-900 p-5">
            <div className="flex items-center ">
               < FontAwesomeIcon className="text-yellow-500 text-2xl" icon={faTriangleExclamation} /> 
              <h1 className="ml-3 text-2xl font-bold">Delete Table</h1>
            </div>
            <p className="my-2 pb-2.5">   Are you sure you want to delete Table No {tableNo}</p>
             <div className="flex gap-x-3">
                <button onClick={close} className="w-1/2 bg-white text-black rounded p-1 hover:bg-gray-200">Cancel</button>
                <button onClick={DeleteTable} className="w-1/2 bg-red-500 text-white rounded p-1 hover:bg-red-400">Delete</button>
             </div>
          </div>}
          
           <div className="mt-4 flex justify-center space-x-2">
            <button onClick={handleBack} disabled={currentPage==1} className={`py-1 px-2.5 bg-blue-600 rounded ${currentPage==1? 'bg-gray-500':""}`}>
              <FontAwesomeIcon icon={faAngleLeft}/>
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
        <button onClick={handleNext} disabled={currentPage==totalPage} className={`py-1 px-2.5 bg-blue-600 rounded ${currentPage==totalPage? 'bg-gray-500':""}`}>
              <FontAwesomeIcon icon={faAngleRight}/>
          </button>
      </div>
        </div>

      </ComponentCard>
    </div>
  )
}

export default ShowTable