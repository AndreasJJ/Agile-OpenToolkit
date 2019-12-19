import React, {useState, useEffect, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocument, UpdateDocument } from '../../sharedComponents/Firebase';

import Modal from '../../sharedComponents/Modal';
import { CreateLabel } from './components/CreateLabel';

import LabelCard from './components/LabelCard';

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
  background-color: #ffffff;
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
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const List = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

const Labels = (props) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // Redux state
  const uid = useSelector(state => state.authentication.user.uid)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  // State
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [labels, setLabels] = useState([])
  const [subscribedLabels, setSubscribedLabels] = useState([])

  // Constructor
  useEffect(() => {
    const init = async () => {
      // Get subscribed labels and all labels
      await getSubscribedLabels()
      await getLabels()
      props.finishLoading()
    }
    init()
  }, [])

  // Get all labels
  const getLabels = async () => {
    // Get labels from firestore
    let data;
    if(activeTab === 0) {
      data = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")
    } else {
      data = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")
    }

    // Reformat lables into the correct format
    if(data) {
      let tempArray = []
      for (const [key, value] of Object.entries(data.list)) {
        tempArray.push([key, value])
      }

      setLabels(tempArray)
      setLoading(false)
    } else {
      setLabels([])
      setLoading(false)
    }
  }

  // Get subscribed labels and update state
  const getSubscribedLabels = async () => {
    let memberInfo = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/members/" + uid)

    setSubscribedLabels(memberInfo.subscribedLabels)
  }

  const tabClicked = (e) => {
    setActiveTab(parseInt(e.target.dataset.index))
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // Delete label and get all labels again
  const deleteLabel = async (name) => {
    // Set the array element equal to fieldvalue delete to delete only the given element
    let data = {
      ["list." + name] : firebase.db.app.firebase_.firestore.FieldValue.delete()
    }
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list", data)

    getLabels()
  }

  // Subscribe to given label (given by name)
  const subscribeToLabel = async (name) => {
    // label to subscribe to
    let data = {
      subscribedLabels: firebase.db.app.firebase_.firestore.FieldValue.arrayUnion(name)
    }
    // Update subscribed labels
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/members/" + uid, data)

    getSubscribedLabels()
  }

  // Unsubscribe to given label (given by name)
  const unsubscribeToLabel = async (name) => {
    // Label to unsubscribe
    let data = {
      subscribedLabels: firebase.db.app.firebase_.firestore.FieldValue.arrayRemove(name)
    }
    // Update subscribed labels
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/members/" + uid, data)

    getSubscribedLabels()
  }

  // Set labels depending on which tab is active
  let _labels = labels
  if(activeTab == 1) {
     // Filter labels to only contain subscribed labels
    _labels = labels.filter((label) => subscribedLabels.indexOf(label[0]) > -1)
  }

  return (
    <Wrapper>
    {
      showModal
      ?
        <Modal content={<CreateLabel 
                          exit={closeModal}
                          finished={getLabels}
                        />
                        } 
               minWidth={"500px"} 
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
                All
              </Tab>
              <Tab activeIndex={activeTab} index={1} data-index={1} onClick={tabClicked}>
                Subscribed
              </Tab>
            </StateTabs>
            <NewIssue onClick={(e) => setShowModal(true)}>
              New Label
            </NewIssue>
          </Controls>
        </Header>
        <List>
        {
          loading
          ?
            (["skeletonLabel", 
            "skeletonLabel", 
            "skeletonLabel", 
            "skeletonLabel", 
            "skeletonLabel", 
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel",
            "skeletonLabel"]).map((key, index) => 
              <LabelCard name={key} skeleton={true}/>
            )
          :
            _labels && _labels.map((label, index) =>
              <LabelCard key={label[0]} 
                         name={label[0]} 
                         description={label[1].description} 
                         bgc={label[1].color}
                         subscribed={subscribedLabels ? subscribedLabels.indexOf(label[0]) > -1 : false}
                         subscribe={subscribeToLabel}
                         unsubscribe={unsubscribeToLabel}
                         deleteLabel={deleteLabel}
               />
            )
        }
        </List>
      </Content>
    </Wrapper>
  );
}

Labels.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export { Labels };