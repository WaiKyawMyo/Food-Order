import { useEffect, useState } from "react"

import { useGetDiscountMutation } from "../../Slice/ApiSclice/AdminApi"
import ComponentCard from "../../components/common/ComponentCard"



function ShowDiscount() {
    const header = ["Name", "Persent", "status"]
    const [getall] = useGetDiscountMutation()
    const [tableData, setTabelData] = useState([])

   useEffect(() => {
  const data = async () => {
    const res = await getall({})
    
    
    console.log('Is array?', Array.isArray(res.data.response)) // 🔍 Verify it's an array
    console.log('Is array?',res.data.response )
    
      setTabelData(res.data.response)
    
  }
  data()
}, [getall,tableData])
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
              { tableData.map((data,index) => {
                return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <td scope="row" className="px-6 py-4 text-center">
                    {data.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {data.persent}%
                  </td>
                
                  <td className="px-6 py-2 ">
                     {data.status ? <div className="border-2 border-green-600 rounded-2xl text-center w-23 bg-green-200 dark:text-white dark:bg-green-950 mx-auto p-1">
                      Active
                    </div> : <div className="border-2 border-red-600 rounded-2xl text-center w-23 bg-red-950 text-white p-1 mx-auto">
                       Not Active
                    </div>}
                   
                  </td>
                   
                </tr>
              })

              }
            </tbody>
          </table>

          
          
        </div>

      </ComponentCard>
    </div>
  )
}

export default ShowDiscount