import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { productActions } from '../../state/actions/product';

import styled from 'styled-components';

import Header from './components/Header';
import SideBar from './components/SideBar';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.hidden ? "0px 1fr" : "200px calc(100% - 200px)"};
    grid-template-rows: 80px calc(100% - 80px);
    width: 100%;
    height: 100%;

    @media only screen and (max-width: 800px) {
      grid-template-columns: ${props => props.hidden ? "1fr 0px" : "0px 1fr"};
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
  const prevProps = useRef(props)

  const dispatch = useDispatch()
  
  const [hidden, setHidden] = useState(false)
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const photoURL = useSelector(state => state.authentication.user.photoURL)
  const selectedProduct = useSelector(state => state.product.selectedProduct)
  const products = useSelector(state => state.product.products)
        
  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, [])

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

  const updateWindowDimensions = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  const collapseSideBar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setHidden(!hidden)
  }

  const logout = () => {
    props.history.push('/logout')
  }

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
      <SideBar onClickLogout={logout} 
               hidden={hidden} 
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