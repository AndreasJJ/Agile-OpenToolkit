import React from 'react';

import Pill from './Pill'

import styled from 'styled-components';

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
  margin-bottom: 5px;
  color: #000000;
`

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export default class TagsInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      tagsInputValue: '',
      tags: []
    }

    this.addTag = this.addTag.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  
  addTag(tag) {
    if (tag == '') return;

    tag = tag.trim();

    if(!(this.state.tags.indexOf(tag) > -1)) {
      let tags = this.state.tags.concat([tag]);
      this.updateTags(tags);
    }

    this.updateTagValue('');
  }

  updateTagValue(value) {
    if(value == ' ') {
      return;
    }
    this.setState({
      tagsInputValue: value
    })
  }

  removeTag(removeTag) {
    let tags = this.state.tags.filter((tag) => tag !== removeTag);
    this.updateTags(tags);
  }

  updateTags(tags) {
    this.setState({
      tags
    })
  }

  handleKeyPress(e) {
    console.log(e.key)
    if(e.key === ' '){
      this.addTag(e.target.value)
    }
  }

  render () {
    const {tagsInputValue, tags} = this.state;
    return (
      <div>
       <Input value={tagsInputValue} 
                  onChange={(e) => {this.updateTagValue(e.target.value);}} 
                  onKeyPress={this.handleKeyPress} 
                  type="text" placeholder="Members seperated by space"
        />
       <ValuesContainer>
        {tags && tags.map((tag, index) => <Pill key={index} onClear={() => this.removeTag(tag)} text={tag} />)}
       </ValuesContainer>
      </div>
    )
  }
}