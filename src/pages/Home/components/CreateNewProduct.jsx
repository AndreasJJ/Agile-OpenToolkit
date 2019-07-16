import React from 'react';
import { connect } from 'react-redux';

import { alertActions } from '../../../state/actions/alert';

import TagsInput from '../../../sharedComponents/TagsInput';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Header = styled.h2`
  text-align: center;
`

const Form = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  overflow: auto;
`

const InputWrapper = styled.div`
  padding: 20px;
`

const Input = styled.input`
  font-size: 16px;
  color: #fff;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: #F4F4F4;
  outline: none;
  position: relative;
  border-style: none;
  border: 1px solid #dddfe6;
  border-radius: 4px;
  padding: 0px 10px 0px 10px;
  margin-bottom: 30px;
  color: #000000;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  background: #F4F4F4;
  border-top: 1px solid #dddfe6;
  padding: 10px;
`

const SubmitButton = styled.button`
    min-width: 200px;
    min-height: 60px;
    background-color: #4CAF50;
    color: #ffffff;
    border: none;
    -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
    -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

class CreateNewProduct extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      productName: "",
      productDescription: ""
    }

    this.sendProduct = this.sendProduct.bind(this)
    this.changeproductName = this.changeproductName.bind(this)
    this.changeproductDescription = this.changeproductDescription.bind(this)
  }

  componentDidMount() {

  }

  sendProduct(e) {
    e.preventDefault()
    const { dispatch } = this.props;

    let name = this.state.productName.trim()
    let description = this.state.productDescription.trim()

    if(name.length < 3 ) {
      dispatch(alertActions.error('The team name has to be at least 3 characters long'));
      return
    }

    if(description.length < 3 && description != null) {
      dispatch(alertActions.error('The description has to either be 3 characters long or empty'));
      return
    }
    if(description == "") {
      description = null
    }

    this.props.sendProduct({name: name, description: description})
    this.props.onclick()
  }

  changeproductName(e) {
    this.setState({
      productName: e.target.value
    });
  }

  changeproductDescription(e) {
    this.setState({
      productDescription: e.target.value
    });
  }

  render () {
    return(
      <Wrapper>
         <Header>
           Create New Product
         </Header>
         <Form>
           <InputWrapper>
             <label>Product Name</label>
             <Input placeholder="marvelous dog feeder" value={this.state.productName} onChange={this.changeproductName} />
             <label>Short Description</label>
             <Input placeholder="A product for the future." value={this.state.productDescription} onChange={this.changeproductDescription} />
             <label>Add Members</label>
             <TagsInput />
           </InputWrapper>
           <ButtonWrapper>
             <SubmitButton onClick={this.sendProduct}> Create Product! </SubmitButton>
           </ButtonWrapper>
         </Form>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
    return {
    };
}

const connectedCreateNewProduct = connect(mapStateToProps)(CreateNewProduct);
export { connectedCreateNewProduct as CreateNewProduct }; 