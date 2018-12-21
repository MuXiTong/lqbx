
import {
	USER_SIGNIN,
    USER_SIGNOUT,
	USER_REGISTER,
} from './mutation-types.js'


export default {

	[USER_SIGNIN](state, user) {
        sessionStorage.setItem('user', JSON.stringify(user))
        state.userInfo=user
    },
    [USER_SIGNOUT](state) {
        sessionStorage.removeItem('user')
        state.userInfo=""
    },
    [USER_REGISTER](state,registerInfo) {

        state.userInfo.push(registerInfo)
        sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        console.log(state)
    }

}
