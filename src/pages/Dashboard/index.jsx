import React from 'react';
import { connect } from 'react-redux';
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

class Dashboard extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      hidden: false
    };

    this.collapseSideBar = this.collapseSideBar.bind(this)
    this.logout = this.logout.bind(this)
    this.selectProduct = this.selectProduct.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps) {
    if(this.state.width < 800) {
      if(prevProps.location.key !== this.props.location.key) {
        this.setState({
          hidden: false
        })
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
  }

  collapseSideBar() {
    event.preventDefault();
    event.stopPropagation();
    this.setState(state => ({ hidden: !state.hidden }));
  }

  logout() {
    this.props.history.push('/logout')
  }

  selectProduct(index) {
    this.props.dispatch(productActions.selectProduct(index))
  }

  render() {
    return (
      <Grid hidden={this.state.hidden} >
        <Header onClickCollapse={this.collapseSideBar}
                hidden={this.state.hidden}
                firstname={this.props.firstname} 
                lastname={this.props.lastname} 
                profilePic={this.props.photoURL}>
        </Header>
        <SideBar onClickLogout={this.logout} 
                 hidden={this.state.hidden} 
                 location={this.props.location} 
                 selectProduct={this.selectProduct} 
                 products={this.props.products} 
                 selectedIndex={this.props.selectedProduct}>
        </SideBar>
        <Content hidden={this.state.hidden}>
          <this.props.content content={this.props.content}
                              finishLoading={this.props.finishLoading}
          />
        </Content>
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  finishLoading: PropTypes.func.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  location: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
    const { firstname, lastname, photoURL } = state.authentication.user;
    const { selectedProduct, products } = state.product;
    return {
        firstname,
        lastname,
        photoURL,
        selectedProduct,
        products
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };
