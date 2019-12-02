import React, {useState, useEffect, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocuments, AddDocument } from '../../sharedComponents/Firebase';

import { FsTsToDate, DateToLocalString } from '../../sharedComponents/Utility';
import Modal from '../../sharedComponents/Modal';
import CreateSprint from './components/CreateSprint';
import SprintCard from './components/SprintCard';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 800px) {
    padding: 0;
  }
`;

const Content = styled.div`
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  background-color: white;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
`

const StateTabs = styled.div`
  display: flex;
  flex-direction: row;
`

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  ${props => props.activeIndex == props.index ? "border-bottom: 2px solid #000000;" : null}
  ${props => props.activeIndex == props.index ? "font-weight: bold;" : null}

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`

const NewSprint = styled.button`
  width: 88px;
  height: 35px;
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

const Sprints = (props) => {
  const firebase = useContext(FirebaseContext)

  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActivetab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [sprints, setSprints] = useState([])

  useEffect(() => {
    const init = async () => {
      await props.finishLoading()
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    getSprints()
  }, [activeTab])

  const getSprints = async () => {
    let sprints;
    if(activeTab === 0) {
      sprints = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/sprints", [["dueDate", "<", new Date()]], [["dueDate", 'desc']])
    }else if(activeTab === 1) {
      sprints = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/sprints", [["dueDate", ">=", new Date()]], [["dueDate", 'asc']])
    } else {
      sprints = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/sprints", [["startDate", ">", new Date()]], [["startDate", 'asc']])
    }

    if(activeTab === 1) {
      sprints = sprints.filter((obj) => FsTsToDate(obj.startDate))
    } 

    setSprints(sprints)
  }

  const tabClicked = async (e) => {
    await setActivetab(parseInt(e.target.dataset.index))
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const createSprint = async (sprint) => {
    await AddDocument(firebase, "products/" + products[selectedProduct].id + "/sprints/", sprint)
    getSprints()
  }

  return (
      <Wrapper>
        {
          showModal
          ?
            <Modal content={<CreateSprint exit={closeModal} 
                                          createSprint={createSprint} />
                            } 
                    minWidth={"800px"} 
                    exitModalCallback={closeModal} />
          :
            null
        }
        <Content>
          <Header> 
            <Controls> 
              <StateTabs> 
                <Tab activeIndex={activeTab} index={0} data-index={0} onClick={tabClicked}>
                  Past
                </Tab>
                <Tab activeIndex={activeTab} index={1} data-index={1} onClick={tabClicked}>
                  Current
                </Tab>
                <Tab activeIndex={activeTab} index={2} data-index={2} onClick={tabClicked}>
                  Future
                </Tab>
              </StateTabs>
              <NewSprint onClick={(e) => {setShowModal(true)}}>
                New Sprint
              </NewSprint>
            </Controls>
          </Header>
          <Body>
            {
              loading
              ?
                <SprintCard skeleton={true} 
                            key={"skeletonSprintCard"} 
                            sprintId={""} 
                            title={"This is a skeleton sprint title"} 
                            startDate={DateToLocalString(new Date())} 
                            dueDate={DateToLocalString(new Date())} 
                            totalIssues={1} 
                            finishedIssues={0} />
              :
                sprints && sprints.map((sprint, index) =>
                  <SprintCard key={index} 
                              sprintId={sprint.id} 
                              title={sprint.title} 
                              startDate={DateToLocalString(FsTsToDate(sprint.startDate))} 
                              dueDate={DateToLocalString(FsTsToDate(sprint.dueDate))} 
                              totalIssues={sprint.totalIssues} 
                              finishedIssues={sprint.finishedIssues} />
                )
            }
          </Body>
        </Content>
      </Wrapper>
  )
}

Sprints.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export { Sprints };