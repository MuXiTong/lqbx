import {
	USER_SIGNIN,
    USER_SIGNOUT,
	USER_REGISTER,
} from './mutation-types.js'

export default {
	[USER_SIGNIN]({commit}, user) {
        commit(USER_SIGNIN, user)
    },
    [USER_SIGNOUT]({commit}) {
        commit(USER_SIGNOUT)
    },
    [USER_REGISTER]({commit},registerInfo){
        commit(USER_REGISTER,registerInfo)
    }
}