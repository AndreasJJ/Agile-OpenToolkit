import React, {useState, useEffect, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocument, ListenToDocuments, BatchWrite } from '../../../sharedComponents/Firebase';

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
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
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
  padding: 10px;
  background-color: #00b8fe;
  color: #ffffff;
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
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

const ProductWidget = (props) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // Redux dispatch
  const dispatch = useDispatch()

  // Redux state
  const Guid = useSelector(state => state.authentication.user.uid)
  const Gemail = useSelector(state => state.authentication.user.email)
  const Gfirstname = useSelector(state => state.authentication.user.firstname)
  const Glastname = useSelector(state => state.authentication.user.lastname)
  const Gproducts = useSelector(state => state.product.products)
  const GselectedProduct = useSelector(state => state.product.selectedProduct)

  // State
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(0)

  let productListener;

  // Constructor
  useEffect(() => {
    const init = async () => {
      // On change function
      const onSnapshot = async (querySnapshot) => {
        // Loop over all documents, get their data and id
        let tempArray = querySnapshot.docs
                                     .map((doc) => {
                                        let obj = doc.data()
                                        obj.id = doc.id
                                        return obj
                                      })
        // Set the globally selected product
        let globalSelectedProduct = Gproducts[GselectedProduct]
        
        // Set the new globally selected product index
        let newGlobalSelectedProductIndex;
        if(globalSelectedProduct) {
          newGlobalSelectedProductIndex = tempArray.findIndex(product => product.id === globalSelectedProduct.id).toString()
        } else {
          newGlobalSelectedProductIndex = 0
        }

        // If theres more of the newly retrived documents then the state products length
        // and this is not the constructor call (first time it gets called) then
        // clear alerts and dispatch success alert
        if(tempArray.length > products.length && !loading) {
          dispatch(alertActions.clear())
          dispatch(alertActions.success('Product successfully added'))
        }

        // Set product and loading state
        await setProducts(tempArray)
        await setLoading(false)

        // Dispatch the newly retrived products
        dispatch(productActions.getProducts(tempArray))

        // If the globally selected product is not the same as the new globally selected product index
        // then dispatch the newly selected product index
        if(GselectedProduct !== newGlobalSelectedProductIndex) {
          dispatch(productActions.selectProductRecalibration(newGlobalSelectedProductIndex))
        }
      }

      // set the product linstener so that it can be unmounted at unmount
      productListener = await ListenToDocuments(firebase, onSnapshot, "users/" + Guid + '/products')
    }
    init()

    return () => {
      productListener()
    }
  }, [])

  // Function to add product to database
  const createProduct = (product) => {
    let batch = []

    let productId = (firebase.db.collection("products").doc()).id

    //Write product
    let productPath = "products/" + productId
    let productData = {
      name: product.name,
      description: product.description,
      owner: {
         uid: Guid,
         firstname: Gfirstname,
         lastname: Glastname 
      }
    }
    batch.push([productPath, productData])

    // Write role
    let rolesPath = "products/" + productId + "/roles/" + Guid
    let rolesData = {
      role: 1
    }
    batch.push([rolesPath, rolesData])

    // Write Member
    let memberPath = "products/" + productId + "/members/" + Guid
    let memberData = {
      email: Gemail,
      firstname: Gfirstname,
      lastname: Glastname
    }
    batch.push([memberPath, memberData])

    // Start batch write
    BatchWrite(firebase, batch, () => {
        dispatch(alertActions.info('Please wait while we create your new product'))
    })
  }

  const AddProductButtonClicked = () => {
    setShowModal(true)
    setModalContent("productCreation")
  }

  // Function to get the member list of a product
  const getMembers = async (productId) => {
    let doc = await GetDocument(firebase, "products/" + productId + "/members/members")
    return doc.list
  }

  // Function to show members on a product
  const showMembersButtonClicked = (e) => {
    if(e.target.tagName == "path") {
      setSelectedProduct(e.target.parentNode.parentNode.parentNode.dataset.productindex)
    } else if(e.target.tagName == "svg") {
      setSelectedProduct(e.target.parentNode.parentNode.dataset.productindex)
    } else if(e.target.tagName == "BUTTON") {
     setSelectedProduct(e.target.parentNode.dataset.productindex)
    }
    setShowModal(true)
    setModalContent("showMembers")
  }

  // Function to close modal
  const closeModal = () => {
    setShowModal(false)
    setModalContent("")
  }

  // Modal contant depends on what the state modalContent is.
  let modal = <Modal />
  // For product creation
  if(modalContent == "productCreation") {
    modal = <Modal content={<Tabs tabNames={["Create New Product", "Join Product Team"]} 
                                  tabComponents={[<CreateNewProduct 
                                  sendProduct={createProduct} 
                                  onclick={closeModal} />, <JoinProductTeam />]} />
                            } 
                   exitModalCallback={closeModal} />
  // For showing product members
  } else if (modalContent == "showMembers") {
    modal = <Modal content={<ProductMembers products={products} 
                                            productIndex={selectedProduct} 
                                            getMembers={getMembers} /> 
                            } 
                  minWidth={"400px"} 
                  maxWidth={"400px"} 
                  exitModalCallback={closeModal} />
  }

  return(
  <Widget>
    {
      showModal
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
          {
            loading
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
              products 
              && products.map((product, index) => 
                                <Product key={index} 
                                         onclick={showMembersButtonClicked} 
                                         productIndex={index} 
                                         name={product.name} 
                                         owner={product.owner}/>
                              )
          }
        </ProductList>
        <AddProductButton onClick={AddProductButtonClicked}>
          Add Product
        </AddProductButton>
      </WidgetBody>
    </Content>
  </Widget>
  )
}

export { ProductWidget }