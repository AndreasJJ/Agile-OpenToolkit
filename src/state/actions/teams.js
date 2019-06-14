import { teamConstants } from '../constants/teams';
import { teamService } from '../services/teams';

export const teamActions = {
    selectTeam
};

function selectTeam(index) {
    return dispatch => {
        teamService.selectTeam(index)
            .then(
                index => { 
                    console.log(index)
                    dispatch(success(index));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function success(user) { return { type: teamConstants.TEAM_SELECT_SUCCESS, index } }
    function failure(error) { return { type: teamConstants.TEAM_SELECT_FAILURE, error } }
}