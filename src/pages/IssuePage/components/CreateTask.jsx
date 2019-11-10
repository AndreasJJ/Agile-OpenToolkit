import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
  border-bottom: 1px solid #e1e1e1;
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
  min-width: 100px;
`

const TitleInput = styled.input`
  width: 100%;
  margin: 0px 15px 0px 15px;
      border: 1px solid rgb(238,238,238);
`

const DescriptionWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  margin-top 15px;
  margin-bottom 15px;
`

const Description = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
  min-width: 100px;
`

const DescriptionArea = styled.textarea`
  width: 100%;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
  resize: none;
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

class CreateTask extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      submitDisabled: true,
      title: "",
      description: ""
    }

    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.sendTask = this.sendTask.bind(this)
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

  async sendTask() {
    let task = {
      title: this.state.title,
      description: this.state.description,
      status: "OPEN",
      timestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp()
    }
    await this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.issueId)
              .collection("tasks")
              .add(task)
    this.props.exit()
  }

  render () {
    return(
      <Wrapper>
        <Header>
          <h3>New Task</h3>
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
              <DescriptionArea placeholder="Write a comment..." 
                               value={this.state.description} 
                               onChange={this.onChangeDescription} />
            </DescriptionWrapper>
          </Info>
          <Action>
            <Submit disabled={this.state.submitDisabled} onClick={(e) => this.sendTask()}>
              Submit task
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

CreateTask.propTypes = {
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  exit: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { products, selectedProduct } = state.product
    return {
        products,
        selectedProduct
    };
}

const connectedTask = connect(mapStateToProps)(CreateTask);
const firebaseTask = compose(withFirebase)(connectedTask)
export { firebaseTask as CreateTask }; 