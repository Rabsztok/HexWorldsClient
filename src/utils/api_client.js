import ApiClient from 'axios-api-client'

const apiUrl = process.env.REACT_APP_API_URL
const apiClient = new ApiClient({ apiUrl })

export default apiClient