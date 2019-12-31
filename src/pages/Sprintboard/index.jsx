import React, {useState, useEffect, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocuments } from '../../sharedComponents/Firebase';

import { Board } from './components/Board';
import { InfoPage } from './components/InfoPage';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const ListWrapper = styled.div`
  width: 272px;
  min-width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
`;

const Sprintboard = ({finishLoading}) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // State
  const [loading, setLoading] = useState(true)
  const [sprint, setSprint] = useState(null)
  const [showSprint, setShowSprint] = useState(true)

  // Redux state
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  // Constructor
  useEffect(() => {
    const init = async () => {
      await getCurrentSprint()
      await setLoading(false)
      await finishLoading()
    }
    init()
  }, [])

  // Get most current sprint
  const getCurrentSprint = async () => {
    // Get the sprint with the earliest startDate, but while the dueDate is later than NOW
    let sprint = await GetDocuments(firebase, 
                                    "/products/" + products[selectedProduct].id + "/sprints", 
                                    [['dueDate', '>=', new Date()]], 
                                    [['dueDate', 'asc'], ['startDate', 'asc']], null, null, null, null, 1)
    // If a sprint that follows the constrains exists then update the state with it
    if(sprint.length > 0) {
      sprint = sprint[0]
      setSprint(sprint.id)
    } else {
      setShowSprint(false)
    }
    // Else if it doesnt exist then TODO              
  }

  const getAndShowSelectedSprint = async (sprintId) => {
    setSprint(sprintId)
    setShowSprint(true)
  }

  // Function to toggle if the info page or sprintpage should be shown
  const toggleInfoPage = () => {
    setShowSprint(!showSprint)
  }

  return (
    <Wrapper>
      {
        !loading
        ?
          sprint && showSprint
          ?
            <Board productId={products[selectedProduct].id} sprintId={sprint} toggleInfoPage={toggleInfoPage} />
          :
            <InfoPage getAndShowSelectedSprint={getAndShowSelectedSprint} />
        :
          null
      }
    </Wrapper>
  );
}

Sprintboard.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export { 
  Sprintboard 
} 