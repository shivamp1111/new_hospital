import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors, getDoctosData } = useContext(AppContext)

  // Refresh doctors data when page loads
  useEffect(() => {
    getDoctosData()
  }, [])

  useEffect(() => {
    console.log('Doctors page - Total doctors:', doctors?.length || 0)
    console.log('Doctors page - Speciality filter:', speciality || 'none')
    
    if (!doctors || doctors.length === 0) {
      console.log('Doctors page - No doctors available')
      setFilterDoc([])
      return
    }
    
    if (speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality)
      console.log('Doctors page - Filtered doctors:', filtered.length)
      setFilterDoc(filtered)
    } else {
      console.log('Doctors page - Showing all doctors:', doctors.length)
      setFilterDoc(doctors)
    }
  }, [doctors, speciality])

  return (
    <div>
      <div className='my-8'>
        <h1 className='text-3xl font-medium text-[#262626] mb-2'>All Doctors</h1>
        <p className='text-gray-600'>Browse through the doctors specialist.</p>
      </div>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p>
        </div>
        {filterDoc && filterDoc.length > 0 ? (
          <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
            {filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                  </div>
                  <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full flex flex-col items-center gap-4 pt-10'>
            <p className='text-gray-500 text-center'>
              {doctors === null || doctors === undefined
                ? 'Loading doctors...'
                : doctors.length === 0 
                  ? 'No doctors available at the moment. Please add doctors through the admin panel.' 
                  : speciality 
                    ? `No doctors found for "${speciality}" speciality.` 
                    : 'No doctors to display.'}
            </p>
            {doctors && doctors.length === 0 && (
              <button 
                onClick={() => getDoctosData()} 
                className='mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all'
              >
                Refresh
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors