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
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
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
  const firebase = useContext(FirebaseContext)

  const uid = useSelector(state => state.authentication.user.uid)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [labels, setLabels] = useState([])
  const [subscribedLabels, setSubscribedLabels] = useState([])

  useEffect(() => {
    const init = async () => {
      await getSubscribedLabels()
      await getLabels()
      props.finishLoading()
    }
    init()
  }, [])

  const getLabels = async () => {
    let data;
    if(activeTab === 0) {
      data = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")
    } else {
      data = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")
    }

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

  const deleteLabel = async (name) => {
    let data = {
      ["list." + name] : firebase.db.app.firebase_.firestore.FieldValue.delete()
    }
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list", data)

    getLabels()
  }

  const subscribeToLabel = async (name) => {
    let data = {
      subscribedLabels: firebase.db.app.firebase_.firestore.FieldValue.arrayUnion(name)
    }
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/members/" + uid, data)

    getSubscribedLabels()
  }

  const unsubscribeToLabel = async (name) => {
    let data = {
      subscribedLabels: firebase.db.app.firebase_.firestore.FieldValue.arrayRemove(name)
    }
    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/members/" + uid, data)

    getSubscribedLabels()
  }

  let _labels = labels
  if(activeTab == 1) {
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
            <LabelCard name={"skeleton"} skeleton={true}/>
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