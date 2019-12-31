import React, {useEffect, useState, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocuments } from '../../../sharedComponents/Firebase';
import { FsTsToDate, DateToLocalString } from '../../../sharedComponents/Utility';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 800px) {
    padding: 0;
  }
`;

const Content = styled.div`
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 20px 10px 10px 10px;
  background-color: #ffffff;
  box-sizing: border-box;

  @media only screen and (max-width: 800px) {
    flex-direction: column-reverse;
  }
`

const SprintsList = styled.div`
  flex: 4;
  border: solid 1px #000000;
  overflow: auto;
`

const Sprint = styled.div`
    border-bottom: solid 1px #000000;
    padding: 10px;

    font-size: large;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Safari */
    -khtml-user-select: none;    /* Konqueror HTML */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;  /* Non-prefixed version, currently supported by Chrome and Opera */

    background-color: ${props => props.selected ? "#00b8fe" : null};
    color: ${props => props.selected ? "#ffffff" : null};

    &:hover {
        background-color: #2ECEFE;
        color: #ffffff;
    }
`

const SprintInfo = styled.div`
  flex: 6;
  padding: 0px 0px 0px 10px;
  overflow: auto;
`

const Title = styled.h2`
    margin-top: 0px;
`

const Description = styled.div`

`

const Dates = styled.div`

`

const ProgressWrapper = styled.div`

`

const ProgressBar = styled.progress`
  width: 100%;
`

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const View = styled.button`

`

const InfoPage = ({getAndShowSelectedSprint}) => {
    // Firebase
    const firebase = useContext(FirebaseContext)

    // Redux state
    const products = useSelector(state => state.product.products)
    const selectedProduct = useSelector(state => state.product.selectedProduct)

    // State
    const [sprints, setSprints] = useState([])
    const [selectedSprint, setSelectedSprint] = useState(0)

    useEffect(() => {
        const init = async () => {
            await getSprints()
        }
        init()
    }, [])

    const getSprints = async () => {
        console.log("/products/" + products[selectedProduct].id + "/sprints")
        let _sprints = await GetDocuments(firebase, "/products/" + products[selectedProduct].id + "/sprints", null, [["startDate", "desc"]])
        setSprints(_sprints)
    }

    const onSprintClick = (e) => {
        setSelectedSprint(parseInt(e.target.dataset.index))
    }

    const onShowSprintClick = () => {
        getAndShowSelectedSprint(sprints[selectedSprint].id)
    }

    return (
        <Wrapper>
            <Content>
                {
                    sprints && sprints.length > 0
                    ?
                        <SprintsList>
                            {
                                sprints && sprints.map((sprint, index) =>
                                    selectedSprint === index
                                    ?
                                        <Sprint selected={true} data-index={index} onClick={onSprintClick} key={sprint.id} >{sprint.title}</Sprint>
                                    :
                                        <Sprint data-index={index} onClick={onSprintClick} key={sprint.id}>{sprint.title}</Sprint>
                                )
                            }
                        </SprintsList>
                    :
                        null
                }
                {
                    sprints[selectedSprint]
                    ?
                        <SprintInfo>
                            <Title>{sprints[selectedSprint].title}</Title>
                            <Description>{sprints[selectedSprint].description}</Description>
                            <Dates>
                                {DateToLocalString(FsTsToDate(sprints[selectedSprint].startDate))} / {DateToLocalString(FsTsToDate(sprints[selectedSprint].dueDate))}
                            </Dates>
                            <ProgressWrapper>
                                <ProgressBar max={100} value={sprints[selectedSprint].totalIssues === 0 ? 100 : (sprints[selectedSprint].finishedIssues / sprints[selectedSprint].totalIssues)*100}>{sprints[selectedSprint].totalIssues === 0 ? 100 : (sprints[selectedSprint].finishedIssues / sprints[selectedSprint].totalIssues)*100}</ProgressBar>
                                <ProgressInfo>
                                <span>
                                    {sprints[selectedSprint].totalIssues ? sprints[selectedSprint].totalIssues : 0} Issues
                                </span>
                                <span>
                                    {sprints[selectedSprint].totalIssues === 0 ? 100 : (sprints[selectedSprint].finishedIssues ? sprints[selectedSprint].finishedIssues : 0  / sprints[selectedSprint].totalIssues)*100}%
                                </span>
                                </ProgressInfo>
                            </ProgressWrapper>
                            <View onClick={onShowSprintClick}>
                                View Sprintboard
                            </View>
                        </SprintInfo>
                    :
                        null
                }
            </Content>
        </Wrapper>
    );
}

InfoPage.propTypes = {
    getAndShowSelectedSprint: PropTypes.func.isRequired
}

export { 
    InfoPage 
} 