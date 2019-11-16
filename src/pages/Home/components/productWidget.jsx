import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import { productActions } from '../../../state/actions/product';
import { userActions } from '../../../state/actions/user';
import { alertActions } from '../../../state/actions/alert';

import JoinProductTeam from './JoinProductTeam';
import { CreateNewProduct } from './CreateNewProduct';
import ProductMembers from './ProductMembers';
import Product from './Product'

import Modal from '../../../sharedComponents/Modal';
import Tabs from '../../../sharedComponents/Tabs';

import styled from 'styled-components';

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

  @media only screen and (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
  }
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
  padding: 10px
  overflow: auto;
`

const ProductList = styled.div`
  flex-grow: 1;
  overflow: auto;
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
      firstProductLoad: true,
      loading: true,
      products: [],
      showModal: false,
      modalContent: "",
      selectedProduct: 0
    };

    this.createProduct = this.createProduct.bind(this)
    this.AddProductButtonClicked = this.AddProductButtonClicked.bind(this)
    this.getMembers = this.getMembers.bind(this)
    this.showMembersButtonClicked = this.showMembersButtonClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  async componentDidMount() {
    const onSnapshot = async (querySnapshot) => {
      let tempArray = querySnapshot.docs.map((doc) => {
                                                let obj = doc.data()
                                                obj.id = doc.id
                                                return obj
                                              })
      let globalSelectedProduct = this.props.products[this.props.selectedProduct]
      
      let newGlobalSelectedProductIndex;
      if(globalSelectedProduct) {
        newGlobalSelectedProductIndex = tempArray.findIndex(product => product.id === globalSelectedProduct.id).toString()
      } else {
        newGlobalSelectedProductIndex = 0
      }

      if(tempArray.length > this.state.products.length && !this.state.loading) {
        this.props.dispatch(alertActions.clear())
        this.props.dispatch(alertActions.success('Product successfully added'))
      }

      await this.setState({products: tempArray, loading: false})

      this.props.dispatch(productActions.getProducts(tempArray))
      if(this.props.selectedProduct !== newGlobalSelectedProductIndex) {
        this.props.dispatch(productActions.selectProductRecalibration(newGlobalSelectedProductIndex))
      }
    }

    this.productListener = await this.props.firebase
                                           .db
                                           .collection('users')
                                           .doc(this.props.uid)
                                           .collection('products')
                                           .onSnapshot(onSnapshot);

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
    
    batch.commit().then(() => {
        this.props.dispatch(alertActions.info('Please wait while we create your new product'))
    });
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
               (["skeletonProduct1", 
                 "skeletonProduct2", 
                 "skeletonProduct3"]).map((key, index) => 
                                            <Product skeleton={true} 
                                                     key={key} 
                                                     onclick={() => false} 
                                                     productIndex={index} 
                                                     name={"Skeleton name"} 
                                                     owner={{firstname: "god", lastname: "the creator"}}/>
                                          )
              :
               this.state.products 
               && this.state.products.map((product, index) => 
                                          <Product key={index} 
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

ProductWidget.propTypes = {
  uid: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired
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