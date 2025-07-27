import { useParams } from "react-router"
import ComponentCard from "../../components/common/ComponentCard"
import { useGetDetailDataQuery } from "../../Slice/api"
  // Change to Query

function Detail() {
    const { id } = useParams()
    
    // Use the query hook, not mutation hook
    const { data, isLoading, error } = useGetDetailDataQuery(id, {
        skip: !id  // Skip the query if no ID
    })

    console.log('ID:', id)
    console.log('Data:', data)
    console.log('Loading:', isLoading)
    console.log('Error:', error)

    if (isLoading) {
        return (
            <div className="py-6">
                <ComponentCard title="Reservation Detail">
                    <div>Loading reservation details...</div>
                </ComponentCard>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-6">
                <ComponentCard title="Reservation Detail">
                    <div className="text-red-500">
                        Error: {error.status} - {error.data?.message || 'Failed to load data'}
                    </div>
                </ComponentCard>
            </div>
        )
    }

    return (
        <div className="py-6">
            <ComponentCard title="Reservation Detail">
                {data?.success ? (
                    <div>
                        <h2>Reservation Found!</h2>
                        <pre>{JSON.stringify(data.data, null, 2)}</pre>
                    </div>
                ) : (
                    <div>No reservation data found</div>
                )}
            </ComponentCard>
        </div>
    )
}

export default Detail