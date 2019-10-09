import React from 'react';

import styled from 'styled-components';
import {Add} from 'styled-icons/material/Add';
import {Times} from 'styled-icons/fa-solid/Times';

const List = styled.div`
  background-color: #dfe3e6;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

const ListHeader = styled.div`
  padding-right: 36px;
  flex: 0 0 auto;
  padding: 10px 8px 8px;
  position: relative;
  min-height: 20px;
`;

const ListStory = styled.div`
    flex: 1 1 auto;
    margin-bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 4px;
    padding: 0 4px;
`;

const ListComposeStory = styled.div`
  border-radius: 0 0 3px 3px;
  color: #6b808c;
  display: block;
  flex: 0 0 auto;
  padding: 8px;
`;

const AddIcon = styled(Add)`
  margin-right: 5px;
`

const Story = styled.div`
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,45,66,.25);
    cursor: pointer;
    display: block;
    margin-bottom: 8px;
    max-width: 300px;
    min-height: 20px;
    display: flex;
`;

const StoryName = styled.span`
    overflow: hidden;
    padding: 7px 5px 7px 5px;
`;

const AddStoryInputWrapper = styled.div`
  margin: 0 4px 4px;
  padding: 0 4px 4px;
`;

const AddStoryTextArea = styled.textarea`
  width: 100%;
  height: 50px;
  resize: vertical;
`;

const AddStoryControlsWrapper = styled.div`
  display: flex;
  flex-direction: horizontal;
  margin-top: 5px;
  justify-content: end;
  align-items: center;
`;

const AddStoryButton = styled.button`
    background-color: #5aac44;
    box-shadow: 0 1px 0 0 #3f6f21;
    border: none;
    color: #fff;
    width: 85px;
    height: 35px;
    margin-right: 5px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class BoardList extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      inputingStory: false,
      storyName: ""
    };

    this.clickAddStory = this.clickAddStory.bind(this)
    this.clickStopAddStory = this.clickStopAddStory.bind(this)
    this.clickSendStory = this.clickSendStory.bind(this)
    this.changeInputValue = this.changeInputValue.bind(this)
  }

  componentDidMount() {

  }

  clickAddStory() {
    this.setState({inputingStory: true})
  }

  clickStopAddStory() {
    this.setState({inputingStory: false})
  }

  clickSendStory() {
    this.props.sendStory();
    this.setState({inputingStory: false})
  }

  static AddStory = (props) => (
    props.state ? <BoardList.AddStoryInput inputValue={props.inputValue} 
                                           inputOnChange={props.inputOnChange} 
                                           sendOnClick={props.AddStoryInputSendOnClick} 
                                           onclick={props.addStoryInputOnClick} /> 
                : <BoardList.AddStoryButton onclick={props.addStoryButtonOnClick} />
  );

  static AddStoryButton = (props) => (
      <ListComposeStory onClick={props.onclick}>
        <AddIcon size="1em" />
        <span>Add another story</span>
      </ListComposeStory>
  );

  static AddStoryInput = (props) => (
      <AddStoryInputWrapper>
        <AddStoryTextArea value={props.inputValue} onChange={e => props.inputOnChange(e.target.value)} />
        <AddStoryControlsWrapper>
          <AddStoryButton onClick={props.sendOnClick}>Add Story</AddStoryButton>
          <Times size="1.5em" onClick={props.onclick} />
        </AddStoryControlsWrapper>
      </AddStoryInputWrapper>
  );

  changeInputValue(value) {
    this.setState({
      storyName: value
    });
  }

  render() {

    return (
     <List>
       <ListHeader>{this.props.name}</ListHeader>
       <ListStory>
         {
           this.props.list.map((item, index) => {
              return( <Story key={index}>
                        <StoryName>{item.name}</StoryName>
                      </Story>
                    )
          })
         }
       </ListStory>
       <BoardList.AddStory state={this.state.inputingStory} 
                           inputValue={this.state.storyName} 
                           inputOnChange={this.changeInputValue} 
                           AddStoryInputSendOnClick={this.clickSendStory} 
                           addStoryInputOnClick={this.clickStopAddStory} 
                           addStoryButtonOnClick={this.clickAddStory}  />
     </List>
    );
  }
}