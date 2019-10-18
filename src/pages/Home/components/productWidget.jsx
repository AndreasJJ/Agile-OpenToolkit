import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import { productActions } from '../../../state/actions/product';
import { userActions } from '../../../state/actions/user';
import { alertActions } from '../../../state/actions/alert';

import JoinProductTeam from './JoinProductTeam';
import { CreateNewProduct } from './CreateNewProduct';
import ProductMembers from './ProductMembers';

import Modal from '../../../sharedComponents/Modal';
import Tabs from '../../../sharedComponents/Tabs';

import styled from 'styled-components';
import {People} from 'styled-icons/material/People';
import {Crown} from 'styled-icons/fa-solid/Crown';

const Widget = styled.div`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  display: flex;
  margin: 20px;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const WidgetHeader = styled.div`
  padding: 10px
  background-color: #00b8fe;
  color: #ffffff;
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px
`

const ProductList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: auto;
`

const ProductCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  border-bottom: 0.5px solid lightgray;
  padding-bottom: 5px;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;

  & > span {
    margin-bottom: 2px;
    color: ${props => props.skeleton ? "transparent" : null} !important;
    background-color: ${props => props.skeleton ? "lightgray" : null}
  }
`

const Members = styled.button`
  height: 30px;
`

const AddProductButton = styled.button`
  min-width: 200px;
  min-height: 60px;
  background-color: #3272bc;
  color: #ffffff;
  border: none;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

class ProductWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      products: [],
      showModal: false,
      modalContent: "",
      selectedProduct: 0
    };

    this.createProduct = this.createProduct.bind(this)
    this.productAdded = this.productAdded.bind(this)
    this.AddProductButtonClicked = this.AddProductButtonClicked.bind(this)
    this.getMembers = this.getMembers.bind(this)
    this.showMembersButtonClicked = this.showMembersButtonClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  async componentDidMount() {
    this.productListener = await this.props.firebase
                                           .db
                                           .collection('users')
                                           .doc(this.props.uid)
                                           .collection('products')
                                           .onSnapshot(async function(querySnapshot) {
                                              let tempArray = querySnapshot.docs.map((doc) => {
                                                let obj = doc.data()
                                                obj.id = doc.id
                                                return obj
                                              })
                                              let globalSelectedProduct = this.props.products[this.props.selectedProduct]
                                              let newGlobalSelectedProductIndex = tempArray.findIndex(product => product.id === globalSelectedProduct.id).toString()

                                              await this.setState({products: tempArray, loading: false})

                                              this.props.dispatch(productActions.getProducts(tempArray))
                                              if(this.props.selectedProduct !== newGlobalSelectedProductIndex) {
                                                this.props.dispatch(productActions.selectProductRecalibration(newGlobalSelectedProductIndex))
                                              }
                                            }.bind(this));
  }

  componentWillUnmount() {
    this.productListener()
  }

  createProduct(product) {
    var batch = this.props.firebase.db.batch();

    var productsRef = this.props.firebase
                                .db
                                .collection("products")
                                .doc();
    batch.set(productsRef, {
      name: product.name,
      description: product.description,
      owner: {
         uid: this.props.uid,
         firstname: this.props.firstname,
         lastname: this.props.lastname 
      }
    });

    var rolesRef = this.props.firebase
                             .db.collection("products")
                             .doc(productsRef.id)
                             .collection("roles")
                             .doc(this.props.uid);
    batch.set(rolesRef, {
      role: 1
    });

    var membersRef = this.props.firebase
                               .db
                               .collection("products")
                               .doc(productsRef.id)
                               .collection("members")
                               .doc(this.props.uid);
    batch.set(membersRef, {
      email: this.props.email,
      firstname: this.props.firstname,
      lastname: this.props.lastname
    });
    
    batch.commit().then(function () {
        
    });
  }

  productAdded() {
    this.props.dispatch(alertActions.success('Team successfully added'))
  }

  AddProductButtonClicked() {
    this.setState({showModal: true, 
                   modalContent: "productCreation"
                  })
  }

  async getMembers(productId) {
    let docSnapshot = await this.props.firebase
                                        .db
                                        .collection('products')
                                        .doc(productId)
                                        .collection('members')
                                        .doc('members')
                                        .get()
    return docSnapshot.data().list
  }

  showMembersButtonClicked(e) {
    if(e.target.tagName == "path") {
      this.setState({selectedProduct: e.target.parentNode.parentNode.parentNode.dataset.productindex})
    } else if(e.target.tagName == "svg") {
      this.setState({selectedProduct: e.target.parentNode.parentNode.dataset.productindex})
    } else if(e.target.tagName == "BUTTON") {
     this.setState({selectedProduct: e.target.parentNode.dataset.productindex})
    }
    this.setState({showModal: true, modalContent: "showMembers"})
  }

  closeModal() {
    this.setState({showModal: false, modalContent: ""})
  }

  static Product = (props) => (
      <ProductCard data-productindex={props.productIndex}>
        <Left skeleton={props.skeleton}>
          <span><b>{props.name}</b></span>
          <span>
            <Crown size="1em" />
            <i>
              {
                props.owner.firstname 
                ? 
                  (" " + props.owner.firstname.charAt(0).toUpperCase() + props.owner.firstname.slice(1)) 
                : 
                  null 
              }
              {
                props.owner.lastname 
                ? 
                  (" " + props.owner.lastname) 
                : 
                  null
              }
            </i>
          </span>
        </Left>
        <Members onClick={props.onclick}> <People size="1em" /></Members>
      </ProductCard>
  );

  render () {
    let modal = <Modal />

    if(this.state.modalContent == "productCreation") {
      modal = <Modal content={<Tabs tabNames={["Create New Product", "Join Product Team"]} 
                                    tabComponents={[<CreateNewProduct 
                                    sendProduct={this.createProduct} 
                                    onclick={this.closeModal} />, <JoinProductTeam />]} />
                              } 
                     exitModalCallback={this.closeModal} />
    } else if (this.state.modalContent == "showMembers") {
      modal = <Modal content={<ProductMembers products={this.state.products} 
                                              productIndex={this.state.selectedProduct} 
                                              getMembers={this.getMembers} /> 
                              } 
                    minWidth={"400px"} 
                    maxWidth={"400px"} 
                    exitModalCallback={this.closeModal} />
    }

    return(
    <Widget>
      {
        this.state.showModal
        ?
          modal
        :
          null
      }
      <Content>
        <WidgetHeader>
          Products
        </WidgetHeader>
        <WidgetBody>
          <ProductList>
            {this.state.loading
             ?
               (["skeletonProduct1", "skeletonProduct2", "skeletonProduct3"]).map((key, index) => 
                                                                                    <ProductWidget.Product skeleton={true} 
                                                                                                           key={key} 
                                                                                                           onclick={() => false} 
                                                                                                           productIndex={index} 
                                                                                                           name={"Skeleton name"} 
                                                                                                           owner={{firstname: "god", lastname: "the creator"}}/>
                                                                                  )
              :
               this.state.products 
               && this.state.products.map((product, index) => 
                                          <ProductWidget.Product key={index} 
                                                                 onclick={this.showMembersButtonClicked} 
                                                                 productIndex={index} 
                                                                 name={product.name} 
                                                                 owner={product.owner}/>
                                        )
            }
          </ProductList>
          <AddProductButton onClick={this.AddProductButtonClicked}>
            Add Product
          </AddProductButton>
        </WidgetBody>
      </Content>
    </Widget>
    )
  }
}

function mapStateToProps(state) {
    const { uid, email, firstname, lastname} = state.authentication.user;
    const { products, selectedProduct } = state.product;
    return {
      uid,
      email,
      firstname,
      lastname,
      products,
      selectedProduct
    };
}

const connectedProductWidget = connect(mapStateToProps)(ProductWidget);
const firebaseProductWidget = compose(withFirebase)(connectedProductWidget)
export { firebaseProductWidget as ProductWidget };