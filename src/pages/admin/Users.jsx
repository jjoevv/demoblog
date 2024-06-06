import React, { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button, Image, Row, Col } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
import Loading from '../../components/Loading'
import TableRender from '../../components/admin/TableRender'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFilter, faTrash, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import usePost from '../../hooks/usePost'
import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import { useNavigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'
const Users = () => {
  const navigate = useNavigate()
  const { optionsSelected, getOptionsFilter} = useSearch()
  const {
    priorityKeywords, 
    filterConferences, 
    }= useFilter()

  const {  conferences, selectOptionSort } = useConference()
  const {loading:loadingUsers, users, getAllUsers, getUserById} = useAdmin()
  const [displayUsers, setDisplayedUsers] = useState([])

  useEffect(() => {
    if(users.length === 0 || !users){
      getAllUsers()
    }
    setDisplayedUsers(users)
  }, [users])

  useEffect(()=>{
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    if(isApliedFilter){

      const filterResult = filterConferences(users, optionsSelected)
      setDisplayedUsers(filterResult)
    }
    else {
      setDisplayedUsers(users)
    }
    
  }, [optionsSelected, users, priorityKeywords])


  useEffect(() => {
    if (selectOptionSort === "Random") {
        setDisplayedUsers(conferences)
    }
    else {
        const sortedConferences = sortConferences(selectOptionSort, [...conferences])
        setDisplayedUsers(sortedConferences)
    }
}, [selectOptionSort])



  const handleChooseUser = async (id) => {
    await getUserById(id)
    navigate(`/admin/usersmanagement/userdetail/${id}`)
  }


  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({row})=>(
          <div
            title='Go to Call for paper page'
            style={{cursor: 'pointer'}}
            className='text-decoration-underline text-primary border-0 bg-transparent p-0 m-0'
            onClick={()=>handleChooseUser(row.original.id)}
          >
            {row.original.id}
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Nationality",
        accessor: "nationality",
      },
       
    ],
    []
);
  return (
    <Container
      fluid
      className='py-5 mt-5 bg-light overflow-y-auto' style={{ paddingLeft: "350px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Users management</h4>
        <ButtonGroup>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Export file
          </Button>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Setting
          </Button>
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>Total users:</label>
              <span className='me-2 fw-semibold'>{users.length}</span>
            </Col>
        
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col><InputSearch /></Col>
        
          <Col md='auto'>
       
          </Col>
        </Row>
        
        
        {
          loadingUsers ?
          <div className="my-4">
            <Loading/>
          </div>
          :
          <TableRender data={users} columns={columns}/>
        }

      </div>
      
    </Container>
  )
}

export default Users