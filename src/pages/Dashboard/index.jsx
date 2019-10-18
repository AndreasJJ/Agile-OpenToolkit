import React from 'react';
import { connect } from 'react-redux';

import { productActions } from '../../state/actions/product';

import styled from 'styled-components';

import Header from './components/Header';
import SideBar from './components/SideBar';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.hidden ? "0px 100%" : "200px calc(100% - 200px);"};
    grid-template-rows: 80px calc(100% - 80px);
    width: 100%;
    height: 100%;
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
        <Content>
          <this.props.content {...this.props} />
        </Content>
      </Grid>
    );
  }
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
