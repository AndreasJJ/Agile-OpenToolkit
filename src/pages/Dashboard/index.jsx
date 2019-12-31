import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { productActions } from '../../state/actions/product';

import styled from 'styled-components';

import Header from './components/Header';
import SideBar from './components/SideBar';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.hidden ? "0px 1fr" : "100px calc(100% - 100px)"};
    grid-template-rows: 80px calc(100% - 80px);
    width: 100%;
    height: 100%;

    @media only screen and (max-width: 800px) {
      grid-template-columns: ${props => props.hidden ? "100% 0px" : "0px 100%"};
    }
`

const Content = styled.div`
    display: block;
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    width: 100%;
    height: 100%;
    background-color: #f2f5ff;
    overflow: auto;
`;

const Dashboard = (props) => {
  // Props from previous render
  const prevProps = useRef(props)

  // Redux Dispatch 
  const dispatch = useDispatch()
  
  // State
  const [hidden, setHidden] = useState(false)
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  // Redux state
  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const photoURL = useSelector(state => state.authentication.user.photoURL)
  const selectedProduct = useSelector(state => state.product.selectedProduct)
  const products = useSelector(state => state.product.products)
        
  // Constructor and destructor
  useEffect(() => {
    // Update window dimensions
    updateWindowDimensions();
    // Add resize eventlinstener to window
    window.addEventListener('resize', updateWindowDimensions);

    // Remove eventlistener at unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, [])

  // At update change GUI to handle a small screen at less than 800px
  useEffect(() => {
    if (prevProps.current !== props) {
      if(width < 800) {
        if(prevProps.current.location.key !== props.location.key) {
          setHidden(false)
        }
      }
      prevProps.current = props
    }
  })

  // Update width and height state
  const updateWindowDimensions = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  // Hide or unhide sidebar
  const collapseSideBar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setHidden(!hidden)
  }
  
  // Update redux state with new product index
  const selectProduct = (index) => {
    dispatch(productActions.selectProduct(index))
  }

  return (
    <Grid hidden={hidden} >
      <Header onClickCollapse={collapseSideBar}
              hidden={hidden}
              firstname={firstname} 
              lastname={lastname} 
              profilePic={photoURL}>
      </Header>
      <SideBar hidden={hidden} 
               location={props.location} 
               selectProduct={selectProduct} 
               products={products} 
               selectedIndex={selectedProduct}>
      </SideBar>
      <Content hidden={hidden}>
        <props.content content={props.content}
                       finishLoading={props.finishLoading}
        />
      </Content>
    </Grid>
  );
}

Dashboard.propTypes = {
  finishLoading: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

export { Dashboard };