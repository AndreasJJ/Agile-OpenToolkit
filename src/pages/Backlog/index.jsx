import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import {FirebaseContext, GetDocuments, GetDocument} from '../../sharedComponents/Firebase';

import { getPrettyCreationDate, FsTsToDate } from '../../sharedComponents/Utility';

import Modal from '../../sharedComponents/Modal';
import { Issue } from './components/Issue';
import { CreateIssue } from '../../sharedComponents/CreateIssue';
import Select from '../../sharedComponents/Select';

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
  height: 90px;
  min-height: 90px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  height: 100%;
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

const NewIssue = styled.button`
  width: 88px;
  height: 35px;
  max-height: 100%;
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const Search = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

const Backlog = (props) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // State
  const [loading, setLoading] = useState(true)
  const [labels, setLabels] = useState([])
  const [selectedLabel, setSelectedLabel] = useState(0)
  const [issues, setIssues] = useState(null)
  const [originalIssues, setOriginalIssues] = useState(null)
  const [activeTab, setActiveTab] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Redux state
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  // Constructor
  useEffect(() => {
    const init = async () => {
      // Stop the loading bar
      await props.finishLoading()

      // Get labels
      let docSnapshot = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")

      // Format labels data into state format and update state
      if(docSnapshot) {
        let tempArray = []
        for (const [key, value] of Object.entries(docSnapshot.list)) {
          tempArray.push({id: key, color: value.color, description: value.description})
        }
        await setLabels(tempArray)
      } else {
        await setLabels([])
      }

      await setActiveTab(0)
    }
    init()
  }, [])

  // Update stories on activeTab change
  useEffect(() => {
    const inner = async () => {
      let querySnapshot;
      // Open stories
      if(activeTab === 0) {
        querySnapshot = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/stories", [["status", "==", "OPEN"]], [["timestamp"]])
      // Closed stories
      }else if(activeTab === 1) {
        querySnapshot = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/stories", [["status", "==", "CLOSED"]], [["timestamp"]])
      // All stories
      } else if (activeTab === 2) {
        querySnapshot = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/stories", null, [["timestamp"]])
      // Don't do anything
      } else {
        return
      }
      // Update originalIssues with issues
      let newIssues = querySnapshot.filter((doc) => doc.id != "--STATS--")
      await setOriginalIssues(newIssues)
    }
    inner()
  },[activeTab])

  // Run filter function on originalIssues or selectedLabel change
  useEffect(() => {
    filterIssues()
  }, [originalIssues, selectedLabel])

  // Set loading false when issues state is changed
  useEffect(() => {
    if(issues) {
      setLoading(false)
    }
  }, [issues])

  // Issues filter function
  const filterIssues = async () => {
    // If the selectedLabel is the placeholder then set issues equal to originalIssues
    if(selectedLabel == 0) {
      await setIssues(originalIssues)
    // Else filter over originalIssues and keep the ones that includes any of the selected labels
    } else {
      let filtered = originalIssues.filter((issue) => {
        if(!issue.labels) { return }
        if(Object.keys(issue.labels).includes(labels[selectedLabel-1].id)) {
          return issue
        }
      })
      await setIssues(filtered)
    }
  }

  const onLabelSelectChange = async (e) => {
    setSelectedLabel(e.target.value)
  }

  const tabClicked = (e) => {
    setActiveTab(parseInt(e.target.dataset.index))
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <Wrapper>
      {
        showModal
        ?
          <Modal content={<CreateIssue 
                 exit={closeModal} 
                 finished={() => {let _activeTab = activeTab; setActiveTab(null); setActiveTab(_activeTab);}} />} 
                 minWidth={"800px"} 
                 exitModalCallback={closeModal} 
          />
        :
          null
      }
      <Content>
        <Header> 
          <Controls> 
            <StateTabs> 
              <Tab activeIndex={activeTab} index={0} data-index={0} onClick={tabClicked}>
                Open
              </Tab>
              <Tab activeIndex={activeTab} index={1} data-index={1} onClick={tabClicked}>
                Closed
              </Tab>
              <Tab activeIndex={activeTab} index={2} data-index={2} onClick={tabClicked}>
                All
              </Tab>
            </StateTabs>
            <NewIssue onClick={(e) => {setShowModal(true)}}>
              New Issue
            </NewIssue>
          </Controls>
          <Search> 
            <SearchInput placeholder="Search..." />
            <Select styling="height: 100%; width: 200px; margin-left: 10px;" placeholderText="Select label" list={labels} value={selectedLabel} onChange={onLabelSelectChange} textName="id" keyName="id" />
          </Search>
        </Header>
        <Body> 
          {
            loading
            ?
              (["skeletonIssue1", 
                "skeletonIssue2", 
                "skeletonIssue3", 
                "skeletonIssue4", 
                "skeletonIssue5", 
                "skeletonIssue6",
                "skeletonIssue7",
                "skeletonIssue8",
                "skeletonIssue9",
                "skeletonIssue10",
                "skeletonIssue11",
                "skeletonIssue12",
                "skeletonIssue13",
                "skeletonIssue14",
                "skeletonIssue15"]).map((key, index) => 
                  <Issue skeleton={true} 
                         key={key} 
                         getTasks={() => false} 
                         id={""} 
                         title={"This is a skeleton title"} 
                         number={0} 
                         creationDate={getPrettyCreationDate(new Date())} 
                         creator={"god himself"} 
                         updated={getPrettyCreationDate(new Date())} 
                         status={"OPEN"} />
                )
            :
              issues && issues.map((issue, index) => 
                  <Issue skeleton={false} 
                         key={issue.id} 
                         issueId={issue.id} 
                         productId={products[selectedProduct].id}
                         title={issue.title} 
                         number={issue.number} 
                         creationDate={getPrettyCreationDate(FsTsToDate(issue.timestamp))} 
                         creator={issue.creator ? issue.creator.firstname.charAt(0).toUpperCase() + issue.creator.firstname.slice(1) + " " + issue.creator.lastname : ""} 
                         updated={getPrettyCreationDate(FsTsToDate(issue.lastUpdateTimestamp))} 
                         status={issue.status} />
                )
          }
        </Body>
      </Content>
    </Wrapper>
  );
}

Backlog.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
  Backlog
}