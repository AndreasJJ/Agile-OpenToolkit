import { teamConstants } from '../constants/teams';

export function teams (state = { selectedTeam: 0 }, action) {
  switch (action.type) {
    case teamConstants.TEAM_SELECT_SUCCESS:
      return {
        selectedTeam: action.index
      };
    case teamConstants.TEAM_SELECT_FAILURE:
      return state;
    default:
      return state;
  }
}
