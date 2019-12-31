import React from 'react';
import { Link as rLink } from 'react-router-dom'
import PropTypes from 'prop-types';

import { Draggable } from 'react-beautiful-dnd';

import styled from 'styled-components';

const Card = styled.div`
    margin-bottom: 10px;
    padding: 10px;
    background-color: ${props => props.isDragging ? "#9ecaed" : "#F4F4F4"};

    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);

    outline: ${props => props.isDragging ? "none" : null};
    border-color: ${props => props.isDragging ? "#9ecaed" : null};
    box-shadow: ${props => props.isDragging ? "0 0 10px #9ecaed" : null};
`

const Title = styled.div`
    display: flex;
    align-items: center;
`

const Link = styled(rLink)`
    width: fit-content;
    color: #000000;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:visited {
        color: #000000;
    }

    &:hover {
        text-decoration: underline;
    }
`

const Labels = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 5px 0px;
`

const Label = styled.div`
    font-size: small;
    background-color: ${props => props.bc };
    color: #ffffff;
    padding: 2px;
    border-radius: 2px;
    margin-bottom: 4px;
`

const Creator = styled.div`
    font-size: small;
    color: #8a8a8a;
    margin-top: 4px;
`

const Body = styled.div`

`

const StoryCard = ({draggableId, index, title, labels, creator}) => {
    return (
        <Draggable draggableId={draggableId} index={index}>
            {(provided, snapshot) => (
                <Card {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef} 
                    isDragging={snapshot.isDragging}
                >
                    <Body>
                        <Title>
                            <Link to={"/backlog/issue/" + draggableId}>{title}</Link>
                        </Title>
                        <Labels>
                            {
                                labels && Object.keys(labels).map((label) => 
                                    <Label bc={labels[label].color} key={label}>{label}</Label>
                                )
                            }
                        </Labels>
                    </Body>
                    <Creator>
                        {creator.firstname + " " + creator.lastname}
                    </Creator>
                </Card>
            )}
        </Draggable>
    );
}

StoryCard.propTypes = {
    draggableId: PropTypes.string.isRequired, 
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired, 
    description: PropTypes.string.isRequired
}

export { 
    StoryCard 
} 