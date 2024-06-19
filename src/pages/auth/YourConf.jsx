import { useEffect, useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference/Conference'
import useLocalStorage from '../../hooks/useLocalStorage'

import SuccessfulModal from '../../components/Modals/SuccessModal'
import { checkExistValue } from '../../utils/checkFetchedResults'

import useSearch from '../../hooks/useSearch'
import useFilter from '../../hooks/useFilter'
import Loading from '../../components/Loading'
import Filter from '../../components/Filter/Filter'
import useSessionStorage from '../../hooks/useSessionStorage'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { optionsSelected, getOptionsFilter } = useSearch()
  const { loading: loadingPost, postedConferences, getPostedConferences } = usePost()
  const { filterConferences } = useFilter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useLocalStorage()
  const { getDataListInStorage } = useSessionStorage()
  const [loading, setLoading] = useState(false)

  const [displayConferences, setDisplayConferences] = useState(postedConferences)
  const [totalConferences, setTotalConferences] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      await getOptionsFilter("", [])
      await getPostedConferences()
      setLoading(false)
    }
    fetchData()
    setDisplayConferences(postedConferences)
  }, [])

  useEffect(() => {
    if (!postedConferences) {
      getPostedConferences()
    }
  }, [user])

  useEffect(() => {
    setDisplayConferences(postedConferences)
  }, [postedConferences])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(postedConferences, optionsSelected)
      setDisplayConferences(filterResult)
      setTotalConferences(filterResult.length)
      setTotalPages(Math.ceil(filterResult.length / 7))

    }
    else {
      const totalConfLS = getDataListInStorage('totalConfPost')
      const totalPagesLS = getDataListInStorage('totalPagesPost')
      setTotalConferences(totalConfLS)
      setTotalPages(Math.ceil(totalPagesLS))
      setDisplayConferences(postedConferences)
    }
    // Tạo query string 
    const queryString = Object.entries(optionsSelected)
      .filter(([, values]) => values.length > 0)
      .map(([key, values]) => `${key}=${values.join(',')}`)
      .join('&');
    // Lấy phần hash của URL nếu có
    const { hash, pathname } = window.location;
    const newUrl = queryString ? `${pathname}${hash}?${queryString}` : `${pathname}${hash}`;

    // Cập nhật URL
    window.history.pushState({}, '', newUrl);
  }, [optionsSelected, postedConferences])

  const handleCheckStatus = (status, messageSuccess) => {
    setMessage(messageSuccess)
    if (status) {
      setShowAddForm(false);
      setShowSuccess(true)

    }
  }

  const handleClose = () => setShowAddForm(false);
  const handleShow = () => setShowAddForm(true);

  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>

      <div className='d-flex align-items-center justify-content-between pe-5 mb-4'>
        <h4 className='mb-2'>Your conferences</h4>
        <Button
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3'
          onClick={handleShow}>
          <Image width={20} height={20} className='me-2' src={editIcon} />
          Add
        </Button>
      </div>
      <AddConference show={showAddForm} handleClose={handleClose} handleCheckStatus={handleCheckStatus} onReloadList={getPostedConferences} />
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClose={() => setShowSuccess(false)} />}
      {
        loading && loadingPost ?
          <div className='mt-5'>
            <Loading onReload={getPostedConferences} />
          </div>
          :
          <>
            {
              postedConferences && postedConferences.length > 0 && !loadingPost ?
                <>
                  <Filter />
                  <Conference
                    conferencesProp={displayConferences}
                    onReloadPage={getPostedConferences}
                    totalPages={totalPages}
                    totalConferences={totalConferences}
                    loading={loadingPost}
                    isPost={true}
                  />
                </>
                : <p>No conferences available.</p>
            }
          </>
      }

    </Container>
  )
}

export default YourConf