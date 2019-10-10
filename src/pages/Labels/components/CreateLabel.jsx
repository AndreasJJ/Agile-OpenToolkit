import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './../../../sharedComponents/Firebase';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  border-bottom: 1px solid #e1e1e1;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const TitleWrapper = styled.div`
  display: flex;
  margin-top 15px;
`

const Title = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
`

const TitleInput = styled.input`
  width: 100%;
  margin: 0px 15px 0px 15px;
      border: 1px solid rgb(238,238,238);
`

const DescriptionWrapper = styled.div`
  display: flex;
  margin-top 15px;
`

const Description = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
`

const DescriptionInput = styled.input`
  width: 100%;
  margin: 0px 15px 0px 15px;
      border: 1px solid rgb(238,238,238);
`

const ColorSelectWrapper = styled.div`
  display: flex;
  margin-top 15px;
  margin-bottom 15px;
`

const ColorSelect = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
`

const ColorInput = styled.input`
  width: 100%;
  margin: 0px 15px 0px 15px;
      border: 1px solid rgb(238,238,238);
`

const Action = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e1e1e1;
  margin-top: 24px;
  padding: 16px;
  background-color: #fafafa;
`

const Submit = styled.button`
  border-radius: 3px
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

const Cancel = styled.button`
  border-radius: 3px
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

class CreateLabel extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      submitDisabled: true,
      title: "",
      description: "",
      color: this.getRandomColor()
    }

    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeColor = this.onChangeColor.bind(this)
    this.sendLabel = this.sendLabel.bind(this)
  }

  componentDidMount() {

  }

  onChangeTitle(e) {
    let isSubmitDisabled = e.target.value === "" ? true : false

    this.setState({title: e.target.value, 
                   submitDisabled: isSubmitDisabled
                 })
  }

  onChangeDescription(e) {
    this.setState({description: e.target.value})
  }

  onChangeColor(e) {
    this.setState({color: e.target.value})
  }

  async sendLabel() {
    let label = {
      ["list." + this.state.title] : {
        color: this.state.color,
        description: this.state.description
      }
    }
     await this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("labels")
              .doc("list")
              .update(label)
    this.props.finished()
    this.props.exit()
  }

  getRandomColor(numOfSteps = 40, step = Math.floor(Math.random() * 40)+1) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }

  render () {
    return(
      <Wrapper>
        <Header>
          <h3>New Label</h3>
        </Header>
        <Body>
          <Info>
            <TitleWrapper>
              <Title>Title</Title>
              <TitleInput placeholder="Title" 
                          value={this.state.title} 
                          onChange={this.onChangeTitle} />
            </TitleWrapper>
            <DescriptionWrapper>
              <Description>Description</Description>
              <DescriptionInput placeholder="Write a comment..." 
                               value={this.state.description} 
                               onChange={this.onChangeDescription} />
            </DescriptionWrapper>
            <ColorSelectWrapper>
              <ColorSelect>Color</ColorSelect>
              <ColorInput type="color" value={this.state.color} onChange={this.onChangeColor}></ColorInput>
            </ColorSelectWrapper>
          </Info>
          <Action>
            <Submit disabled={this.state.submitDisabled} onClick={(e) => this.sendLabel()}>
              Submit Label
            </Submit>
            <Cancel onClick={(e) => this.props.exit()}>
              Cancel
            </Cancel>
          </Action>
        </Body>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    const { products, selectedProduct } = state.product
    return {
        user,
        products,
        selectedProduct
    };
}

const connectedCreateLabel = connect(mapStateToProps)(CreateLabel);
const firebaseCreateLabel = compose(withFirebase)(connectedCreateLabel)
export { firebaseCreateLabel as CreateLabel }; 